import {Container, Table, Modal, Button} from "react-bootstrap";
import {useState} from "react";
import {useQuery} from "react-query";

import {API} from "../../config/api";

export default function IncomeTransaction() {
    const title = "Income Transaction";
    document.title = "WaysBeans | " + title;

    const [showDetail, setShowDetail] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleDetailClose = () => setShowDetail(false);
    const handleDetailShow = (data) => {
        setSelectedTransaction(data);
        setShowDetail(true);
    };

    let {data: transaction} = useQuery("transactionsCache", async () => {
        const response = await API.get("/transaction");
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
            <Container className="my-5">
                <h5 className="text-primary fw-bold mb-3">Income Transaction</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>ID Transaction</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction &&
                            transaction.map((data, index) => (
                                <tr key={index}>
                                    <td className="align-middle">{index + 1}</td>
                                    <td className="align-middle">{data.id}</td>
                                    <td className="align-middle">{data.name}</td>
                                    <td className="align-middle">{data.address}</td>
                                    {data.status === "success" ? (
                                        <td className="text-success align-middle">Success</td>
                                    ) : data.status === "pending" ? (
                                        <td className="text-warning align-middle">Pending</td>
                                    ) : (
                                        <td className="text-danger align-middle">Failed</td>
                                    )}
                                    <td>
                                        <Button variant="link" className="p-0 fw-semibold" onClick={() => handleDetailShow(data)}>
                                            Detail transaction
                                        </Button>
                                    </td>

                                    <Modal show={showDetail} onHide={handleDetailClose} centered>
                                        {selectedTransaction && (
                                            <>
                                                <Modal.Header>
                                                    <Modal.Title className="text-primary">Transaction ID: {selectedTransaction?.id}</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body className="">
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <p className="m-0">Name:</p>
                                                        <p className="m-0">{selectedTransaction.name}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <p className="m-0">Email:</p>
                                                        <p className="m-0">{selectedTransaction.email}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <p className="m-0">Phone:</p>
                                                        <p className="m-0">{selectedTransaction.phone}</p>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-3">
                                                        <p className="m-0">Address:</p>
                                                        <p className="m-0 w-50 text-wrap text-end">{selectedTransaction.address}</p>
                                                    </div>
                                                    <div>
                                                        <Table striped bordered hover className="w-100 table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Product Name</th>
                                                                    <th>Quantity</th>
                                                                    <th>Price</th>
                                                                    <th>Sub Total</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {selectedTransaction.product?.map((item) => (
                                                                    <tr>
                                                                        <td>{item.product_name}</td>
                                                                        <td className="text-center">{item.quantity}</td>
                                                                        <td className="text-end">{rupiah(item.product_price)}</td>
                                                                        <td className="text-end">{rupiah(item.product_price * item.quantity)}</td>
                                                                    </tr>
                                                                ))}
                                                                <tr>
                                                                    <td colspan="3" className="text-end fw-bold">
                                                                        Total
                                                                    </td>
                                                                    <td className="fw-bold text-end">{rupiah(selectedTransaction.total)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Modal.Body>
                                            </>
                                        )}
                                    </Modal>
                                </tr>
                            ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
