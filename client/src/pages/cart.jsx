import {Container, Row, Col, Button} from "react-bootstrap";
import {useState, useEffect, useContext} from "react";
import {Router} from "react-router-dom";
import {UserContext} from "../context/user-context";

import ProductCard from "../components/product-card";

import Checkout from "../components/checkout";

export default function Cart() {
    const title = "Cart";
    document.title = "WaysBeans | " + title;

    const styles = {
        card: {
            backgroundColor: "#F6E6DA",
            width: "250px",
        },
        imgSize: {
            width: "75px",
            height: "75px",
            objectFit: "cover",
        },
        bgColor: {
            backgroundColor: "#F6E6DA",
        },
    };

    const [state] = useContext(UserContext);

    const [cartItems, setCartItems] = useState([]);
    const [itemQuantities, setItemQuantities] = useState({});
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [totalPrices, setTotalPrices] = useState(0);
    const [deleteItem, setDeleteItem] = useState(false);
    const [checkoutShow, setCheckoutShow] = useState(false);

    const handleClose = () => setCheckoutShow(false);
    const handleShow = () => setCheckoutShow(true);

    const userEmail = state.user.email;

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(userEmail)) || [];
        setCartItems(items);
        const quantities = {};
        items.forEach((item, index) => {
            quantities[index] = item.quantity;
        });
        setItemQuantities(quantities);
    }, []);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem(userEmail)) || [];
        setCartItems(items);
        let totalQuantity = 0;
        let totalPrice = 0;
        items.forEach((item) => {
            totalQuantity += item.quantity;
            totalPrice += item.price * item.quantity;
        });
        setTotalQuantities(totalQuantity);
        setTotalPrices(totalPrice);
        setDeleteItem(false);

        localStorage.setItem(`${userEmail}_totalPrices`, JSON.stringify(totalPrice));
    }, [itemQuantities, totalQuantities, totalPrices, deleteItem]);

    function increaseQuantity(id) {
        const updatedQuantities = {...itemQuantities};
        updatedQuantities[id] = updatedQuantities[id] + 1 || 1;
        setItemQuantities(updatedQuantities);
        const updatedItems = cartItems.map((item, index) => {
            if (index === id) {
                return {...item, quantity: updatedQuantities[id]};
            }
            return item;
        });
        localStorage.setItem(userEmail, JSON.stringify(updatedItems));
    }

    function decreaseQuantity(id) {
        const updatedQuantities = {...itemQuantities};
        updatedQuantities[id] = updatedQuantities[id] - 1 || 1;
        setItemQuantities(updatedQuantities);
        const updatedItems = cartItems.map((item, index) => {
            if (index === id) {
                return {...item, quantity: updatedQuantities[id]};
            }
            return item;
        });
        localStorage.setItem(userEmail, JSON.stringify(updatedItems));
    }

    const handleDeleteItem = (id) => {
        const cartData = JSON.parse(localStorage.getItem(userEmail));
        cartData.splice(id, 1);
        localStorage.setItem(userEmail, JSON.stringify(cartData));
        setDeleteItem(true);
        window.dispatchEvent(new Event("badge"));
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const checkoutButton = () => {
        if (totalPrices === 0) {
            return (
                <>
                    <Button onClick={() => handleShow()} className="w-50 fw-semibold" disabled>
                        Checkout
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Button onClick={() => handleShow()} className="w-50 fw-semibold">
                        Checkout
                    </Button>
                </>
            );
        }
    };

    const isCart = () => {
        if (cartItems.length !== 0) {
            return (
                <>
                    <Row xs={1} md={2} className="align-items-center">
                        <Col className="">
                            <p className="fw-semibold text-secondary my-0 border-bottom border-2 border-dark pb-3">Review your order</p>
                            {cartItems.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className="w-100 d-flex align-items-center py-3 border-bottom border-2 border-dark">
                                            <img src={item.image} style={styles.imgSize} alt={item.name} />
                                            <div className="w-100">
                                                <div className="mx-3 d-flex justify-content-between align-items-center">
                                                    <p className="fw-bold m-0 text-primary">{item.name}</p>
                                                    <p className="m-0 text-secondary fw-semibold">{rupiah(item.price * item.quantity)}</p>
                                                </div>
                                                <div className="mx-3 d-flex justify-content-between align-items-center">
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <Button onClick={() => decreaseQuantity(index)} variant="link" className="text-primary text-decoration-none p-0 fs-2">
                                                            -
                                                        </Button>
                                                        <p className="m-0 px-3 py-1 rounded" style={styles.bgColor}>
                                                            {itemQuantities[index] || 0}
                                                        </p>
                                                        <Button onClick={() => increaseQuantity(index)} variant="link" className="text-primary text-decoration-none p-0 fs-2">
                                                            +
                                                        </Button>
                                                    </div>
                                                    <div className="d-flex justify-content-end">
                                                        <button onClick={() => handleDeleteItem(index)} className="btn btn-light d-flex align-items-center align-self-end p-0">
                                                            <span className="material-symbols-rounded text-primary">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Col>
                        <Col className="my-3">
                            <div className="py-3 border-top border-bottom border-2 border-dark">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <p className="text-secondary m-0">Subtotal</p>
                                    <p className="text-secondary m-0">{rupiah(totalPrices)}</p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="text-secondary m-0">Quantity</p>
                                    <p className="text-secondary m-0">{totalQuantities}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <p className="fw-bold text-primary m-0">Total</p>
                                <p className="fw-bold text-primary m-0">{rupiah(totalPrices)}</p>
                            </div>
                            <div className="d-flex justify-content-end mt-3">{checkoutButton()}</div>
                        </Col>
                    </Row>
                    <Checkout show={checkoutShow} onHide={() => handleClose()} />
                </>
            );
        } else {
            return (
                <>
                    <h4 className="mb-5">Your cart is empty!</h4>

                    <h5>Choice your product here!</h5>
                    <ProductCard />
                </>
            );
        }
    };

    return (
        <>
            <Container className="my-5">
                <h4 className="my-4 text-primary">My Cart</h4>
                {isCart()}
            </Container>
        </>
    );
}
