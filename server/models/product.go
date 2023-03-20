package models

import "time"

type Product struct {
	ID          int       `json:"id"`
	Name        string    `json:"name" gorm:"type: varchar(255)"`
	Price       int       `json:"price" gorm:"type: int(11)"`
	Description string    `json:"description"`
	Stock       int       `json:"stock" gorm:"type: int(11)"`
	Image       string    `json:"image"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
