package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type ProductRepository interface {
	GetProducts() ([]models.Product, error)
	FindProduct(ID int) (models.Product, error)
	CreateProduct(product models.Product) (models.Product, error)
	UpdateProduct(product models.Product, ID int) (models.Product, error)
	DeleteProduct(product models.Product) (models.Product, error)
}

func RepositoryProduct(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) GetProducts() ([]models.Product, error) {
	var products []models.Product
	err := r.db.Find(&products).Error

	return products, err
}

func (r *repository) FindProduct(ID int) (models.Product, error) {
	var product models.Product
	err := r.db.First(&product, ID).Error

	return product, err
}

func (r *repository) CreateProduct(product models.Product) (models.Product, error) {
	err := r.db.Create(&product).Error

	return product, err
}

func (r *repository) UpdateProduct(product models.Product, ID int) (models.Product, error) {
	err := r.db.Save(&product).Error

	return product, err
}

func (r *repository) DeleteProduct(product models.Product) (models.Product, error) {
	err := r.db.Delete(&product).Error

	return product, err
}
