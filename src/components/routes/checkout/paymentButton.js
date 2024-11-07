import React, { Component } from 'react'

import { Button, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { sendPaymentToken } from "../../../actions"

import AlertModal from "../../ui/alertModal";
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_DETAILS_COOKIE } from '../../../constants/cookies';


class PaymentButton extends Component {

    _GrandTotal = 0


    getGrandTotal = () => {
        this._GrandTotal = (this.props.cartTotal + this.props.deliveryCharges) * 100
        return this._GrandTotal
    }

    handleApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {

            const authData = localStorage.getItem(AUTH_DETAILS_COOKIE);
            const shippingPrice = parseFloat(this.props.shippingOption.price.replace(/[^\d.-]/g, ''));
            const username = JSON.parse(authData);
            const token = {
                id: details.id,
                amount: this._GrandTotal,
                currency: "USD",
                address: this.props.shippingAddressForm.values,
                addToCart: this.props.addToCart,
                shippingOption: this.props.shippingOption,
                navigate: this.props.navigate,
            };

            const paymentResponse = await this.props.sendPaymentToken(token);

            const cartItems = Object.keys(this.props.shoppingBagProducts.data).map(key => {
                const product = this.props.shoppingBagProducts.data[key];

                return {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: this.props.addToCart.productQty[key],
                    stock: product.availableQuantity,
                    imageUrl: product.imageURL
                };
            })
            const orderData = {
                userId: username.userInfo.id,
                price: this._GrandTotal,
                totalPrice: this._GrandTotal,
                status: "PENDING",
                address: this.props.shippingAddressForm.values.addressLine1,
                city: this.props.shippingAddressForm.values.city,
                state: this.props.shippingAddressForm.values.stateCode,
                shippingPrice: shippingPrice,
                phoneNo: this.props.shippingAddressForm.phoneNumber,
                cartItemDtos: cartItems
            }
            if (paymentResponse.payment_failed === false) {
               orderData.paymentStatus = "Paid";
            } else {
                orderData.paymentStatus = "Not Paid"
            }   

            console.log(orderData);
            try {
                const response = await axios.post('http://34.207.80.123:5000/api/order/saveOrder', orderData);
                if (response.status === 200) {
                    // Xử lý khi API trả về thành công
                    console.log('Order saved successfully', response.data);
                    
                } else {
                    // Xử lý khi API trả về lỗi
                    console.error('Failed to save order', response.data);
                }
            } catch (error) {
                console.error('Error saving order', error);
            }


        });

    };

    // onToken = (token) => {
    //     log.info("[PaymentButton] onToken setting loadingHandler to true")
    //     this.props.loadingHandler(true)

    //     this.props.sendPaymentToken({
    //         ...token,
    //         id: token.id,
    //         amount: this._GrandTotal,
    //         currency: "USD",
    //         address: this.props.shippingAddressForm.values,
    //         addToCart: this.props.addToCart,
    //         shippingOption: this.props.shippingOption
    //     })
    // }

    renderButton = () => {

        return (
            <Grid container justify="center" style={{ padding: "2rem 0 2rem 0" }}>
                <Grid item lg={9}>
                    <Button variant="contained" size="medium"
                        disabled={this.props.disabled}
                        style={{
                            width: '100%', height: 50, color: 'white',
                            fontWeight: "bold", backgroundColor: "#e01a2b",
                            fontSize: "1rem"
                        }}>
                        PLACE ORDER
                    </Button>
                </Grid>
            </Grid>
        )
    }

    render() {

        console.log("Shopping Bag", this.props.shoppingBagProducts);
        console.log("shippingAddressForm", this.props.shippingAddressForm);
        console.log("shippingOption", this.props.shippingOption);
        console.log("Add to cart", this.props.addToCart)
        return (
            <>
                <AlertModal title="Payment Error"
                    question="Something went wrong. Please try again later."
                    enable={this.props.paymentResponse.error}
                    timestamp={this.props.paymentResponse.timestamp}
                />

                {this.props.disabled ? (
                    this.renderButton()
                ) : (
                    <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: this.getGrandTotal().toFixed(2)
                                        }
                                    }]
                                });
                            }}
                            onApprove={this.handleApprove}
                        />
                    </PayPalScriptProvider>
                )}
            </>
        )
    }
}
const WrappedPaymentButton = (props) => {
    const navigate = useNavigate();
    return <PaymentButton {...props} navigate={navigate} />;
};

const mapStateToProps = (state) => {
    return ({
        cartTotal: state.cartTotalReducer,
        shippingAddressForm: state.form.shippingAddressForm ?
            state.form.shippingAddressForm : null,
        shippingOption: state.shippingOptionReducer,
        addToCart: state.addToCartReducer,
        deliveryCharges: state.deliveryChargesReducer,
        paymentResponse: state.paymentResponseReducer,
        shoppingBagProducts: state.shoppingBagProductReducer.data
    })
}

export default connect(mapStateToProps, { sendPaymentToken })(WrappedPaymentButton)