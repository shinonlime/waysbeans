package models

type Cart struct {
	ID            int         `json:"-"`
	ProductID     int         `json:"-"`
	Product       Product     `json:"product" gorm:"foreignKey:ProductID;references:ID"`
	TransactionID int         `json:"-"`
	Transaction   Transaction `json:"-" gorm:"foreignKey:TransactionID;references:ID"`
	Quantity      int         `json:"quantity"`
}

type CartResponse struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type CartTransactionResponse struct {
	Quantity int `json:"quantity"`
}

func (CartResponse) TableName() string {
	return "carts"
}
