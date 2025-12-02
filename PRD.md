# Paralegal API – Product Requirements

## Product Summary
- A NestJS HTTP API that masks sensitive entities in free‑text input using rule-based detection (regex/specifications) plus an LM Studio–compatible LLM matcher, then stores both the masked output and an audit trail of changes.
- Consumers post transactions to `/api/transactions`; the service returns masked text and persisted change records and allows querying prior transactions.
- Storage uses a local Realm database file (`paralegal.realm`) with domain-driven modules (use cases, domain services, repositories, DI containers).

## Goals
- Provide a reliable, configurable masking pipeline for common PII (phone, email, card, passport, TIN) with multiple masking modes.
- Support extension via custom queries/LLM spans and new rule kinds without rewriting the API surface.
- Persist the full transaction history and per-span change records for audit and troubleshooting.
- Ship a lightweight developer experience (simple local bootstrap, clear aliases, validation, CORS on).

## Out of Scope (current state)
- Authentication/authorization (JWT helpers exist but unused).
- External storage or multi-tenant hosting; data lives in the local Realm file.
- Managed/hosted LLMs or resiliency features (retries, quotas); current integration assumes a reachable local LM Studio/OpenAI-compatible endpoint.
- Notifications/async processing; all masking runs synchronously within the request.

## Users & Top Use Cases
- **Internal app/front-end** that needs masked text and explanations of what was masked.
- **Ops/analysts** reviewing transaction history and change logs.
- **Engine developers** adding rules, specifications, or an LLM provider.

## System Architecture
- **API layer**: `src/infrastructure/controllers/controller.ts` exposes `/api` routes; global validation pipe with whitelist/forbidNonWhitelisted; CORS enabled.
- **Use cases**: `src/app/usecases/*` orchestrate masking (`process-transaction`) and reads (`get-transactions`, `get-transaction`).
- **Domain services**:
  - Processing config (`ProcessingConfigService`) builds a `ProcessingConfig` from user choices and masking mode.
  - Masking engine combines algorithmic matcher, LLM provider, merger, and masker; change service builds audit records.
  - LLM provider gateway (`src/infrastructure/gateways/llm-provider/llm-provider.ts`) calls an LM Studio/OpenAI chat completions endpoint with a structured redaction prompt and returns spans parsed from the model response.
  - Transaction/change services wrap repositories.
- **Data layer**: Realm-backed repositories (`src/infrastructure/data/mongo/repositories/*`) persist `Transaction` and `Change` objects; schema in `.../schemas/*`.
- **DI/containers**: Modules under `src/infrastructure/di/common/modules` wire symbols to concrete implementations; `CoreContainer` bootstraps Realm + AppModule.
- **Config**: `src/infrastructure/config/config.ts` loads env vars (`PORT`, `MONGODB_URI`, JWT placeholders); LLM gateway reads `LMSTUDIO_HOST`, `LMSTUDIO_MODEL`, `LMSTUDIO_TEMPERATURE`, `LMSTUDIO_MAX_TOKENS` (defaults to `http://127.0.0.1:1234/v1/chat/completions`, `google/gemma-3-12b`, `0.3`, `2048`).

## Domain Model (key)
- **Transaction**: `id`, `choices`, `customQueries`, `inputText`, `finalText`, `stats` (object), `status` (`pending|finished|failed`), `errorMessage`, timestamps.
- **Span**: `kind`, `start/end`, `before/after`, `actor` (`algorithm|llm|final`), optional `confidence`.
- **Change**: linked to `transactionId` (and optional `runId`), stores before/after values plus context slices and confidence/resolution.
- **Enums/config**:
  - `RuleKind`: `phone|email|card|passport|tin`.
  - `MaskingMode`: `full`, `readable_full`, `keep_tail`, `keep_head_tail`.
  - `RulePriority`: card > passport > tin > email > phone.

## Processing Flow (Process Transaction)
1) Controller validates `ProcessTransactionDto` and builds params (`inputText`, `choices`, `customQueries`, `maskingMode`, optional `tailLength` unused today).  
2) `ProcessingConfigService` marks which rule kinds are enabled and passes masking mode/custom queries.  
3) `TransactionService.create` constructs a `Transaction` (not yet persisted).  
4) Masking engine steps:
   - **Algorithmic matcher** runs regex/spec rules per enabled kinds (phone/email/card/passport/tin). Specifications prevent false positives (e.g., Uzbek phone, not-card-like phone).
   - **LLM provider** (`LlmProviderImpl`) calls LM Studio/OpenAI chat completions with the redaction system prompt, passing the raw text, enabled regex categories, `customQueries`, and `maskingMode`; expects JSON `entities` with `kind`, `start/end`, `confidence`. Invalid coordinates or empty spans are dropped; `after` is normalized to `[KIND]` from the returned `kind`.
   - **Merger** drops LLM spans of “obvious” kinds, merges, and resolves overlaps via priority, span length, actor preference (algorithm over llm), then confidence.
   - **Masker** applies masking mode policies:
     - `full`: mask all characters,
     - `readable_full`: replace with `[MASKED_DATA]`,
     - `keep_tail`: mask head, keep last N (default 2),
     - `keep_head_tail`: keep first/last N (default 2/2).
5) `ChangeService.buildChanges` diff-spans against original/masked text, captures contexts, stores each change via repository.
6) `TransactionService.writeResult` writes final text/stats/status to Realm (`TransactionRealm`), marking processed timestamp.
7) Presenter returns `{ finalText, changes[] }`.

## APIs (current)
- `POST /api/transactions`  
  - Body: `{ inputText: string, choices: RuleKind[], customQueries: string[], maskingMode: MaskingMode, tailLength?: number }`  
  - Response: `{ finalText: string, changes: ChangeDto[] }`.
- `GET /api/transactions?page&limit`  
  - Response: pagination metadata + `transactions[]` (includes masked/unmasked text, status, timestamps).
- `GET /api/transactions/:id`  
  - Response: `{ transaction, changes[] }`.
- Validation via `class-validator` DTOs; errors mapped through `getExceptionByError`.

## Data/Storage
- Realm database file `paralegal.realm` created locally; schemas in `src/infrastructure/data/mongo/schemas/*`.
- Repositories convert between Realm objects and domain entities; pagination executed in-memory on sorted realm objects.
- Mongoose wiring exists but is unused; Mongo env vars currently only used by the unused Mongoose module.

## Operational Notes
- Tooling: Node 18+, npm, NestJS 11, Realm SDK.  
- Commands: `npm install`; `npm run start:dev`; build with `npm run build`; tests `npm test` (few/no specs today).  
- Paths/aliases: `domain/*`, `usecases/*`, `infrastructure/*`, `di/*`, `services/*`.  
- CORS enabled; no auth middleware. Logging is console-based. No metrics/tracing.
- LLM: defaults to `http://127.0.0.1:1234/v1/chat/completions` with model `google/gemma-3-12b`; override via `LMSTUDIO_HOST`, `LMSTUDIO_MODEL`, `LMSTUDIO_TEMPERATURE`, `LMSTUDIO_MAX_TOKENS`. If the endpoint is unreachable or responds with non-string content, the provider returns an empty span list.

## Risks & Open Questions
- Transaction lifecycle: `TransactionService.create` does not call repository `create`; `writeResult` assumes an existing record—should transactions be persisted before processing?  
- LLM reliance: prompt adherence and coordinate accuracy depend on the LM Studio/OpenAI model; errors currently log to console and return `[]` with no retries/timeouts, so LLM failures may silently drop spans. `after` tokens are derived from `kind`, ignoring model-suggested replacements.  
- `tailLength` is accepted but unused in masking policies; clarify intended behavior.  
- Persistence/consistency: Realm is local file only; do we need cloud/shared DB or backups?  
- Validation: `choices` are free-form arrays of strings; should they be restricted to known `RuleKind` values?  
- Security: no authentication/authorization; JWT configs are unused.  
- Observability & error taxonomy: domain errors exist but not wired in the current flows; no structured logging/metrics.

## Onboarding Checklist
- Install dependencies (`npm install`) and start dev server (`npm run start:dev`); API on `PORT` (default 3000).  
- Ensure an LM Studio/OpenAI-compatible server is running (default `http://127.0.0.1:1234/v1/chat/completions`) or set `LMSTUDIO_HOST`/`LMSTUDIO_MODEL` before expecting LLM spans.  
- Send a sample request:
  ```bash
  curl -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d '{"inputText":"Call me at +1 (555) 555-5555","choices":["phone","email","card","passport","tin"],"customQueries":[],"maskingMode":"keep_tail"}'
  ```
- Inspect stored data with Realm Studio (open `paralegal.realm` in repo root).  
- Review DI bindings in `src/infrastructure/di/common/modules` before extending services.  
- When adding rules or masking modes, update `RulePriority` and `MaskingMode` enums plus corresponding policies/presenters.  
- Run `npm test` (or add Jest specs) for new logic; consider unit tests for rules/masker/merger.
