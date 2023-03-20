package producttransactiondto

type ProductTransactionRequest struct {
	ProductID    int    `json:"product_id" form:"product_id"`
	ProductName  string `json:"product_name" form:"product_name"`
	ProductPrice int    `json:"product_price" form:"product_price"`
	Quantity     int    `json:"quantity" form:"quantity"`
	ProductImage string `json:"product_image" form:"product_image"`
}
