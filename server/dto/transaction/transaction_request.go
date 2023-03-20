package transactiondto

type TransactionRequest struct {
	Name    string `json:"name" form:"name"`
	Email   string `json:"email" form:"email"`
	Phone   string `json:"phone" form:"phone"`
	Address string `json:"address" form:"address"`
	Status  string `json:"status"`
	Total   int    `json:"total" form:"total"`
	UserID  int    `json:"user_id"`
}

type UpdateTransactionRequest struct {
	ID     int    `json:"id"`
	Status string `json:"status" form:"status"`
}
