package main

import (
	"backend/database"
	"backend/pkg/mysql"
	"backend/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	mysql.DbInit()
	database.RunMigration()

	routes.RouteInit(e.Group("/api/v1"))

	e.Logger.Fatal(e.Start("localhost:5000"))
}
