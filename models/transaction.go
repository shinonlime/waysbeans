package models

import "time"

type Transaction struct {
	ID         int                 `json:"id"`
	Name       string              `json:"name" gorm:"type: varchar(255)"`
	Email      string              `json:"email" gorm:"type: varchar(255)"`
	Phone      int                 `json:"phone"`
	Address    string              `json:"address"`
	Attachment string              `json:"attachment" gorm:"type: varchar(255)"`
	Status     string              `json:"status" gorm:"type: varchar(255)"`
	UserID     int                 `json:"user_id"`
	User       UserProfileResponse `json:"-"`
	Cart       []Cart              `json:"cart"`
	CreatedAt  time.Time           `json:"created_at"`
	UpdatedAt  time.Time           `json:"updated_at"`
}
