package routes

import (
	"backend/handlers"
	"backend/pkg/middleware"
	"backend/pkg/mysql"
	"backend/repositories"

	"github.com/labstack/echo/v4"
)

func ProductTransactionRoutes(e *echo.Group) {
	ProductTransactionRepository := repositories.RepositoryProductTransaction(mysql.DB)
	h := handlers.HandlerProductTransaction(ProductTransactionRepository)

	e.POST("/product-transaction", middleware.Auth(h.CreateProductTransaction))
}
