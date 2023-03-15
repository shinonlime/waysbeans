package models

type Cart struct {
	ID            int         `json:"-"`
	ProductID     int         `json:"-"`
	Product       Product     `json:"product" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	TransactionID int         `json:"-"`
	Transaction   Transaction `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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
