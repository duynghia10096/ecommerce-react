import { useEffect } from "react";

import {LOAD_SHOPPING_BAG_PRODUCTS} from "../actions/types";
import {useDispatch, useSelector} from "react-redux";
import _ from "lodash";
import {PRODUCT_BY_ID_DATA_API} from "../constants/api_routes";
import { useNavigate } from "react-router-dom";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useAddProductsToShoppingBag(getDataViaAPIFunc) {
    const navigate = useNavigate();
    const addToCart = useSelector(state => state.addToCartReducer)
    const dispatch = useDispatch()

    const extractIdsFromObject = object => {
        
        let idList = []
        for (const [id] of Object.entries(object)) {
            idList.push(parseInt(id))
        }
        return idList
    }

    useEffect(() => {
        
        let idList = []

        if (!_.isEmpty(addToCart.productQty)) {
            

            idList = extractIdsFromObject(addToCart["productQty"])

            if (idList.length > 0) {
                getDataViaAPIFunc(LOAD_SHOPPING_BAG_PRODUCTS, PRODUCT_BY_ID_DATA_API + idList.toString(), null, false,navigate)
                return
            }

        }

        dispatch({
            type: LOAD_SHOPPING_BAG_PRODUCTS,
            payload: {isLoading: false, data: {}}
        })

        

        // eslint-disable-next-line
    }, [addToCart])
}