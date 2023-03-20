import {Container, Table, Button, Modal, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useQuery, useMutation} from "react-query";

import {API} from "../../config/api";

export default function ListProduct() {
    const title = "List Products";
    document.title = "WaysBeans | " + title;

    const [show, setShow] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemId, setItemId] = useState("");

    const [isLoading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (id, name) => {
        setItemId(id);
        setItemName(name);
        setShow(true);
    };

    let {data: products, refetch: refetchProducts} = useQuery("productsCache", async () => {
        const response = await API.get("/products");
        return response.data.data;
    });

    const handleDelete = useMutation(async (id) => {
        try {
            setLoading(true);

            await API.delete(`/product/${id}`);

            handleClose();
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        refetchProducts();
    });

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
                <h5 className="text-primary fw-bold mb-3">List Product</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((item, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                    <img src={item.image} alt="" srcset="" width="100px" />
                                </td>
                                <td>{item.name}</td>
                                <td className="text-center">{item.stock}</td>
                                <td className="text-center">{rupiah(item.price)}</td>
                                <td>{item.description}</td>
                                <td className="text-warning">
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button href={`/edit-product/${item.id}`} variant="link" className="text-decoration-none badge w-100 bg-success">
                                            Edit
                                        </Button>
                                        <Button variant="link" onClick={() => handleShow(item.id, item.name)} className="text-decoration-none badge w-100 bg-danger">
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header>
                    <Modal.Title>Delete {itemName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure want to delete {itemName}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={handleClose}>
                        Cancel
                    </Button>
                    {isLoading ? (
                        <Button disabled={isLoading} variant="danger" type="submit">
                            <Spinner animation="border" size="sm" role="status" className="me-1" />
                            Loading...
                        </Button>
                    ) : (
                        <Button variant="danger" className="text-white" onClick={() => handleDelete.mutate(itemId)}>
                            Delete
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}
