import {Container, Form, Row, Col, Button, Toast, Spinner} from "react-bootstrap";
import {useState} from "react";
import {useMutation} from "react-query";
import {useNavigate} from "react-router-dom";

import {API} from "../../config/api";

export default function AddProduct() {
    const title = "Add Product";
    document.title = "WaysBeans | " + title;

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        stock: "",
        price: "",
        description: "",
        image: "",
    });

    const [image, setImage] = useState(null); //image preview
    const [show, setShow] = useState(false); //show toast

    const [isLoading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setImage(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const config = {
                header: {
                    "Content-type": "multipart/form-data",
                },
            };

            const formData = new FormData();
            formData.set("name", form.name);
            formData.set("stock", form.stock);
            formData.set("price", form.price);
            formData.set("description", form.description);
            formData.set("image", form.image[0], form.image[0].name);

            const response = await API.post("/product", formData, config);
            console.log("add product success : ", response);

            navigate("/list-products");
        } catch (error) {
            console.log("add product failed : ", error);
        }
    });

    return (
        <Container className="my-5">
            <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className="m-3 position-fixed bottom-0 start-0 bg-success">
                <Toast.Body>Success added new product</Toast.Body>
            </Toast>
            <Row xs={1} md={2} className="justify-content-center">
                <Col>
                    <h5 className="text-primary fw-bold mb-3">Add Product</h5>
                    <Form className="d-flex flex-column gap-3" onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Control name="name" onChange={handleChange} type="text" className="bg-accent" placeholder="Name" />
                        <Form.Control name="stock" onChange={handleChange} type="number" className="bg-accent" placeholder="Stock" />
                        <Form.Control name="price" onChange={handleChange} type="number" className="bg-accent" placeholder="Price" />
                        <textarea name="description" onChange={handleChange} className="form-control bg-accent" placeholder="Description" rows="4"></textarea>
                        <Form.Control name="image" onChange={handleChange} type="file" accept="image/*" className="bg-accent" />
                        {isLoading ? (
                            <Button disabled={isLoading} variant="primary" type="submit" className="w-50 mx-auto">
                                <Spinner animation="border" size="sm" role="status" className="me-1" />
                                Loading...
                            </Button>
                        ) : (
                            <Button variant="primary" type="submit" className="w-50 mx-auto">
                                Submit
                            </Button>
                        )}
                    </Form>
                </Col>
                {image && (
                    <Col md="auto">
                        <img src={image} alt={image} width="350px" />
                    </Col>
                )}
            </Row>
        </Container>
    );
}
