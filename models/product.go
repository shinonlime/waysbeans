package models

import "time"

type Product struct {
	ID          int    `json:"id"`
	Name        string `json:"name" grom:"type: varchar(255)"`
	Price       int    `json:"price" grom:"type: int(11)"`
	Description string `json:"description" grom:"type: longtext"`
	Stock       int    `json:"stock" grom:"type: int(11)"`
	Image       string `json:"image" grom:"type: varchar(255)"`
	Transaction []ProductTransaction
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
