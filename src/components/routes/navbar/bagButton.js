import React from 'react';

import LocalMallIcon from "@material-ui/icons/LocalMall";
import {Badge} from "@material-ui/core";
import {useSelector} from "react-redux";

export default function BagButton() {
    const addToCart = useSelector(state => state.addToCartReducer)

    
    return (
        <Badge badgeContent={addToCart.totalQuantity}
               color="secondary">
            <LocalMallIcon style={{color: "black"}}/>
        </Badge>
    );
};
