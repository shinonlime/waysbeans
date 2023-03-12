import {Container, Image} from "react-bootstrap";

export default function Jumbotron() {
    return (
        <>
            <Container className="d-flex justify-content-center">
                <Image fluid src="/waysbeans/jumbotron.png" className="my-5"></Image>
            </Container>
        </>
    );
}
