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
	FindTransactionProduct(ID int) (models.Transaction, error)
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

	err := r.db.Preload("ProductTransaction").Find(&transaction).Error

	return transaction, err
}

func (r *repository) FindTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) FindTransactionProduct(ID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.Preload("ProductTransaction").First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) UpdateTransaction(status string, orderId int) (models.Transaction, error) {
	var transaction models.Transaction
	r.db.Preload("ProductTransaction").First(&transaction, orderId)

	if status != transaction.Status && status == "success" {
		for _, productTransaction := range transaction.ProductTransaction {
			var product models.Product
			r.db.First(&product, productTransaction.ProductID)
			product.Stock = product.Stock - productTransaction.Quantity
			r.db.Save(&product)
		}
	} else if status == "success" && transaction.Status == "success" {
		for _, productTransaction := range transaction.ProductTransaction {
			var product models.Product
			r.db.First(&product, productTransaction.ProductID)
			product.Stock = product.Stock - productTransaction.Quantity
			r.db.Save(&product)
		}
	}

	transaction.Status = status
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *repository) GetTransactionByUserID(UserID int) (models.User, error) {
	var user models.User

	err := r.db.Preload("Transaction.ProductTransaction").First(&user, UserID).Error

	return user, err
}
