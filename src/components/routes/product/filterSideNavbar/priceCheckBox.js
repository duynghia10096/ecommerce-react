import React, {useEffect, useState} from 'react';
import CheckboxList from "../../../ui/checkboxList";

import {useSelector} from "react-redux";
import {NavBarHeader} from "../../../ui/headers";
import {Box} from "@material-ui/core";

import {toggleId} from "../../../../helper/toggleId";
import {updateQueryString} from "../../../../helper/updateQueryString";
import { useLocation, useNavigate } from 'react-router-dom';

export default function PriceCheckBox() {
    const TITLE = "Price"
    const priceRangeList = useSelector(state => state.filterAttributesReducer.data ?
        state.filterAttributesReducer.data.prices : null)
    const selectedPriceRanges = useSelector(state => state.selectedFilterAttributesReducer.prices)
    const [selectedList, setSelectedList] = useState([])
    const resetFilter = useSelector(state => state.clearFiltersReducer)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedPriceRanges.length > 0) {
            setSelectedList(selectedPriceRanges)
        } else {
            setSelectedList([])
        }
    }, [selectedPriceRanges])

    useEffect(() => {
        if(resetFilter) {
            if(selectedList.length > 0) {
                setSelectedList([])
            }
        }

        // eslint-disable-next-line
    }, [location.search])

    if (!priceRangeList) {
        
        return null
    }

    /**
     * select and dispatch the selected option
     * @param id
     * @param value
     */
    const handleCheckBoxChange = (id, value) => {
     
        const {list, ids} = toggleId(id, value, selectedList)
        setSelectedList(list)
        navigate(updateQueryString(location, "prices", id, ids))
    }

    

    return (
        <Box pb={2}>
            <Box pt={2.5} pb={1}>
                <NavBarHeader title="Price"/>
            </Box>
            <CheckboxList attrList={priceRangeList}
                          fontSize="0.9rem"
                          title={TITLE}
                          selectedAttrList={selectedList}
                          onChangeHandler={handleCheckBoxChange}/>
        </Box>
    );
}
