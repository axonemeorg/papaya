import TransactionMethodRepository from "../repositories/TransactionMethodRepository";

export default class TransactionMethodService {
    static async getUserTransactionMethods(userId: string) {
        return TransactionMethodRepository.getUserTransactionMethods(userId);
    }
}
