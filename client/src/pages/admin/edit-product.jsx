import {Container, Form, Row, Col, Button, Toast, Spinner} from "react-bootstrap";
import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useMutation} from "react-query";

import {API} from "../../config/api";

export default function EditProduct() {
    const {id} = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        stock: "",
        price: "",
        description: "",
        image: "",
    });

    const [preview, setPreview] = useState();
    const [show, setShow] = useState(false);

    const [isLoading, setLoading] = useState(false);

    async function getDataUpdate() {
        const responseProduct = await API.get("/product/" + id);
        setPreview(responseProduct.data.data.image);

        setForm({
            ...form,
            name: responseProduct.data.data.name,
            stock: responseProduct.data.data.stock,
            price: responseProduct.data.data.price,
            description: responseProduct.data.data.description,
        });
    }

    useEffect(() => {
        getDataUpdate();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value,
        });

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const hasImage = form.image && form.image[0];
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
            if (hasImage) {
                formData.set("image", form.image[0], form.image[0].name);
            }

            const response = await API.patch("/product/" + id, formData, config);
            console.log("add product success : ", response);

            navigate("/list-products");
        } catch (error) {
            console.log("add product failed : ", error);
        }
    });

    return (
        <Container className="my-5">
            <Toast onClose={() => setShow(false)} show={show} delay={5000} autohide className="m-3 position-fixed bottom-0 start-0 bg-success">
                <Toast.Body>Success update product</Toast.Body>
            </Toast>
            <Row xs={1} md={2} className="justify-content-center">
                <Col>
                    <h5 className="text-primary fw-bold mb-3">Add Product</h5>
                    <Form className="d-flex flex-column gap-3" onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Control name="name" value={form.name} onChange={handleChange} type="text" className="bg-accent" placeholder="Name" />
                        <Form.Control name="stock" value={form.stock} onChange={handleChange} type="number" className="bg-accent" placeholder="Stock" />
                        <Form.Control name="price" value={form.price} onChange={handleChange} type="number" className="bg-accent" placeholder="Price" />
                        <textarea name="description" value={form.description} onChange={handleChange} className="form-control bg-accent" placeholder="Description" rows="4"></textarea>
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
                {preview && (
                    <Col md="auto">
                        <img src={preview} alt="" width="350px" />{" "}
                    </Col>
                )}
            </Row>
        </Container>
    );
}
