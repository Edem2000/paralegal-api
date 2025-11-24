import {asUniqueArray, generateSymbols} from 'domain/utils/type-helpers';

export const Symbols = generateSymbols({
  infrastructure: {
    db: asUniqueArray(['main', 'idGenerator', 'realm'] as const),
    common: asUniqueArray(['logger', 'localization', 'customDate'] as const),
    storage: asUniqueArray(['asyncStorage'] as const),
    kafka: asUniqueArray([
      'kafkaProducer',
      'kafkaClient',
      'keyGenerator',
    ] as const),
    jwt: asUniqueArray(['jwtService', 'jwtStrategy'] as const),
    utils: asUniqueArray(['hasher'] as const),
    providers: asUniqueArray(['currentUser'] as const),
  },
  domain: {
    change: asUniqueArray(['repository', 'service'] as const),
    transaction: asUniqueArray(['repository', 'service'] as const),
    rules: asUniqueArray(['common'] as const),
    engines: asUniqueArray(['algorithmic', 'llm', 'merger', 'masker', 'maskingEngine'] as const),
    auditLog: asUniqueArray(['auditLogRepository', 'auditLogService', 'logEnricherService'] as const),
    utils: asUniqueArray(['processingConfig'] as const),
  },
  usecases: {
    transactions: asUniqueArray(['process', 'get', 'getOne'] as const),
    users: asUniqueArray(['login', 'getMe', 'createUser', 'get', 'getOne', 'deleteUser', 'updateUser', 'assignCompany', 'unassignCompany', 'search', 'changePassword'] as const),
    companies: asUniqueArray(['create', 'get', 'getOne', 'delete', 'update', 'search'] as const),
    products: asUniqueArray(['create', 'get', 'getOne', 'delete', 'update', 'search'] as const),
    uploads: asUniqueArray(['create', 'get', 'getOne', 'delete'] as const),
    auditLogs: asUniqueArray(['get', 'getOne'] as const),
  },
  externalDomain: {

  },
} as const);

export const CollectionNames = {
  users: 'users',
  companies: 'companies',
  products: 'products',
  uploads: 'uploads',
  stateHistory: 'state_history',
  auditLogs: 'audit_logs',
};
