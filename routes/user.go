package routes

import (
	"backend/handlers"
	"backend/pkg/mysql"
	"backend/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	e.GET("/users", h.GetUsers)
	e.GET("/user/:id", h.FindUser)
	e.PATCH("/user/:id", h.UpdateUser)
	e.DELETE("/user/:id", h.DeleteUser)
}
