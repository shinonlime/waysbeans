package models

import "time"

type Transaction struct {
	ID                 int                  `json:"id"`
	Name               string               `json:"name" gorm:"type: varchar(255)"`
	Email              string               `json:"email" gorm:"type: varchar(255)"`
	Phone              string               `json:"phone" gorm:"type: varchar(255)"`
	Address            string               `json:"address"`
	Status             string               `json:"status" gorm:"type: varchar(255)"`
	UserID             int                  `json:"user_id"`
	User               UserProfileResponse  `json:"-"`
	ProductTransaction []ProductTransaction `json:"product"`
	Total              int                  `json:"total"`
	CreatedAt          time.Time            `json:"created_at"`
	UpdatedAt          time.Time            `json:"updated_at"`
}

type TransactionResponse struct {
	ID        int                 `json:"id"`
	Name      string              `json:"name" gorm:"type: varchar(255)"`
	Email     string              `json:"email" gorm:"type: varchar(255)"`
	Phone     string              `json:"phone" gorm:"type: varchar(255)"`
	Address   string              `json:"address"`
	Status    string              `json:"status" gorm:"type: varchar(255)"`
	UserID    int                 `json:"user_id"`
	User      UserProfileResponse `json:"-"`
	CreatedAt time.Time           `json:"created_at"`
	UpdatedAt time.Time           `json:"updated_at"`
}
