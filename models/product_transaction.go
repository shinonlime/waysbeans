package models

type ProductTransaction struct {
	ProductID     int
	Product       Product `gorm:"foreignKey:ProductID;references:ID"`
	TransactionID int
	Transaction   Transaction `gorm:"foreignKey:TransactionID;references:ID"`
	Quantity      int
}
