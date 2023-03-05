package routes

import (
	"backend/handlers"
	"backend/pkg/middleware"
	"backend/pkg/mysql"
	"backend/repositories"

	"github.com/labstack/echo/v4"
)

func ProductRoutes(e *echo.Group) {
	productRepository := repositories.RepositoryProduct(mysql.DB)
	h := handlers.HandleProduct(productRepository)

	e.GET("/products", h.GetProducts)
	e.GET("/product/:id", h.FindProduct)
	e.POST("/add-product", middleware.Auth(middleware.UploadFile(h.CreateProduct)))
	e.PUT("/product/:id", middleware.Auth(middleware.UploadFile(h.UpdateProduct)))
	e.DELETE("/product/:id", middleware.Auth(h.DeleteProduct))
}
