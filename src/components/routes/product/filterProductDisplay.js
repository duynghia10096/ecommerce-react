import React, {useEffect} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {connect, useDispatch, useSelector} from "react-redux";
import {getDataViaAPI} from "../../../actions";
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import {DETAILS_ROUTE, PRODUCTS_ROUTE} from "../../../constants/react_routes";

import {LOAD_FILTER_PRODUCTS, SELECT_PRODUCT_DETAIL} from "../../../actions/types";
import {PRODUCT_BY_CATEGORY_DATA_API} from '../../../constants/api_routes';
import {Box, Grid} from "@material-ui/core";
import Spinner from "../../ui/spinner";
import {HTTPError} from "../../ui/error/httpError";
import {SearchMatchesNotFound} from "../../ui/error/searchMatchesNotFound";

const FilterProductDisplay = props => {
        const filterProductsReducer = useSelector(state => state.filterProductsReducer)
        let filterProducts = null
        const dispatch = useDispatch()
        const navigate = useNavigate();
        const location = useLocation()
        useEffect(() => {
          

            props.getDataViaAPI(LOAD_FILTER_PRODUCTS, PRODUCT_BY_CATEGORY_DATA_API, location.search, false,navigate)

            // scroll up after call the API
            window.scrollTo(0, 0)

            // eslint-disable-next-line
        }, [location.search]);


        // initial state is loading and this will change
        // when we retrieve data
        if (filterProductsReducer.isLoading) {
          
            return (
                <Box display="flex" pb={15} justifyContent="center" css={{width: '100%'}}>
                    <Spinner/>
                </Box>
            )
        } else {
            if (filterProductsReducer.hasOwnProperty("data")) {
                // if does not got anything from the server but we didn't got any
                // error then we didn't find any matches
                if (Object.entries(filterProductsReducer.data).length === 0) {
                    return (
                        <Box display="flex" justifyContent="center" css={{width: '100%', height: '100%'}}>
                            <SearchMatchesNotFound/>
                        </Box>
                    )
                }

                // set the products here
                filterProducts = filterProductsReducer.data.products

            } else {

                // if there is any error then status code will be set in action creator.
                if (filterProductsReducer.hasOwnProperty('statusCode')) {
                   
                    return <HTTPError statusCode={filterProductsReducer.statusCode}/>
                }
            }
        }

        const handleImageClick = selectedProduct => () => {
           
            dispatch({
                type: SELECT_PRODUCT_DETAIL,
                payload: {
                    isLoading: false,
                    data: {
                        [selectedProduct.id]: selectedProduct
                    }
                }
            })
        }

        const renderProductList = (productList) => {
           

            return productList.map((info) => {
               
                return (
                    <Grid item container direction="column" spacing={1} xs={6} sm={4} md={4} lg={3} key={info.id}>
                        <Grid item>
                            <Link to={`${DETAILS_ROUTE}${location.search}::product_id=${info.id}`}
                                  onClick={handleImageClick(info)}>
                                <img src={info.imageURL} alt={info.name}
                                     style={{height: "100%", width: "100%"}}
                                     title={info.name}/>
                            </Link>
                        </Grid>
                        {/* <Grid item>
                            <Link to={`${PRODUCTS_ROUTE}?q=brand=${info.productBrandCategory.id}`}>
                                <div style={{color: 'black', fontSize: "16px", fontWeight: "bold"}}>
                                    {info.productBrandCategory.type}
                                </div>
                            </Link>
                        </Grid> */}
                        <Grid item style={{fontSize: "14px", color: "grey"}}>
                            {info.name}
                        </Grid>
                        <Grid item style={{fontSize: "16px", fontWeight: "bold"}}>
                            {`$${info.price}`}
                        </Grid>
                        <Grid item style={{fontSize: "14px"}}>
                            Free ship at $25
                        </Grid>
                        <Grid item>
                            <Rating
                                style={{zIndex: "1"}}
                                name="customized-empty"
                                defaultValue={info.ratings}
                                precision={0.5}
                                readOnly
                                emptyIcon={<StarBorderIcon fontSize="inherit"/>}
                            />
                        </Grid>
                    </Grid>
                )
            });
        };

      
        return (
            <Grid item container spacing={2} xs={12} md={12} style={{padding: "1rem 0 1rem 1rem", margin: 0}}>
                {renderProductList(filterProducts)}
            </Grid>
        )
    }
;
export default connect(null, {getDataViaAPI})(FilterProductDisplay);