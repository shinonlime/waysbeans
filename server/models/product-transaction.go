package models

type ProductTransaction struct {
	ID            int         `json:"-"`
	ProductID     int         `json:"product_id" gorm:"type: int(11)"`
	ProductName   string      `json:"product_name" gorm:"type: varchar(255)"`
	ProductPrice  int         `json:"product_price" gorm:"type: int(11)"`
	Quantity      int         `json:"quantity" gorm:"type: int(11)"`
	ProductImage  string      `json:"product_image"`
	TransactionID int         `json:"-"`
	Transaction   Transaction `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type ProductTransactionResponse struct {
	ProductID     int    `json:"product_id"`
	ProductName   string `json:"product_name"`
	ProductPrice  int    `json:"product_price"`
	Quantity      int    `json:"quantity"`
	ProductImage  string `json:"product_image"`
	TransactionID int    `json:"transaction_id"`
}

func (ProductTransactionResponse) TableName() string {
	return "product_transactions"
}
