package authdto

type LoginResponse struct {
	Name     string `gorm:"type: varchar(255)" json:"name"`
	IsAdmin  bool   `gorm:"type: boolean" json:"is_admin"`
	Email    string `gorm:"type: varchar(255)" json:"email"`
	Password string `json:"-" gorm:"type: varchar(255)"`
	Token    string `gorm:"type: varchar(255)" json:"token"`
}

type RegisterResponse struct {
	Name     string `gorm:"type: varchar(255)" json:"name"`
	IsAdmin  bool   `gorm:"type: boolean" json:"is_admin"`
	Email    string `gorm:"type: varchar(255)" json:"email"`
	Password string `gorm:"type: varchar(255)" json:"-"`
}
