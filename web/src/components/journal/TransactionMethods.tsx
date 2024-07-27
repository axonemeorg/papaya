'use client'

import { type TransactionMethodContext } from "@/contexts/TransactionMethodContext";
import TransactionMethodModal from "../modal/TransactionMethodModal";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CreateTransactionMethod } from "@/types/post";
import { PaymentType } from "@/types/enum";
import { zodResolver } from "@hookform/resolvers/zod";

type TransactionMethodsProps = TransactionMethodContext;

export default function TransactionMethods(props: TransactionMethodsProps) {
    const { transactionMethods } = props;

    const [showTransactionMethodModal, setShowTransactionMethodModal] = useState<boolean>(true);


    console.log(transactionMethods)
    

    return (
        <>
        
            <TransactionMethodModal
                open={showTransactionMethodModal}
                onClose={() => setShowTransactionMethodModal(false)}
            />
        </>
    )
}
