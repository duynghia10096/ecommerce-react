import React, {useState} from "react";

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import NavBar from "./routes/navbar/navBar";
import {TabPanelList} from "./routes/navbar/tabPanelList";
import Home from "./routes/home/home";
import SignIn from "./routes/signin/signIn";
import SignUp from "./routes/signup/signUp";
import Product from "./routes/product/product";
import ProductDetail from "./routes/detail/productDetails";
import Checkout from "./routes/checkout/checkout";
import ShoppingBag from "./routes/shoppingBag";
import {SuccessPayment} from "./routes/successPayment";
import {CancelPayment} from "./routes/cancelPayment";
import {BadRequest} from "./ui/error/badRequest";

const App = () => {
   
   

    return (
        <Router>
            <NavBar/>
            <TabPanelList/>
            <Routes>
                <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/shopping-bag" element={<ShoppingBag />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/products/details/shopping-bag" element={<ShoppingBag />} />
                    <Route path="/products/:details" element={<ProductDetail />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/checkout/success-payment/:id" element={<SuccessPayment />} />
                    <Route path="/checkout/cancel-payment/:id" element={<CancelPayment />} />
                    <Route path="*" element={<BadRequest />} />
            </Routes>
        </Router>
    )
}

export default App;