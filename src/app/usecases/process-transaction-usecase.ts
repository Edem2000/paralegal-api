import {Usecase} from "domain/_core/base-domain/base-usecase";
import {ProcessingConfigService} from "domain/_processor/processing-config/service";
import {RuleKind} from "domain/_processor/rules";
import {MaskingMode} from "domain/_processor/processing-config";
import {MaskingEngine} from "domain/_processor";
import {Change} from "domain/change/change";
import {Span} from "domain/span/span";
import {TransactionService} from "domain/transaction/service";

type ProcessTransactionParams = {
    input: string,
    choices: RuleKind[],
    customQueries: string[],
    maskingMode: MaskingMode,
};

export type ProcessTransactionUsecaseResult = {
    finalText: string;
    finalSpans: Span[];
    changes: Change[]
}

export interface ProcessTransactionUsecase extends Usecase<ProcessTransactionParams, ProcessTransactionUsecaseResult> {}

export class ProcessTransactionUsecaseImpl implements ProcessTransactionUsecase {
    constructor(
        // private companyService: CompanyService,
        // private userService: UserService,
        // private roleService: RoleService,
        // private currentUserService: CurrentUserService,
        // private auditLogService: AuditLogService,
        private readonly processingConfigService: ProcessingConfigService,
        private readonly maskingEngine: MaskingEngine,
        private readonly transactionService: TransactionService,
    ) {
    }

    async execute(params: ProcessTransactionParams): Promise<ProcessTransactionUsecaseResult> {
        const {input, choices, customQueries, maskingMode} = params;

        const processingConfig = this.processingConfigService.buildConfig(choices, maskingMode, customQueries);

        const transaction = this.transactionService.create({
            inputText: input,
            choices,
            customQueries,
        });

        console.log(input, choices, customQueries, processingConfig);
        const result = await this.maskingEngine.process(transaction, processingConfig);

        // await this.auditLogService.log({
        //     type: AuditType.ProcessTransaction,
        //     actorUserId: currentUser.id,
        //     targetEntity: TargetEntity.Company,
        //     targetId: company.id  ,
        // }, context).catch((e) => {
        //     console.log("log creation error:", e);
        // });

        // console.log(`Created company ${company.id}`);
        //
        return result;
    }
}
