import {
    HANDLE_SIGN_IN,
    HANDLE_SIGN_UP_ERROR,
    HANDLE_SIGN_OUT,
    HANDLE_SIGN_IN_ERROR,
    LOAD_FILTER_PRODUCTS,
    LOAD_FILTER_ATTRIBUTES,
    SHIPPING_ADDRESS_CONFIRMED,
    PAYMENT_INFO_CONFIRMED,
    PAYMENT_RESPONSE,
    HANDLE_GOOGLE_AUTH_SIGN_IN,
    HANDLE_GOOGLE_AUTH_SIGN_OUT,
    PAYMENT_RESPONSE_ERROR, SEARCH_KEYWORD_ERROR, SEARCH_KEYWORD,
} from './types';
import {INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_ERROR_CODE} from '../constants/http_error_codes'
import {SHOPPERS_PRODUCT_INFO_COOKIE, CART_TOTAL_COOKIE, AUTH_DETAILS_COOKIE} from '../constants/cookies'

import {Base64} from 'js-base64';
import Cookies from 'js-cookie';

import {commonServiceAPI, authServiceAPI, searchSuggestionServiceAPI} from "../api/service_api";
import axios from 'axios';
import {DEFAULT_SEARCH_SUGGESTION_API, SEARCH_SUGGESTION_API} from "../constants/api_routes";

export const setAuthDetailsFromCookie = savedResponse => {
    return {
        type: HANDLE_SIGN_IN,
        payload: savedResponse
    }
}

export const setShippingAddress = payload => {
    return {
        type: SHIPPING_ADDRESS_CONFIRMED,
        payload: payload
    }
}

export const setPaymentInfo = payload => {
   
    return {
        type: PAYMENT_INFO_CONFIRMED,
        payload: payload
    }
}

export const signIn = (formValues, navigate) => async dispatch => {
   

    const hash = Base64.encode(`${formValues.username}:${formValues.password}`);
    authServiceAPI.defaults.headers.common['Authorization'] = `Basic ${hash}`
    const response = await authServiceAPI.post('/authenticate').catch(err => {
      
        dispatch({type: HANDLE_SIGN_IN_ERROR, payload: err.message});
    });

    if (response) {
        if (response.data.jwt) {
            dispatch({type: HANDLE_SIGN_IN, payload: response.data});
          
            localStorage.setItem(AUTH_DETAILS_COOKIE, JSON.stringify(response.data));
            
            navigate('/');
        } else {
            dispatch({type: HANDLE_SIGN_IN_ERROR, payload: response.data.error});
        }
    }
}

export const signOut = () => {
    localStorage.removeItem(AUTH_DETAILS_COOKIE)
    return {
        type: HANDLE_SIGN_OUT
    }
}

export const signInUsingOAuth = googleAuth => async dispatch => {
   

    // check if not signed in
    if (googleAuth && !googleAuth.isSignedIn.get()) {
       
        // sign in
        googleAuth.signIn(JSON.parse(googleAuth.currentUser.get().getId())).then(async () => {

                // if sign in works
                if (googleAuth.isSignedIn.get()) {
                    

                    dispatch({
                        type: HANDLE_GOOGLE_AUTH_SIGN_IN,
                        payload: {
                            firstName: googleAuth.currentUser.get().getBasicProfile().getGivenName(),
                            oAuth: googleAuth
                        }
                    })
                    window.location.replace('/');

                    // try {
                    // let userProfile = googleAuth.currentUser.get().getBasicProfile()
                    // if (userProfile) {
                    //     const response = await authServiceAPI.post('/signin-using-google-auth', {
                    //         'id': userProfile.getId(),
                    //         'firstname': userProfile.getGivenName(),
                    //         'lastname': userProfile.getFamilyName(),
                    //         'email': userProfile.getEmail(),
                    //         'username': null,
                    //         'password': null,
                    //     }).catch(err => {
                    //         log.info(`[ACTION]: signUp dispatch HANDLE_SIGN_UP_ERROR err.message = ${err.message}.`)
                    //     });
                    //
                    //     if(response.data === "success") {
                    //         // here we are sure that we signed in and now dispatch.
                    //         dispatch({
                    //             type: HANDLE_GOOGLE_AUTH_SIGN_IN,
                    //             payload: {
                    //                 oAuth: googleAuth
                    //             }
                    //         })
                    //         history.push("/");
                    //     } else {
                    //         dispatch({type: HANDLE_SIGN_IN_ERROR, payload: response.data.error});
                    //     }

                    // dispatch({
                    //     type: HANDLE_GOOGLE_AUTH_SIGN_IN,
                    //     payload: {
                    //         oAuth: googleAuth
                    //     }
                    // })
                    // history.push("/");
                    // }
                    // } catch
                    //     (e) {
                    //     log.info(`[signInUsingOAuth] Unable to retrieve user profile.`)
                    //     dispatch({type: HANDLE_SIGN_IN_ERROR, payload: "Unable to retrieve user profile."});
                    // }
                }
            }
        )
    }
}

export const signOutUsingOAuth = googleAuth => async dispatch => {
    

    // if signed in then only try to sign out
    if (googleAuth && googleAuth.isSignedIn.get()) {

        
        googleAuth.signOut().then(() => {
            if (!googleAuth.isSignedIn.get()) {
               
                dispatch({
                    type: HANDLE_GOOGLE_AUTH_SIGN_OUT,
                    payload: null
                })
            }
        });
    }
}

export const signUp = formValues => async dispatch => {
   

    const response = await authServiceAPI.post('/signup', {
        'username': formValues.username,
        'password': formValues.password,
        'firstname': formValues.firstName,
        'lastName': formValues.lastName,
        'email': formValues.email.toLowerCase(),
    }).catch(err => {
        dispatch({type: HANDLE_SIGN_UP_ERROR, payload: err.message});
    });

    if (response) {
        if (response.data.account_creation_status === 'success') {
          
     
            window.location.replace('/signin');
        } else {
            
           
            dispatch({type: HANDLE_SIGN_UP_ERROR, payload: response.data.error_msg});
        }
    }
}

export const sendPaymentToken = (token) => async dispatch => {
    
  

    let url = `${process.env.REACT_APP_PAYMENT_SERVICE_URL}`;
   
    let config = {
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(token)
    };


   
    try {
        const response = await axios(config);
        
        let paymentResponse = {
            ...response.data
        };

        if (response.data.payment_failed) {
            // Redirect to cancel payment page
            token.navigate(`/checkout/cancel-payment/${response.data.charge_id}`);
        } else {
            // Redirect to the receipt URL
            token.navigate(`/checkout/success-payment/${response.data.charge_id}`);// Redirect to PayPal's receipt URL
            // or you could navigate to a local success page
            // navigate(`/checkout/success-payment/${response.data.charge_id}`);

            // Clean up cookies if necessary
            localStorage.removeItem(CART_TOTAL_COOKIE);
            localStorage.removeItem(SHOPPERS_PRODUCT_INFO_COOKIE);
        }

        dispatch({
            type: PAYMENT_RESPONSE,
            payload: { ...paymentResponse, error: false, errorMsg: null },
        });
        return paymentResponse;

    } catch (error) {
      
        
        dispatch({
            type: PAYMENT_RESPONSE_ERROR,
            payload: { errorMsg: "Something Went Wrong" },
        });
    }
    
}


export const getDataViaAPI = (type, route, query, synchronous = true, navigate) => async dispatch => {
    if (route) {
        if (query) {
            route += query
        }

       
        let isFetchError = false
        if (synchronous) {
            await commonServiceAPI.get(route)
                .then(response => processResponse(response, query, type, route,navigate))
                .catch(err => {
                    isFetchError = true
                });
        } else {
            commonServiceAPI.get(route)
                .then(response => processResponse(response, query, type, route, dispatch,navigate))
                .catch(err => {
                    isFetchError = true
                });
        }

        if (isFetchError) {
          
            dispatch({type: type, payload: {isLoading: false, statusCode: INTERNAL_SERVER_ERROR_CODE}});
        }
    }
}

export const processResponse = (response, query, type, uri, dispatch, navigate) => {
   
    if (response.data !== null) {
        let payload = {isLoading: false, data: JSON.parse(JSON.stringify(response.data))}
        if (query) {
            dispatch({
                type: type, payload:
                    {...payload, query: query}
            });
        } else {
            dispatch({
                type: type, payload: payload
            });
        }

        if (LOAD_FILTER_PRODUCTS.localeCompare(type) === 0 &&
            window.location.search.localeCompare(uri.split("/products")[1]) !== 0) {
            // history.push(uri)
            navigate("/uri");
        }
    } else {
        dispatch({type: type, payload: {isLoading: false, statusCode: BAD_REQUEST_ERROR_CODE}});
    }
}

export const loadFilterAttributes = filterQuery => dispatch => {
  

    if (filterQuery) {
        let uri = `/filter${filterQuery}`
        commonServiceAPI.get(uri)
            .then(response => {
                dispatch({
                    type: LOAD_FILTER_ATTRIBUTES,
                    payload: JSON.parse(JSON.stringify(
                        {
                            ...response.data,
                            "query": filterQuery.slice(3)
                        }))
                });

                return JSON.parse(JSON.stringify(response.data))
            })
            .catch(error => {
               
            });
    }
};

export const getSearchSuggestions = (prefix) => async dispatch => {
   
    

    if (prefix) {
        let responseError = false
        const uri = SEARCH_SUGGESTION_API + prefix
        const response = await searchSuggestionServiceAPI.get(uri)
            .catch(err => {
                
                
                dispatch({type: SEARCH_KEYWORD_ERROR});
                responseError = true
            });

        if (responseError) {
            return
        }

       
        
        dispatch({
            type: SEARCH_KEYWORD, payload: {data: JSON.parse(JSON.stringify(response.data))}
        });
    }

}

export const setDefaultSearchSuggestions = () => dispatch => {
  
    
    searchSuggestionServiceAPI.get(DEFAULT_SEARCH_SUGGESTION_API)
        .then(response => {
            dispatch({
                type: SEARCH_KEYWORD, payload: {data: JSON.parse(JSON.stringify(response.data))}
            });
        })
        .catch(err => {
           
            
            dispatch({type: SEARCH_KEYWORD_ERROR});
        });
}
