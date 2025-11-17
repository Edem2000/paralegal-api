const EntityType = [
    'user',
    'company',
    'product',
    'role',
    'upload',
    'auditLog',
] as const;
export type EntityType = (typeof EntityType)[number];
