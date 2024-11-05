import React from 'react';
import {Grid} from "@material-ui/core";
import {Link} from "react-router-dom";

import {MAX_PRODUCTS_PER_PAGE} from "../../../constants/constants";
import {useSelector} from "react-redux";

const queryType = {
    brand: 1,
    apparel: 2
}

const TopCategoriesAndBrands = () => {
    const homeAPIData = useSelector(state => state.homePageDataReducer)

    const renderImageList = (imageList, filterQueryType) => {

        return imageList.map(info => {

            let filterQuery = null

            // prepare query parameters
            switch (filterQueryType) {
                case queryType.brand:
                    filterQuery = info.brandInfo ? `brands=${info.brandInfo.id}` : null
                    break
                case queryType.apparel:
                    if (info.apparelInfo && info.genderInfo) {
                        filterQuery = `apparels=${info.apparelInfo.id}::genders=${info.genderInfo.id}`
                    }
                    break
                default:
                   
                    return null
            }

            
            return (
                <Grid item xs={6} sm={2} key={info.title} style={{textAlign: "center"}}>
                    <Link to={`/products?q=${filterQuery}::page=0,${MAX_PRODUCTS_PER_PAGE}`}>
                        <img src={info.imageURL} alt={info.imageLocalPath} style={{width: '80%', height: '100%'}}
                             title={info.title}/>
                    </Link>
                </Grid>
            )
        });
    };

    const renderCategoryAndBrandsList = (title, dataList, queryType) => {
        return (
            <>
                <Grid container style={{fontWeight: "bold",
                    fontSize: "2rem", padding: "2rem 0 0 1rem", textDecoration: "underline"}}>
                    {title}
                </Grid>
                <Grid container style={{padding: '2rem 0'}}>
                    {renderImageList(dataList, queryType)}
                </Grid>
            </>
        )
    }

  

    return (
        <>
            {renderCategoryAndBrandsList("#Shop Top Brands", homeAPIData.data.brands, queryType.brand)}
            {renderCategoryAndBrandsList("#Shop Top Categories", homeAPIData.data.apparels, queryType.apparel)}
        </>
    )
};
export default TopCategoriesAndBrands;