package models

type Cart struct {
	ID            int     `json:"-"`
	ProductID     int     `json:"-"`
	Product       Product `json:"product"`
	TransactionID int     `json:"-"`
	Quantity      int     `json:"quantity"`
}
