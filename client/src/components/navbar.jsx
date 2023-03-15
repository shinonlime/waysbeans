import {Button, Navbar, Container, NavDropdown, Badge} from "react-bootstrap";
import React, {useState, useContext} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/user-context";
import {useQuery} from "react-query";

import {API} from "../config/api";

import Login from "./login";
import Register from "./register";

export default function NaviBar() {
    const [state, dispatch] = useContext(UserContext);

    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);

    const navigate = useNavigate();

    const handleCloseLogin = () => setLoginShow(false);
    const handleShowLogin = () => setLoginShow(true);

    const handleCloseRegister = () => setRegisterShow(false);
    const handleShowRegister = () => setRegisterShow(true);

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT",
        });
        navigate("/");
    };

    let {data: profile} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        return response.data.data;
    });

    const user = state.user.is_admin === false;
    const admin = state.user.is_admin === true;

    const cart = JSON.parse(localStorage.getItem(state.user.email));

    const cartButton = () => {
        if (cart) {
            return (
                <>
                    <Link to="/cart" className="position-relative d-inline-flex align-items-center p-2">
                        <img src="/waysbeans/cart.png" alt="" />
                        <Badge pill bg="danger" style={{position: "absolute", top: 0, right: 0}}>
                            {cart.length}
                        </Badge>
                    </Link>
                </>
            );
        } else {
            return (
                <>
                    <Link to="/cart" className="position-relative d-inline-flex align-items-center p-2">
                        <img src="/waysbeans/cart.png" alt="" />
                    </Link>
                </>
            );
        }
    };

    const login = () => {
        if (user) {
            return (
                <>
                    <div className="d-flex gap-4 align-items-center">
                        {cartButton()}
                        <NavDropdown
                            title={
                                profile?.image ? (
                                    <img
                                        src={`http://localhost:5000/uploads/${profile?.image}`}
                                        alt=""
                                        width="50px"
                                        height="50px"
                                        style={{objectFit: "cover"}}
                                        className="rounded-circle dropdown-center"
                                    />
                                ) : (
                                    <img src={`http://localhost:5000/uploads/profile.png`} alt="" width="50px" height="50px" style={{objectFit: "cover"}} className="rounded-circle dropdown-center" />
                                )
                            }>
                            <NavDropdown.Item className="fw-semibold">
                                <Link to="/profile" className="text-decoration-none">
                                    <img src="/waysbeans/beans.png" alt="" width="28" className="pe-2" />
                                    Profile
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout} className="fw-semibold d-flex align-items-center">
                                <span className="material-symbols-rounded pe-2 text-danger m-0">logout</span>Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </>
            );
        } else if (admin) {
            return (
                <>
                    <div className="d-flex gap-4 align-items-center">
                        <NavDropdown title={<img src="/waysbeans/profile.png" alt="" width="50px" height="50px" style={{objectFit: "cover"}} className="rounded-circle dropdown-center" />}>
                            <NavDropdown.Item className="fw-semibold dropdown-toggle">
                                <Link to="/income-transaction" className="text-decoration-none">
                                    <img src="/waysbeans/beans.png" alt="" width="28" className="pe-2" />
                                    Transaction
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item className="fw-semibold">
                                <Link to="/add-product" className="text-decoration-none">
                                    <img src="/waysbeans/beans.png" alt="" width="28" className="pe-2" />
                                    Add Product
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item className="fw-semibold">
                                <Link to="/list-products" className="text-decoration-none">
                                    <img src="/waysbeans/beans.png" alt="" width="28" className="pe-2" />
                                    List Product
                                </Link>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout} className="fw-semibold d-flex align-items-center">
                                <span className="material-symbols-rounded pe-2 text-danger m-0">logout</span>Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="d-flex gap-2 align-items-center">
                        <Button variant="outline-primary" className="py-1 px-4 fw-semibold" onClick={() => handleShowLogin()}>
                            Login
                        </Button>
                        <Button variant="primary" className="py-1 px-4 fw-semibold" onClick={() => handleShowRegister()}>
                            Register
                        </Button>
                    </div>
                </>
            );
        }
    };

    const popLogin = () => {
        setLoginShow(true);
        setRegisterShow(false);
    };

    const popRegister = () => {
        setLoginShow(false);
        setRegisterShow(true);
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-lg">
                <Container>
                    <Navbar.Brand>
                        <Link to="/">
                            <img src="/waysbeans/Icon.png" alt="" width="120px" />
                        </Link>
                    </Navbar.Brand>
                    {login()}
                </Container>
            </Navbar>

            {/* modal login */}
            <Login show={loginShow} onHide={() => handleCloseLogin()} handleRegister={() => popRegister()} />

            {/* modal register */}
            <Register show={registerShow} onHide={() => handleCloseRegister()} handleLogin={() => popLogin()} />
        </>
    );
}
