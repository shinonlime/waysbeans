import {Container, Table} from "react-bootstrap";
import {useQuery} from "react-query";

import {API} from "../../config/api";

export default function IncomeTransaction() {
    let {data: transaction} = useQuery("transactionsCache", async () => {
        const response = await API.get("/transaction");
        return response.data.data;
    });

    return (
        <>
            <Container className="my-5">
                <h5 className="text-primary fw-bold mb-3">Income Transaction</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>ID Transaction</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Product Order</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction &&
                            transaction.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{data.id}</td>
                                    <td>{data.name}</td>
                                    <td>{data.address}</td>
                                    <td>{data.cart && data.cart.map((item, idx) => <span>{item.product.name}, </span>)}</td>
                                    {data.status === "success" ? (
                                        <td className="text-success">Success</td>
                                    ) : data.status === "pending" ? (
                                        <td className="text-warning">Pending</td>
                                    ) : (
                                        <td className="text-danger">Failed</td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
