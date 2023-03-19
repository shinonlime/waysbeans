import React, {useState, useContext, useEffect} from "react";
import {Modal, Form, Button, Spinner} from "react-bootstrap";
import {useMutation} from "react-query";
import {UserContext} from "../context/user-context";
import {useNavigate} from "react-router-dom";

import {API} from "../config/api";

export default function Checkout(props) {
    const [state] = useContext(UserContext);

    const navigate = useNavigate();

    const [form, setForm] = useState({name: "", email: "", phone: "", address: ""});

    const [isLoading, setLoading] = useState(false);

    const handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;

        setForm({...form, [name]: value});
    };

    const userEmail = state.user.email;

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const cartItems = JSON.parse(localStorage.getItem(userEmail));
    const totalPrice = JSON.parse(localStorage.getItem(`${userEmail}_totalPrices`));

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const config = {
                header: {
                    "Content-type": "multipart/form-data",
                },
            };

            const formTransaction = new FormData();
            formTransaction.set("name", form.name);
            formTransaction.set("email", form.email);
            formTransaction.set("phone", form.phone);
            formTransaction.set("address", form.address);
            formTransaction.set("total", totalPrice);

            const response = await API.post("/transaction", formTransaction, config);

            console.log(response);

            cartItems.forEach((item) => {
                const formCart = new FormData();
                formCart.set("product_id", item.id);
                formCart.set("quantity", item.quantity);

                API.post("/cart", formCart, config);
            });

            localStorage.removeItem(userEmail);
            localStorage.removeItem(`${userEmail}_totalPrices`);

            console.log("transaction success :", response);

            const token = response.data.data.token;
            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            });
        } catch (error) {
            console.log("add transaction failed : ", error);
        }
    });

    return (
        <>
            <Modal {...props} centered>
                <Modal.Body>
                    <Modal.Title className="mb-3 text-primary">Checkout</Modal.Title>
                    <Form className="mt-3" onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Control onChange={handleChange} name="name" className="mb-3 bg-accent" type="text" placeholder="Name" />
                        <Form.Control onChange={handleChange} name="email" type="text" placeholder="Email" className="mb-3 bg-accent" />
                        <Form.Control onChange={handleChange} name="phone" type="number" placeholder="Phone" className="mb-3 bg-accent" />
                        <Form.Control onChange={handleChange} name="address" type="text" placeholder="Address" className="mb-3 bg-accent" />
                        {isLoading ? (
                            <Button disabled={isLoading} variant="primary" type="submit" className="w-100">
                                <Spinner animation="border" size="sm" role="status" className="me-1" />
                                Loading...
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit" className="w-100">
                                Submit
                            </Button>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
