import React, {useEffect, useState} from 'react';
import CheckboxList from "../../../ui/checkboxList";

import {useSelector} from "react-redux";
import CheckboxMoreButton from "./checkboxMoreButton";
import CheckboxSearchBar from "./checkboxSearchBar";
import {toggleId} from "../../../../helper/toggleId";

import {updateQueryString} from "../../../../helper/updateQueryString";
import { useLocation, useNavigate } from 'react-router-dom';

export default function BrandCheckBox() {
    const TITLE = "Brand"
    const propName = "brands"
    const brandList = useSelector(state => state.filterAttributesReducer.data ?
        state.filterAttributesReducer.data.brands : null)
    const [searchBrandList, setSearchBrandList] = useState(null)
    const selectedBrands = useSelector(state => state.selectedFilterAttributesReducer.brands)
    const [selectedList, setSelectedList] = useState([])
    const resetFilter = useSelector(state => state.clearFiltersReducer)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedBrands.length > 0) {
            setSelectedList(selectedBrands)
        } else {
            setSelectedList([])
        }
    }, [selectedBrands])

    useEffect(() => {
        if(resetFilter) {
            if(selectedList.length > 0) {
                setSelectedList([])
            }
        }

        // eslint-disable-next-line
    }, [location.search])

    // return if doesn't got anything from the server
    if (!brandList) {
       
        return null
    }

    /**
     * return the normal list or list based on search keyword
     * @returns {any}
     */
    const getActiveBrandList = () => {
       
        return searchBrandList ? searchBrandList : brandList
    }

    const handleSearchListChange = (searchList) => {
        setSearchBrandList(searchList)
    }

    const handleCheckBoxChange = (id, value) => {
       
        const {list, ids} = toggleId(id, value, selectedList)
        setSelectedList(list)
        navigate(updateQueryString(location, propName, id, ids))
    }

   

    return (
        <>
            <CheckboxSearchBar title={TITLE}
                               placeholderText="Search for Brands"
                               checkboxList={brandList}
                               searchListHandler={handleSearchListChange}/>
            <CheckboxList attrList={getActiveBrandList()}
                          title="Brand"
                          maxItems={6}
                          selectedAttrList={selectedList}
                          onChangeHandler={handleCheckBoxChange}/>
            <CheckboxMoreButton title={TITLE}
                                propName={propName}
                                checkboxList={brandList}
                                size={9}
                                selectedCheckboxList={selectedList}
                                checkboxChangeHandler={handleCheckBoxChange}/>
        </>
    );
}
