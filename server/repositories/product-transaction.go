package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type ProductTransactionRepository interface {
	CreateProductTransaction(productTransaction models.ProductTransaction) (models.ProductTransaction, error)
	GetProductTransactionByUserID(UserID int) (models.Transaction, error)
}

func RepositoryProductTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateProductTransaction(productTransaction models.ProductTransaction) (models.ProductTransaction, error) {
	err := r.db.Create(&productTransaction).Error

	return productTransaction, err
}

func (r *repository) GetProductTransactionByUserID(UserID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.Preload("User").Preload("ProductTransaction").Where("user_id = ?", UserID).Where("status = ?", "waiting").First(&transaction).Error

	return transaction, err
}
