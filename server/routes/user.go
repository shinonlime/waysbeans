package routes

import (
	"backend/handlers"
	"backend/pkg/middleware"
	"backend/pkg/mysql"
	"backend/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	e.GET("/users", h.GetUsers)
	e.GET("/profile", middleware.Auth(h.FindUser))
	e.PATCH("/profile", middleware.Auth(middleware.UploadFile(h.UpdateUser)))
	e.DELETE("/user/:id", middleware.Auth(h.DeleteUser))
}
