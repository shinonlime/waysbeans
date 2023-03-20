import {Container, Image} from "react-bootstrap";

export default function Jumbotron() {
    return (
        <>
            <Container className="d-flex justify-content-center">
                <Image fluid src="https://res.cloudinary.com/deovn7i1j/image/upload/v1679213130/waysbeans/jumbotron_ol0e0f.png" className="my-5"></Image>
            </Container>
        </>
    );
}
