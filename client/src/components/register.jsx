import {Modal, Button, Form, Alert, Spinner} from "react-bootstrap";
import {useState} from "react";
import {useMutation, useQuery} from "react-query";

import {API} from "../config/api";

import Login from "./login";

export default function Register(props) {
    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [input, setInput] = useState({email: "", password: "", name: ""});
    const [emailUser, setEmailUser] = useState();
    const [message, setMessage] = useState(null);

    const {email, password, name} = input;

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    console.log(input);

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const responseUser = await API.get("/user/" + input.email);
            setEmailUser(responseUser.data.data.email);

            if (input.email !== emailUser) {
                const response = await API.post("/register", input);

                console.log("register success : ", response);

                setInput({
                    name: "",
                    email: "",
                    password: "",
                });
            } else if (input.email === emailUser) {
                const alert = (
                    <Alert variant="danger" className="py-1">
                        Email address already exists
                    </Alert>
                );
                setMessage(alert);
                setLoading(false);
            }

            setRegisterShow(false);
            props.handleLogin();

            setLoading(false);
        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1">
                    Failed to register!
                </Alert>
            );
            setMessage(alert);
            setLoading(false);
            console.log("register failed : ", error);
        }
    });

    return (
        <>
            <Modal {...props} centered>
                <Modal.Body>
                    <Modal.Title className="mb-3 text-primary">Register</Modal.Title>
                    {message && message}
                    <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3">
                        <Form.Control onChange={handleChange} name="email" value={input.email} className="mb-3 bg-accent" type="email" placeholder="Enter email" />
                        <Form.Control onChange={handleChange} name="password" value={input.password} className="mb-3 bg-accent" type="password" placeholder="Password" />
                        <Form.Control onChange={handleChange} name="name" value={input.name} type="text" placeholder="Full Name" className="mb-3 bg-accent" />
                        {isLoading ? (
                            <Button disabled={isLoading} variant="primary" type="submit" className="w-100">
                                <Spinner animation="border" size="sm" role="status" className="me-1" />
                                Loading...
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit" className="w-100">
                                Register
                            </Button>
                        )}
                    </Form>
                    <div className="d-flex justify-content-center align-items-center mt-3 gap-1">
                        <p className="m-0">Already have an account? Click</p>
                        <Button variant="link" onClick={props.handleLogin} className="fw-bold p-0 text-decoration-none text-black">
                            Here
                        </Button>
                    </div>
                </Modal.Body>
                <Register show={registerShow} onHide={() => setRegisterShow(false)} />
                <Login show={loginShow} onHide={() => setLoginShow(false)} />
            </Modal>
        </>
    );
}
