package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type CartRepository interface {
	CreateCart(cart models.Cart) (models.Cart, error)
	FindCart(ID int) (models.Cart, error)
	DeleteCart(cart models.Cart, ID int) (models.Cart, error)
	GetCartTransactionByUserID(UserID int) (models.Transaction, error)
}

func RepositoryCart(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateCart(cart models.Cart) (models.Cart, error) {
	err := r.db.Create(&cart).Error

	return cart, err
}

func (r *repository) FindCart(ID int) (models.Cart, error) {
	var cart models.Cart
	err := r.db.First(&cart, ID).Error

	return cart, err
}

func (r *repository) DeleteCart(cart models.Cart, ID int) (models.Cart, error) {
	err := r.db.Delete(&cart).Error

	return cart, err
}

func (r *repository) GetCartTransactionByUserID(UserID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.Preload("User").Preload("Cart.Product").Where("user_id = ?", UserID).Where("status = ?", "waiting").First(&transaction).Error

	return transaction, err
}
