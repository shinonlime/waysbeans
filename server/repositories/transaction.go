package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	GetTransaction() ([]models.Transaction, error)
	GetTransactionByUserID(UserID int) (models.User, error)
	FindTransaction(ID int) (models.Transaction, error)
	UpdateTransaction(status string, orderId int) (models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error

	return transaction, err
}

func (r *repository) GetTransaction() ([]models.Transaction, error) {
	var transaction []models.Transaction

	err := r.db.Preload("Cart.Product").Find(&transaction).Error

	return transaction, err
}

func (r *repository) FindTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) UpdateTransaction(status string, orderId int) (models.Transaction, error) {
	var transaction models.Transaction
	r.db.Preload("Cart.Product").First(&transaction, orderId)

	if status != transaction.Status && status == "success" {
		for _, cart := range transaction.Cart {
			var product models.Product
			r.db.First(&product, cart.ProductID)
			product.Stock = product.Stock - cart.Quantity
			r.db.Save(&product)
		}
	} else if status == "success" && transaction.Status == "success" {
		for _, cart := range transaction.Cart {
			var product models.Product
			r.db.First(&product, cart.ProductID)
			product.Stock = product.Stock - cart.Quantity
			r.db.Save(&product)
		}
	}
	transaction.Status = status
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *repository) GetTransactionByUserID(UserID int) (models.User, error) {
	var user models.User

	err := r.db.Preload("Transaction.Cart.Product").First(&user, UserID).Error

	return user, err
}
