package authdto

type AuthRequest struct {
	Name     string `json:"name" validate:"required"`
	IsAdmin  bool   `json:"is_admin"`
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
	Image    string `json:"image"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}
