package models

import "time"

type User struct {
	ID          int           `json:"id"`
	IsAdmin     bool          `json:"is_admin" gorm:"type:boolean"`
	Name        string        `json:"name" gorm:"type: varchar(255)"`
	Email       string        `json:"email" gorm:"type: varchar(255)"`
	Password    string        `json:"-" gorm:"type: varchar(255)"`
	Image       string        `json:"image" gorm:"type: varchar(255)"`
	Transaction []Transaction `json:"transaction"`
	CreatedAt   time.Time     `json:"-"`
	UpdatedAt   time.Time     `json:"-"`
}

type UserProfileResponse struct {
	ID    int32  `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func (UserProfileResponse) TableName() string {
	return "users"
}
