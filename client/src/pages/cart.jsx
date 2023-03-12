import {Container, Row, Col, Button} from "react-bootstrap";
import {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import {UserContext} from "../context/user-context";

import Checkout from "../components/checkout";

export default function Cart() {
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
    };

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <>
            <Container className="my-5">
                <h4 className="my-4 text-primary">My Cart</h4>

                <Row xs={1} md={2} className="align-items-center">
                    <Col className="">
                        <p className="fw-semibold text-secondary my-0 border-bottom border-2 border-dark pb-3">Review your order</p>
                        {cartItems.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-100 d-flex align-items-center py-3 border-bottom border-2 border-dark">
                                        <img src={`http://localhost:5000/uploads/${item.image}`} style={styles.imgSize} alt={item.name} />
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
                        <div className="d-flex justify-content-between gap-2 mt-3">
                            <Link to="/" className="w-50 btn btn-primary">
                                Back to Home
                            </Link>
                            <Link to="/profile" className="w-50 btn btn-primary">
                                To Profile
                            </Link>
                        </div>
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
                        <div className="d-flex justify-content-end mt-3">
                            <Button onClick={() => handleShow()} className="w-50 fw-semibold">
                                Checkout
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Checkout show={checkoutShow} onHide={() => handleClose()} />
            </Container>
        </>
    );
}
