package handlers

import (
	producttransactiondto "backend/dto/product_transaction"
	dto "backend/dto/result"
	"backend/models"
	"backend/repositories"
	"net/http"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerProductTransaction struct {
	ProductTransactionRepository repositories.ProductTransactionRepository
}

func HandlerProductTransaction(ProductTransactionRepository repositories.ProductTransactionRepository) *handlerProductTransaction {
	return &handlerProductTransaction{ProductTransactionRepository}
}

func (h *handlerProductTransaction) CreateProductTransaction(c echo.Context) error {
	productTransactionRequest := new(producttransactiondto.ProductTransactionRequest)
	if err := c.Bind(productTransactionRequest); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)

	userTransaction, _ := h.ProductTransactionRepository.GetProductTransactionByUserID(int(userID))

	productTransaction := models.ProductTransaction{
		ProductID:     productTransactionRequest.ProductID,
		ProductName:   productTransactionRequest.ProductName,
		ProductPrice:  productTransactionRequest.ProductPrice,
		Quantity:      productTransactionRequest.Quantity,
		ProductImage:  productTransactionRequest.ProductImage,
		TransactionID: userTransaction.ID,
	}

	productTransactionData, err := h.ProductTransactionRepository.CreateProductTransaction(productTransaction)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseProductTransaction(productTransactionData)})
}

func convertResponseProductTransaction(u models.ProductTransaction) models.ProductTransactionResponse {
	return models.ProductTransactionResponse{
		ProductID:     u.ProductID,
		ProductName:   u.ProductName,
		ProductPrice:  u.ProductPrice,
		Quantity:      u.Quantity,
		ProductImage:  u.ProductImage,
		TransactionID: u.TransactionID,
	}
}
