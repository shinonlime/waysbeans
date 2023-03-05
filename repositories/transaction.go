package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	GetTransaction() ([]models.Transaction, error)
	GetTransactionByUserID(UserID int) (models.Transaction, error)
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

	err := r.db.Preload("User").Preload("Cart.Product").Find(&transaction).Error

	return transaction, err
}

func (r *repository) GetTransactionByUserID(UserID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.Preload("User").Preload("Cart.Product").Where("user_id = ?", UserID).First(&transaction).Error

	return transaction, err
}
