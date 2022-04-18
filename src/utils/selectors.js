export const statusSelector = state => state.user.status
export const rememberMeSelector = state => state.user.rememberMe
export const userInfosSelector = state => state.user.infos
export const transactionsSelector = state => state.user.transactions
export const transactionDetailSelector = state => state.user.transactions.data.details