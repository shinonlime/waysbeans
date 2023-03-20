import Jumbotron from "../components/jumbotron";
import ProductCard from "../components/product-card";

export default function LandingPage() {
    document.title = "WaysBeans";

    return (
        <>
            <Jumbotron />
            <ProductCard />
        </>
    );
}
