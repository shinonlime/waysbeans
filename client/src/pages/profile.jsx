import {Container, Row, Col, Button} from "react-bootstrap";
import {useState} from "react";
import {useQuery} from "react-query";
import UpdateProfile from "../components/update-profile";

import {API} from "../config/api";

export default function Profile() {
    const [updateProfileShow, setUpdateProfileShow] = useState(false);

    const handleClose = () => setUpdateProfileShow(false);
    const handleShow = () => setUpdateProfileShow(true);

    let {data: profile} = useQuery("userCache", async () => {
        const response = await API.get("/profile");
        return response.data.data;
    });

    let {data: userTransaction} = useQuery("transactionsCache", async () => {
        const response = await API.get("/user/transaction");
        return response.data.data.transaction;
    });

    const rupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    if (userTransaction) {
        return (
            <>
                <Container className="my-5">
                    <Row xs={1} md={2} className="justify-content-md-between">
                        <Col md="auto">
                            <h5 className="text-primary fw-bold mb-3">My Profile</h5>
                            <div className="d-flex gap-4 mb-3">
                                {profile?.image ? (
                                    <img src={`http://localhost:5000/uploads/${profile?.image}`} alt="" width="200px" style={{objectFit: "cover"}} className="rounded" />
                                ) : (
                                    <img src="/waysbeans/profile.png" alt="" width="200px" style={{objectFit: "cover"}} className="rounded" />
                                )}
                                <div className="d-flex align-items-start flex-column">
                                    <div className="mb-auto">
                                        <div className="mb-4">
                                            <h6 className="text-secondary fw-bold mb-2">Full Name</h6>
                                            <p>{profile?.name}</p>
                                        </div>
                                        <div>
                                            <h6 className="text-secondary fw-bold mb-2">Email</h6>
                                            <p>{profile?.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Button onClick={() => handleShow()}>Update profile</Button>
                                    </div>
                                    <UpdateProfile show={updateProfileShow} onHide={() => handleClose()} />
                                </div>
                            </div>
                        </Col>
                        <Col md="auto">
                            <h5 className="text-primary fw-bold mb-3">My Transaction</h5>
                            {userTransaction?.map((transaction, index) => {
                                const createdAt = new Date(transaction.created_at).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                });

                                return (
                                    <>
                                        <h6 className="text-primary fw-semi-bold mb-3">
                                            Transaction ID: <span className="fw-bold">{transaction.id}</span>
                                        </h6>
                                        {transaction.cart?.map((item, index) => {
                                            return (
                                                <>
                                                    <div key={index} className="p-3 w-100 mb-3 bg-accent">
                                                        <div className="d-flex align-items-center justify-content-between gap-5">
                                                            <div className="d-flex me-5">
                                                                <img src={`http://localhost:5000/uploads/${item.product.image}`} alt="" width="100px" />
                                                                <div className="d-flex justify-content-between gap-5">
                                                                    <div className="ms-3">
                                                                        <div className="mb-3">
                                                                            <h5 className="text-primary fw-bold mb-1">{item.product.name}</h5>
                                                                            <p className="m-0 text-secondary fw-semibold">{createdAt}</p>
                                                                        </div>
                                                                        <div className="">
                                                                            <p className="m-0 text-secondary">Price: {rupiah(item.product.price)}</p>
                                                                            <p className="m-0 text-secondary">Qty: {item.quantity}</p>
                                                                            <p className="text-secondary fw-bold m-0">Subtotal: {rupiah(item.product.price * item.quantity)}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column justify-content-end gap-2">
                                                                <img src="/waysbeans/Icon.png" className="mx-auto" alt="" width="90px" />
                                                                <img src="/waysbeans/qrcode.png" className="mx-auto" alt="" width="60px" />
                                                                {transaction.status === "success" ? (
                                                                    <Button variant="success" className="mx-auto w-100" disabled>
                                                                        Success
                                                                    </Button>
                                                                ) : transaction.status === "pending" ? (
                                                                    <Button variant="warning" className="mx-auto w-100" disabled>
                                                                        Pending
                                                                    </Button>
                                                                ) : (
                                                                    <Button variant="danger" className="mx-auto w-100" disabled>
                                                                        Failed
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </>
                                );
                            })}
                        </Col>
                    </Row>
                </Container>
            </>
        );
    } else {
        return (
            <>
                <Container className="my-5">
                    <Row xs={1} md={2} className="justify-content-md-between">
                        <Col md="auto">
                            <h5 className="text-primary fw-bold mb-3">My Profile</h5>
                            <div className="d-flex gap-4 mb-3">
                                <img src="/waysbeans/profile.png" alt="" width="200px" className="rounded" />
                                <div>
                                    <div className="mb-4">
                                        <h6 className="text-secondary fw-bold mb-2">Full Name</h6>
                                        <p>{profile?.name}</p>
                                    </div>
                                    <div>
                                        <h6 className="text-secondary fw-bold mb-2">Email</h6>
                                        <p>{profile?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md="auto">
                            <h5 className="text-primary fw-bold mb-3">My Transaction</h5>
                            <p className="m-0">Empty</p>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
