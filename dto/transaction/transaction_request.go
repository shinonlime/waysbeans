package transactiondto

type TransactionRequest struct {
	Name       string `json:"name" form:"name"`
	Email      string `json:"email" form:"email"`
	Phone      int    `json:"phone" form:"phone"`
	Address    string `json:"address" form:"address"`
	Attachment string `json:"attachment" form:"image"`
}
