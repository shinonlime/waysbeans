package handlers

import (
	productdto "backend/dto/products"
	dto "backend/dto/result"
	"backend/models"
	"backend/repositories"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerProduct struct {
	ProductRepository repositories.ProductRepository
}

func HandleProduct(ProductRepository repositories.ProductRepository) *handlerProduct {
	return &handlerProduct{ProductRepository}
}

func (h *handlerProduct) GetProducts(c echo.Context) error {
	products, err := h.ProductRepository.GetProducts()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: products})
}

func (h *handlerProduct) FindProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.FindProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(product)})
}

func (h *handlerProduct) CreateProduct(c echo.Context) error {
	//get data file
	dataFile := c.Get("dataFile").(string)
	fmt.Println("this is data file", dataFile)

	//string to integer
	price, _ := strconv.Atoi(c.FormValue("price"))
	stock, _ := strconv.Atoi(c.FormValue("stock"))

	request := productdto.CreateProductRequest{
		Name:        c.FormValue("name"),
		Price:       price,
		Description: c.FormValue("description"),
		Stock:       stock,
		Image:       dataFile,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	isAdmin := userLogin.(jwt.MapClaims)["is_admin"].(bool)

	if isAdmin {
		product := models.Product{
			Name:        request.Name,
			Price:       request.Price,
			Description: request.Description,
			Stock:       request.Stock,
			Image:       request.Image,
		}

		data, err := h.ProductRepository.CreateProduct(product)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
		}

		return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)})
	}

	return c.JSON(http.StatusUnauthorized, dto.ErrorResult{Code: http.StatusUnauthorized, Message: "Unauthorized"})
}

func (h *handlerProduct) UpdateProduct(c echo.Context) error {
	//get data file
	dataFile := c.Get("dataFile").(string)
	fmt.Println("this is data file", dataFile)

	//string to integer
	price, _ := strconv.Atoi(c.FormValue("price"))
	stock, _ := strconv.Atoi(c.FormValue("stock"))

	request := productdto.CreateProductRequest{
		Name:        c.FormValue("name"),
		Price:       price,
		Description: c.FormValue("description"),
		Stock:       stock,
		Image:       dataFile,
	}

	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.FindProduct(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Name != "" {
		product.Name = request.Name
	}

	if request.Price != 0 {
		product.Price = request.Price
	}

	if request.Description != "" {
		product.Description = request.Description
	}

	if request.Stock != 0 {
		product.Stock = request.Stock
	}

	if request.Image != "" {
		oldImage := "uploads/" + product.Image
		if err := os.Remove(oldImage); err != nil {
			log.Printf("Error deleting old image: %v", err)
		}
		product.Image = request.Image
	}

	data, err := h.ProductRepository.UpdateProduct(product, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)})
}

func (h *handlerProduct) DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	product, err := h.ProductRepository.FindProduct(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if product.Image != "" {
		if err := os.Remove("uploads/" + product.Image); err != nil {
			log.Printf("error deleting image file: %v", err)
		}
	}

	data, err := h.ProductRepository.DeleteProduct(product, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProduct(data)})
}

func convertResponseProduct(u models.Product) productdto.ProductResponse {
	return productdto.ProductResponse{
		Name:        u.Name,
		Price:       u.Price,
		Description: u.Description,
		Stock:       u.Stock,
		Image:       u.Image,
	}
}
