import {Modal, Button, Form, Alert} from "react-bootstrap";
import {useState, useContext, useEffect} from "react";
import {useMutation} from "react-query";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../context/user-context";

import {API, setAuthToken} from "../config/api";

import Register from "./register";

export default function Login(props) {
    const [loginShow, setLoginShow] = useState(false);
    const [registerShow, setRegisterShow] = useState(false);

    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);

    const checkAuth = () => {
        if (state.isLogin) {
            navigate("/");
            setLoginShow(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const [input, setInput] = useState({email: "", password: "", name: ""});
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;

        setInput({...input, [name]: value});
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Insert data for login process, you can also make this without any configuration, because axios would automatically handling it.
            const response = await API.post("/login", input);

            console.log("login success : ", response);

            // Send data to useContext
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: response.data.data,
            });

            setAuthToken(response.data.data.token);

            // Status check
            if (response.data.data.is_admin === true) {
                navigate("/income-transaction");
            } else {
                navigate("/");
            }

            const alert = (
                <Alert variant="success" className="py-1">
                    Login success
                </Alert>
            );
            setMessage(alert);
            props.onHide();
        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1">
                    Wrong Email or Password
                </Alert>
            );
            setMessage(alert);
            console.log("login failed : ", error);
        }
    });

    return (
        <>
            <Modal {...props} centered>
                <Modal.Body>
                    <Modal.Title className="mb-3 text-primary">Login</Modal.Title>
                    {message && message}
                    <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3">
                        <Form.Control onChange={handleChange} name="email" value={input.email} className="mb-3 bg-accent" type="email" placeholder="Enter email" />
                        <Form.Control onChange={handleChange} name="password" value={input.password} type="password" placeholder="Password" className="mb-3 bg-accent" />
                        <Button variant="primary" type="submit" className="py-2 w-100 fw-semibold">
                            Login
                        </Button>
                    </Form>
                    <div className="d-flex justify-content-center align-items-center mt-3 gap-1">
                        <p className="m-0">Don't have an account? Click</p>
                        <Button variant="link" onClick={props.handleRegister} className="fw-bold p-0 text-decoration-none text-black">
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
