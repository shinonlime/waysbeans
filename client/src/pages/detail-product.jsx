import {Container, Row, Col, Button, Toast, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useState, useContext} from "react";
import {useQuery} from "react-query";
import {UserContext} from "../context/user-context";
import {Link} from "react-router-dom";

import {API} from "../config/api";

export default function DetailProduct() {
    const title = "Detail Product";
    document.title = "WaysBeans | " + title;

    const [state, dispatch] = useContext(UserContext);

    const {id} = useParams();

    const [show, setShow] = useState(false);

    let {data: product} = useQuery("productsCache", async () => {
        const response = await API.get(`/product/${id}`);
        return response.data.data;
    });

    const userEmail = state.user.email;

    console.log(product);

    const handleSubmit = (e) => {
        e.preventDefault();
        let isInCart = false;
        const cartItems = JSON.parse(localStorage.getItem(userEmail)) || [];
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].name === product?.name) {
                isInCart = true;
                cartItems[i].quantity += 1;
                localStorage.setItem(userEmail, JSON.stringify(cartItems));
                break;
            }
        }
        if (!isInCart) {
            const newCartItem = {
                id: product?.id,
                name: product?.name,
                price: product?.price,
                quantity: 1,
                image: product?.image,
            };
            cartItems.push(newCartItem);
            localStorage.setItem(userEmail, JSON.stringify(cartItems));
        }
        setShow(true);

        window.dispatchEvent(new Event("badge"));
    };

    const user = localStorage.getItem("token");

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
                {/* <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className="m-3 position-absolute bottom-0 start-50 translate-middle-x bg-success">
                    <Toast.Body className="fs-4 text-center fw-semibold text-white">Success added to Cart</Toast.Body>
                </Toast> */}
                <Modal show={show} onHide={() => setShow(false)} centered>
                    <Modal.Body className="text-center fs-4 fw-semibold bg-info text-black rounded d-flex flex-column gap-4">
                        Success added to Cart{" "}
                        <span>
                            Click{" "}
                            <Link to="/cart" className="text-black">
                                Here
                            </Link>{" "}
                            to see your Cart
                        </span>
                    </Modal.Body>
                </Modal>
                <Row xs={1} lg={2} className="justify-content-center align-items-center g-4">
                    <Col xs="auto" className="d-flex justify-content-center">
                        <img fluid src={product?.image} alt={product?.name} width="400px" />
                    </Col>
                    <Col>
                        <div>
                            <h1 className="fw-bold fs-2 mb-1 text-primary">{product?.name}</h1>
                            <p className="text-se">Stock: {product?.stock}</p>
                        </div>
                        <p className="text-wrap" style={{textAlign: "justify"}}>
                            {product?.description}
                        </p>
                        <div className="d-flex justify-content-end my-3">
                            <p className="fw-bold fs-4 text-secondary">{rupiah(product?.price)}</p>
                        </div>
                        {user && (
                            <Button onClick={handleSubmit} variant="primary" type="submit" className="w-100 mx-auto">
                                Add Cart
                            </Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
