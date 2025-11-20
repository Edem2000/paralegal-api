export const TransactionStatus = {
    Pending: "pending",
    Finished: "finished",
    Errored: "errored",
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];