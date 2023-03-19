package cartdto

type CartRequest struct {
	ProductID int `json:"product_id" form:"product_id"`
	Quantity  int `json:"quantity" form:"quantity"`
}
