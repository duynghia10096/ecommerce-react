import React, { useEffect, useState } from 'react';
import { Button, Grid, Box, Typography, Divider, Avatar } from "@material-ui/core";
import log from 'loglevel';
import BreadcrumbsSection from "../../ui/breadcrumbs";

import { useDispatch, useSelector } from "react-redux";
import { connect } from 'react-redux';
import { getDataViaAPI } from '../../../actions'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import Cookies from 'js-cookie';
import { ADD_TO_CART, SELECT_PRODUCT_DETAIL } from "../../../actions/types";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from "@material-ui/core/styles";
import Spinner from "../../ui/spinner";
import { InternalServerError } from "../../ui/error/internalServerError";
import { BadRequest } from "../../ui/error/badRequest";
import _ from "lodash";
import { PRODUCT_BY_ID_DATA_API } from "../../../constants/api_routes";
import { SHOPPERS_PRODUCT_INFO_COOKIE } from "../../../constants/cookies";
import { HOME_ROUTE } from "../../../constants/react_routes";
import { DocumentTitle } from "../../ui/documentTitle";
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import "./productDetail.css"
// export const useStyles = makeStyles((theme) => ({
//     root: {
//         padding: theme.spacing(3),
//     },
//     reviewSection: {
//         marginTop: theme.spacing(4),
//     },
//     ratingOverview: {
//         display: 'flex',
//         alignItems: 'center',
//         fontSize: '1.8rem',
//         marginBottom: theme.spacing(2),
//     },
//     ratingStars: {
//         display: 'flex',
//         alignItems: 'center',
//         color: '#FFD700', // Gold color for stars
//     },
//     filterButtons: {
//         display: 'flex',
//         justifyContent: 'flex-start',
//         marginTop: theme.spacing(2),
//         marginBottom: theme.spacing(3),
//         '& button': {
//             marginRight: theme.spacing(1),
//             padding: theme.spacing(1, 2),
//             borderRadius: '20px',
//             fontSize: '0.9rem',
//             border: '1px solid #ccc',
//             backgroundColor: '#f9f9f9',
//             color: '#333',
//             cursor: 'pointer',
//             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//             '&:hover': {
//                 backgroundColor: '#e0e0e0',
//                 transform: 'scale(1.05)',
//                 boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
//             },
//             '&:active': {
//                 transform: 'scale(0.98)',
//                 boxShadow: 'none',
//             },
//         },
//         '& button.MuiButton-contained': {
//             backgroundColor: '#ff5722', // Active filter button color
//             color: '#fff',
//             '&:hover': {
//                 backgroundColor: '#e64a19',
//             }
//         },
//     },
//     reviewItem: {
//         marginBottom: theme.spacing(4),
//         padding: theme.spacing(2),
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         backgroundColor: '#fff',
//         boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//         transition: 'box-shadow 0.3s ease',
//         '&:hover': {
//             boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
//         }
//     },
//     reviewerInfo: {
//         display: 'flex',
//         alignItems: 'center',
//         marginBottom: theme.spacing(1),
//     },
//     reviewText: {
//         marginTop: theme.spacing(1),
//         color: '#555',
//     },
//     sellerResponse: {
//         backgroundColor: '#f9f9f9',
//         padding: theme.spacing(2),
//         marginTop: theme.spacing(2),
//         borderRadius: 4,
//         fontStyle: 'italic',
//         borderLeft: '4px solid #ff5722',
//     },
//     reviewMedia: {
//         marginTop: theme.spacing(2),
//         display: 'flex',
//         '& img, & video': {
//             width: '100px',
//             height: '100px',
//             objectFit: 'cover',
//             marginRight: theme.spacing(1),
//             borderRadius: '8px',
//         },
//     },
//     avatar: {
//         backgroundColor: theme.palette.secondary.main,
//     },
// }));

export const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    activeButton: {
        backgroundColor: '#3f51b5', // Màu nền khi nút được nhấn
        color: '#fff', // Màu chữ khi nút được nhấn
    },
    reviewSection: {
        marginTop: theme.spacing(4),
    },
    ratingOverview: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.8rem',
        marginBottom: theme.spacing(2),
    },
    ratingStars: {
        display: 'flex',
        alignItems: 'center',
        color: '#FFD700', // Gold color for stars
    },
    filterButtons: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
        '& button': {
            marginRight: theme.spacing(1),
            padding: theme.spacing(1, 2),
            borderRadius: '20px',
            fontSize: '0.9rem',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            color: '#333',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                backgroundColor: '#e0e0e0',
                transform: 'scale(1.05)',
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
            },
            '&:active': {
                transform: 'scale(0.98)',
                boxShadow: 'none',
            },
        },
        '& button.MuiButton-contained': {
            backgroundColor: '#ff5722', // Active filter button color
            color: '#fff',
            '&:hover': {
                backgroundColor: '#e64a19',
            }
        },
    },
    reviewItem: {
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        }
    },
    reviewerInfo: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
    },
    reviewText: {
        marginTop: theme.spacing(1),
        color: '#555',
    },
    sellerResponse: {
        backgroundColor: '#f9f9f9',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        borderRadius: 4,
        fontStyle: 'italic',
        borderLeft: '4px solid #ff5722',
    },
    reviewMedia: {
        marginTop: theme.spacing(2),
        display: 'flex',
        '& img, & video': {
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            marginRight: theme.spacing(1),
            borderRadius: '8px',
        },
    },
    avatar: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

function ProductDetails(props) {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState('');
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'scale(0.9)' },
        to: { opacity: 1, transform: 'scale(1)' },
    });

    const classes = useStyles()
    const selectProductDetail = useSelector(state => state.selectProductDetailReducer)

    const selectedProduct = selectProductDetail.hasOwnProperty("data") ?
        selectProductDetail.data[window.location.search.split("product_id=")[1]] : null

    const dispatch = useDispatch()
    const addToCart = useSelector(state => state.addToCartReducer)
    const [productQuantity, setProductQuantity] = useState(1);
    const [selectedRating, setSelectedRating] = useState(null);
    const [activeButton, setActiveButton] = useState(null); // New state for active button

    const handleRatingFilterClick = (rating) => {
        setSelectedRating(rating);
        setActiveButton(rating); // Set active button when clicked
    };

    const reviews = [
        {
            id: 1,
            rating: 5,
            reviewerName: 'a*****7',
            date: '2024-08-30 17:01',
            classification: 'Vàng đồng',
            comments: 'Lần đầu mua hàng công nghệ trên sàn rất lo lắng sau khi sài gần 1 tháng thì thấy ổn với tầm giá',
            productQuality: 'Tốt',
            matchesDescription: 'Đúng',
            keyFeature: 'Chụp ảnh',
            media: [
                { type: 'image', url: '/path-to-image1.jpg' },
                { type: 'image', url: '/path-to-image2.jpg' },
                { type: 'video', url: '/path-to-video.mp4' },
            ],
            sellerResponse: 'Chào bạn, OPPO chân thành cảm ơn bạn đã tin dùng sản phẩm...',
        }
    ];


    /**
     * Update the Component when product is already selected.
     * Cart products are stored in Cookie and we will set the product
     * for the first time the page is rendered.
     */
    useEffect(() => {
        if (selectedProduct && selectedProduct.productImages && selectedProduct.productImages.length > 0) {
            setSelectedImage(selectedProduct.productImages[0].imageUrl);
        }
        // check if have anything in the cart
        if (selectedProduct && !_.isEmpty(addToCart.productQty)) {
            if (addToCart.productQty[selectedProduct.id]) {
                setProductQuantity(addToCart.productQty[selectedProduct.id])
            }

        }

        // eslint-disable-next-line
    }, [selectedProduct])

    // if the user change the URL format then just return bad request.
    if (window.location.pathname.localeCompare('/products/details') !== 0 ||
        window.location.search.search('product_id=') === -1
        || !window.location.search.startsWith('?q=')) {
        return <BadRequest />
    }

    // find the breadcrumb from the url
    const getStringBeforeLastDelimiter = (str, delimiter) => {
        return str.substring(0, str.lastIndexOf(delimiter))
    }

    const breadcrumbLinks = [
        {
            name: 'Home',
            link: HOME_ROUTE
        },
        {
            name: 'Products',
            link: `${getStringBeforeLastDelimiter(window.location.pathname, "/")
                + getStringBeforeLastDelimiter(window.location.search, "::")}`
        },
        {
            name: 'Details',
            link: `${window.location.pathname + window.location.search}`
        },
    ]

    console.log("Selected Product ", selectedProduct)

    if (!selectedProduct) {
        try {

            // if status code is set then its because of error.
            log.info(`[Product Detail] selectProductDetail = ${JSON.stringify(selectProductDetail)}`)
            if (selectProductDetail.hasOwnProperty("statusCode")) {
                log.info(`[Product Detail] Internal Server Error`)
                return <InternalServerError />
            }

            // get the product details from server
            const extractedProductId = window.location.search.split("product_id=")
            log.info(`[Product Detail] extractedProductId = ${JSON.stringify(extractedProductId)}, length = ${extractedProductId.length}`)
            if (extractedProductId.length === 2) {
                props.getDataViaAPI(SELECT_PRODUCT_DETAIL, PRODUCT_BY_ID_DATA_API + extractedProductId[1], null, false, navigate)
            }
        } catch (e) {
            log.error('[Product Detail] selectedProduct is null')
            return <BadRequest />
        }
    }

    if (selectProductDetail.isLoading) {
        return <Spinner />
    } else {
        if (!selectedProduct) {
            return <BadRequest />
        }
    }

    // set the cart products in the cookie
    const dispatchAddToCart = newAddToCart => {
        Cookies.set(SHOPPERS_PRODUCT_INFO_COOKIE, newAddToCart, { expires: 7 });
        log.info(`[Product Detail] dispatchAddToCart productQty = ${JSON.stringify(newAddToCart)}`)
        dispatch({
            type: ADD_TO_CART,
            payload: newAddToCart
        })
    }

    const handleAddToBagBtnClick = product_id => () => {
        log.info(`[Product Detail] Product is added to cart`)
        let newAddToCart = addToCart

        // add new product to cart
        if (newAddToCart.hasOwnProperty("productQty") === false) {
            newAddToCart = {
                totalQuantity: productQuantity,
                productQty: {
                    [product_id]: productQuantity
                }
            }
        } else {
            let totalQuantity = 0
            newAddToCart.productQty[product_id] = productQuantity
            newAddToCart.totalQuantity = 0

            for (const [, qty] of Object.entries(newAddToCart.productQty)) {
                totalQuantity += qty
            }
            newAddToCart.totalQuantity += totalQuantity
        }
        dispatchAddToCart(newAddToCart)
    }

    /**
     * Navigate to shopping bag page.
     */
    const handleProceedToBagBtnClick = () => {
        navigate(`${window.location.pathname}/shopping-bag${window.location.search}`)
    }

    if (props.window) {
        props.window.scrollTo(0, 0)
    }

    log.info(`[Product Detail] Rendering Detail Component. selectedProduct = ${JSON.stringify(selectedProduct)}`)
    return (
        <>
            <DocumentTitle title="Product Details" />
            <Box className="box-container">
                <BreadcrumbsSection linkList={breadcrumbLinks} />
            </Box>

            <Grid container spacing={3}>
                <Grid item sm={6} className="product-images">
                    <div className="large-image-container">
                        <img
                            src={selectedImage}
                            alt="Selected Product"
                            className="large-image"
                        />
                    </div>
                    <div className="small-images">
                        {selectedProduct.productImages && selectedProduct.productImages.length > 0 &&
                            selectedProduct.productImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.imageUrl}
                                    alt={`Product image ${index + 1}`}
                                    onClick={() => setSelectedImage(image.imageUrl)}
                                    className="small-image"
                                />
                            ))}
                    </div>
                </Grid>
                <Grid item xs={11} sm={5} md={6} className="product-details">
                    <div className="product-name">
                        {selectedProduct.name}
                    </div>
                    <div className="product-price">
                        {`$ ${selectedProduct.price}`}
                    </div>
                    <div className="tax-info">
                        inclusive of all taxes
                    </div>
                    <div className="quantity-controls">
                        <div className="quantity-label">Qty:</div>
                        <div className="quantity-value">{productQuantity}</div>
                        <Button variant="outlined" color="primary" size="large"
                            style={{ height: 40 }}
                            startIcon={<RemoveIcon fontSize="large" />}
                            disabled={productQuantity === 1}
                            onClick={() => setProductQuantity(productQuantity - 1)}
                        />
                        <Button variant="outlined" color="primary" size="large"
                            style={{ height: 40 }}
                            startIcon={<AddIcon fontSize="large" />}
                            onClick={() => setProductQuantity(productQuantity + 1)}
                        />
                    </div>
                    <div className="action-buttons">
                        <Button
                            className="add-to-bag-btn"
                            fullWidth
                            startIcon={<AddShoppingCartIcon />}
                            onClick={handleAddToBagBtnClick(selectedProduct.id)}
                        >
                            ADD TO BAG
                        </Button>
                        <Button
                            className="proceed-to-bag-btn"
                            variant="outlined"
                            size="large"
                            color="default"
                            fullWidth

                        >
                            PROCEED TO BAG
                        </Button>
                    </div>
                </Grid>
            </Grid>




            <div className={classes.root}>
                <div className={classes.reviewSection}>
                    <Typography variant="h5">Đánh Giá Sản Phẩm</Typography>

                    {/* Rating Overview */}
                    <div className={classes.ratingOverview}>
                        <Typography variant="h6">5 trên 5</Typography>
                        <div className={classes.ratingStars}>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon key={index} />
                            ))}
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className={classes.filterButtons}>
                        <Button
                            variant="contained"
                            onClick={() => handleRatingFilterClick(null)}
                            className={activeButton === null ? classes.activeButton : ''}
                        >
                            Tất Cả
                        </Button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <Button
                                key={star}
                                variant="outlined"
                                onClick={() => handleRatingFilterClick(star)}
                                className={activeButton === star ? classes.activeButton : ''} // Apply active class
                            >
                                {star} Sao ({reviews.filter(review => review.rating === star).length})
                            </Button>
                        ))}
                        <Button variant="outlined">Có Bình Luận</Button>
                        <Button variant="outlined">Có Hình Ảnh / Video</Button>
                    </div>

                    {/* Reviews List */}
                    {reviews
                        .filter(review => selectedRating === null || review.rating === selectedRating)
                        .map((review) => (
                            <div key={review.id} className={classes.reviewItem}>
                                {/* Reviewer Information */}
                                <div className={classes.reviewerInfo}>
                                    <Avatar>{review.reviewerName.charAt(0)}</Avatar>
                                    <Box ml={2}>
                                        <Typography variant="body1">{review.reviewerName}</Typography>
                                        <Typography variant="caption">{review.date} | Phân loại hàng: {review.classification}</Typography>
                                    </Box>
                                </div>

                                {/* Review Rating */}
                                <div className={classes.ratingStars} style={{ marginTop: '0.5rem' }}>
                                    {[...Array(5)].map((_, index) => (
                                        index < review.rating ? <StarIcon key={index} /> : <StarBorderIcon key={index} />
                                    ))}
                                </div>

                                {/* Review Details */}
                                <Typography className={classes.reviewText} variant="body2">
                                    <strong>Chất lượng sản phẩm:</strong> {review.productQuality}
                                </Typography>
                                <Typography className={classes.reviewText} variant="body2">
                                    <strong>Đúng với mô tả:</strong> {review.matchesDescription}
                                </Typography>
                                <Typography className={classes.reviewText} variant="body2">
                                    <strong>Tính năng nổi bật:</strong> {review.keyFeature}
                                </Typography>
                                <Typography className={classes.reviewText} variant="body2">
                                    {review.comments}
                                </Typography>

                                {/* Review Media */}
                                {review.media && (
                                    <div className={classes.reviewMedia}>
                                        {review.media.map((item, index) => (
                                            item.type === 'image' ? (
                                                <img src={item.url} alt={`review-media-${index}`} key={index} />
                                            ) : (
                                                <video key={index} controls style={{ width: '100px' }}>
                                                    <source src={item.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )
                                        ))}
                                    </div>
                                )}

                                {/* Seller Response */}
                                {review.sellerResponse && (
                                    <div className={classes.sellerResponse}>
                                        <Typography variant="body2">{review.sellerResponse}</Typography>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}

export default connect(null, { getDataViaAPI })(ProductDetails);