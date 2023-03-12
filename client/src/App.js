import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import {API, setAuthToken} from "./config/api";
import {UserContext} from "./context/user-context";

import NaviBar from "./components/navbar";

import LandingPage from "./pages/landing-page";
import DetailProduct from "./pages/detail-product";
import Cart from "./pages/cart";
import Profile from "./pages/profile";

import IncomeTransaction from "./pages/admin/income-transaction";
import AddProduct from "./pages/admin/add-product";
import EditProduct from "./pages/admin/edit-product";
import ListProduct from "./pages/admin/list-product";

import {PrivateRouteLogin, PrivateRouteUser, PrivateRouteAdmin} from "./components/private-routes";

export default function App() {
    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect Auth but just when isLoading is false
        if (!isLoading) {
            if (state.isLogin === false) {
                navigate("/");
            }
        }
    }, [isLoading]);

    useEffect(() => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
            checkUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const checkUser = async () => {
        try {
            const response = await API.get("/check-auth");
            console.log("check user success : ", response);
            // Get user data
            let payload = response.data.data;
            // Get token from local storage
            payload.token = localStorage.token;
            // Send data to useContext
            dispatch({
                type: "USER_SUCCESS",
                payload,
            });
            setIsLoading(false);
        } catch (error) {
            console.log("check user failed : ", error);
            dispatch({
                type: "AUTH_ERROR",
            });
            setIsLoading(false);
        }
    };

    return (
        <>
            <NaviBar />
            {isLoading ? null : 
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/detail-product/:id" element={<DetailProduct />} />
                    <Route element={<PrivateRouteLogin />}>
                        <Route element={<PrivateRouteUser />}>
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/cart/:id" element={<Cart />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                        <Route element={<PrivateRouteAdmin />}>
                            <Route path="/income-transaction" element={<IncomeTransaction />} />
                            <Route path="/add-product" element={<AddProduct />} />
                            <Route path="/edit-product/:id" element={<EditProduct />} />
                            <Route path="/list-products" element={<ListProduct />} />
                        </Route>
                    </Route>
                </Routes>
            }

            <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossOrigin="true"></script>

            <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js" crossOrigin="true"></script>

            <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js" crossOrigin="true"></script>
        </>
    );
}
