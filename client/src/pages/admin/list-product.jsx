import {Container, Table, Button} from "react-bootstrap";
import {useState, useEffect} from "react";
import {useQuery, useMutation} from "react-query";

import {API} from "../../config/api";

export default function ListProduct() {
    let {data: products} = useQuery("productsCache", async () => {
        const response = await API.get("/products");
        return response.data.data;
    });

    const handleDelete = useMutation(async (id) => {
        try {
            await API.delete(`/product/${id}`);
        } catch (error) {
            console.log(error);
        }
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
                                    <img src={`http://localhost:5000/uploads/${item.image}`} alt="" srcset="" width="100px" />
                                </td>
                                <td>{item.name}</td>
                                <td className="text-center">{item.stock}</td>
                                <td className="text-center">{rupiah(item.price)}</td>
                                <td>{item.description}</td>
                                <td className="text-warning">
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Button variant="link" onClick={() => handleDelete.mutate(item.id)} className="text-decoration-none badge w-100 bg-danger">
                                            Delete
                                        </Button>
                                        <Button href={`/edit-product/${item.id}`} variant="link" className="text-decoration-none badge w-100 bg-success">
                                            Update
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
