export const TransactionStatus = {
    Pending: "pending",
    Finished: "finished",
    Failed: "failed",
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];