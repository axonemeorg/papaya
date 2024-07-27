import { TransactionMethod } from "@/types/get";
import { createContext } from "react";

export interface TransactionMethodContext {
    transactionMethods: TransactionMethod[];
}

export const TransactionMethodContext = createContext<TransactionMethodContext>({
    transactionMethods: []
});
