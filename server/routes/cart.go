package routes

import (
	"backend/handlers"
	"backend/pkg/middleware"
	"backend/pkg/mysql"
	"backend/repositories"

	"github.com/labstack/echo/v4"
)

func CartRoutes(e *echo.Group) {
	CartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandleCart(CartRepository)

	e.POST("/cart", middleware.Auth(h.CreateCart))
	e.DELETE("/cart/:id", middleware.Auth(h.DeleteCart))
}
