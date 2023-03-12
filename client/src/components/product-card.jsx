import {Container, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {useQuery, useMutation} from "react-query";

import {API} from "../config/api";

export default function ProductCard() {
    const styles = {
        card: {
            backgroundColor: "#F6E6DA",
            width: "250px",
        },
    };

    let {data: products} = useQuery("productsCache", async () => {
        const response = await API.get("/products");
        return response.data.data;
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
            <Container className="mb-5">
                <Row xs={1} md={2} lg={4} className="g-4 justify-content-center">
                    {products &&
                        products.length > 0 &&
                        products.map((res, index) => {
                            return (
                                <Link key={index} to={`detail-product/${res.id}`} className="text-decoration-none">
                                    <Col key={index}>
                                        <div style={styles.card}>
                                            <img src={`http://localhost:5000/uploads/${res.image}`} width="250px" height="auto" alt={res.name} />
                                            <div className="mt-2 px-3 py-2">
                                                <p className="mb-2 fw-bold fs-5 text-decoration-none text-primary">{res.name}</p>
                                                <div>
                                                    <p className="mb-1 mt-3 text-secondary">{rupiah(res.price)}</p>
                                                    <p className="text-secondary">Stock: {res.stock}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Link>
                            );
                        })}
                </Row>
            </Container>
        </>
    );
}
