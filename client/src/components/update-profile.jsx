import React, {useState, useContext, useEffect} from "react";
import {Modal, Form, Button, Spinner} from "react-bootstrap";
import {useMutation} from "react-query";
import {UserContext} from "../context/user-context";
import {useNavigate} from "react-router-dom";

import {API} from "../config/api";

export default function UpdateProfile(props) {
    const [form, setForm] = useState({name: "", email: "", password: "", image: ""});
    const [preview, setPreview] = useState();
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function getProfile() {
        const response = await API.get("/profile");
        setPreview(response.data.data.image);

        setForm({
            ...form,
            name: response.data.data.name,
            email: response.data.data.email,
        });
    }

    useEffect(() => {
        getProfile();
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
            formData.set("email", form.email);
            formData.set("password", form.password);
            if (hasImage) {
                formData.set("image", form.image[0], form.image[0].name);
            }

            const response = await API.patch("/profile", formData, config);
            console.log("update profile success : ", response);

            props.onHide();
            navigate("/profile");
        } catch (error) {
            console.log("update profile failed : ", error);
        }
    });

    return (
        <>
            <Modal {...props} centered>
                <Modal.Body>
                    <Modal.Title className="mb-3 text-primary">Update Profile</Modal.Title>
                    <Form className="mt-3 d-flex flex-column gap-3" onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Control name="name" value={form.name} onChange={handleChange} type="text" className="bg-accent" placeholder="Name" />
                        <Form.Control name="email" value={form.email} onChange={handleChange} type="text" className="bg-accent" placeholder="Email" />
                        <Form.Control name="image" onChange={handleChange} type="file" accept="image/*" className="bg-accent" />
                        {preview && <img src={preview} alt="" width="100px" height="100px" style={{objectFit: "cover"}} className="rounded" />}
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
                </Modal.Body>
            </Modal>
        </>
    );
}
