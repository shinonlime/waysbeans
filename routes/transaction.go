package routes

import (
	"backend/handlers"
	"backend/pkg/middleware"
	"backend/pkg/mysql"
	"backend/repositories"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	TransactionRepository := repositories.RepositoryTransaction(mysql.DB)
	h := handlers.HandleTransaction(TransactionRepository)

	e.GET("/user/transaction", middleware.Auth(h.GetTransactionByUserID))
	e.GET("/transaction", middleware.Auth(h.GetTransaction))
	e.POST("/transaction", middleware.Auth(middleware.UploadFile(h.CreateTransaction)))
}
