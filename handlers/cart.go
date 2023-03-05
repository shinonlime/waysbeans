package handlers

import (
	cartdto "backend/dto/cart"
	dto "backend/dto/result"
	"backend/models"
	"backend/repositories"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerCart struct {
	CartRepository repositories.CartRepository
}

func HandleCart(CartRepository repositories.CartRepository) *handlerCart {
	return &handlerCart{CartRepository}
}

func (h *handlerCart) CreateCart(c echo.Context) error {
	cartRequest := new(cartdto.CartRequest)
	if err := c.Bind(cartRequest); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)

	userTransaction, _ := h.CartRepository.GetCartTransactionByUserID(int(userID))

	cart := models.Cart{
		ProductID:     cartRequest.ProductID,
		TransactionID: userTransaction.ID,
		Quantity:      cartRequest.Quantity,
	}

	cartData, err := h.CartRepository.CreateCart(cart)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: cartData})
}

func (h *handlerCart) DeleteCart(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	cart, err := h.CartRepository.FindCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.CartRepository.DeleteCart(cart, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}
