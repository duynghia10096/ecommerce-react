import React from 'react';

import Grid from '@material-ui/core/Grid';
import FilterNavBar from "./filterSideNavbar/filterNavBar";
import FilterProductsDisplay from "./filterProductDisplay";
import log from 'loglevel';
import FilterChips from "./filterChips";
import {Divider} from "@material-ui/core";
import FilterDropdown from "./filterDropdown";
import FilterPagination from "./filterPagination";
import Hidden from "@material-ui/core/Hidden";
// import BottomNavBar from "./bottomNavBar";

import BreadcrumbsSection from "../../ui/breadcrumbs";
import {HOME_ROUTE} from "../../../constants/react_routes";
import {DocumentTitle} from "../../ui/documentTitle";
import {PRODUCT_BY_CATEGORY_DATA_API} from "../../../constants/api_routes";
import {MAX_PRODUCTS_PER_PAGE} from "../../../constants/constants";
import { useLocation, useNavigate } from 'react-router-dom';

export const stickyBoxStyle = {
    position: 'sticky',
    top: 80,
    backgroundColor: '#fafafa',
    zIndex: 1040,
    paddingLeft: "1rem"
}

function Product() {
    const location = useLocation();
    const navigate = useNavigate();
    // define breadcrumbs
    const breadcrumbLinks = [
        {
            name: 'Home',
            link: HOME_ROUTE
        },
        {
            name: 'Products',
            link: `${location.pathname + location.search}`
        },
    ]

    // if we got unexpected uri then just send bad request component.
    if (location.pathname.localeCompare('/products') !== 0
        || !location.search.startsWith('?q=')) {
        return navigate(PRODUCT_BY_CATEGORY_DATA_API + "?q=page=0," + MAX_PRODUCTS_PER_PAGE)
    }

   
    return (
        <Grid container>
            <DocumentTitle title="Shoppers Products"/>
            <Grid item md={3} lg={2}>
                <FilterNavBar linkList={breadcrumbLinks}/>
            </Grid>

            <Grid item md={9} lg={10}>
                <Grid item style={{padding: "1rem", backgroundColor: '#fafafa'}}>
                    <BreadcrumbsSection linkList={breadcrumbLinks}/>
                </Grid>

                <Hidden xsDown>
                    <Grid item container alignItems="center" style={stickyBoxStyle}>
                        <Grid item sm={8}>
                            <FilterChips/>
                        </Grid>
                        <Grid item container justify="flex-end" sm={4} style={{padding: "0 2.5rem 0.5rem 0"}}>
                            <FilterDropdown/>
                        </Grid>
                    </Grid>
                </Hidden>
                <Divider/>
                <FilterProductsDisplay linkList={breadcrumbLinks}/>
                <Divider/>
                <FilterPagination/>
            </Grid>
        </Grid>
    );
}

export default Product;