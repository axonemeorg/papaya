'use client'

import { type TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import TransactionMethodModal from "../modal/TransactionMethodModal";
import { useState } from "react";

type TransactionMethodsProps = TransactionMethodContext;

export default function TransactionMethods(props: TransactionMethodsProps) {
    const [showTransactionMethodModal, setShowTransactionMethodModal] = useState<boolean>(true);

    return (
        <>
            {JSON.stringify(props.transactionMethods)}
            <TransactionMethodModal
                open={showTransactionMethodModal}
                onClose={() => setShowTransactionMethodModal(false)}
            />
        </>
    )
}
