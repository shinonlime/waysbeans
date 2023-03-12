import {Container, Row, Col, Button, Toast} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useState, useContext} from "react";
import {useQuery} from "react-query";
import {UserContext} from "../context/user-context";

import {API} from "../config/api";

export default function DetailProduct() {
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
    };

    const user = () => {
        dispatch({
            type: "LOGIN_SUCCESS",
        });
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
                <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className="m-3 position-fixed bottom-0 start-0 bg-success">
                    <Toast.Body>Success added to Cart</Toast.Body>
                </Toast>
                <Row xs={1} lg={2} className="justify-content-center align-items-center g-4">
                    <Col xs="auto" className="d-flex justify-content-center">
                        <img fluid src={`http://localhost:5000/uploads/${product?.image}`} alt={product?.name} width="400px" />
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
                        {user ? (
                            <Button onClick={handleSubmit} variant="primary" type="submit" className="w-100 mx-auto">
                                Add Cart
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} variant="primary" type="submit" className="w-100 mx-auto" disabled>
                                Add Cart
                            </Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
