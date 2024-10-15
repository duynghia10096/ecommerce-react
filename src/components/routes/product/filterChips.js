import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import Chip from "@material-ui/core/Chip";
import Box from '@material-ui/core/Box';
import log from "loglevel";
import {ADD_SELECTED_CATEGORY} from "../../../actions/types";

import {PRODUCT_BY_CATEGORY_DATA_API} from "../../../constants/api_routes";
import {toggleId} from "../../../helper/toggleId";
import {updateQueryString} from "../../../helper/updateQueryString";
import { useLocation, useNavigate } from 'react-router-dom';

const FilterChips = () => {
    const selectedGenders = useSelector(state => state.selectedFilterAttributesReducer.genders)
    const selectedApparels = useSelector(state => state.selectedFilterAttributesReducer.apparels)
    const selectedBrands = useSelector(state => state.selectedFilterAttributesReducer.brands)
    const selectedPriceRanges = useSelector(state => state.selectedFilterAttributesReducer.prices)
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // check if any filter is selected or not
    if ((selectedGenders.length + selectedApparels.length
        + selectedBrands.length + selectedPriceRanges.length) === 0) {
        log.debug(`[FilterChips] Filter are empty`)
        return null
    }

    /**
     * construct the chip from selected filter option and assign Id.
     *
     * @param selectedAttrList
     * @param categoryId
     * @returns {[]}
     */
    const addChips = (selectedAttrList, categoryId) => {
        let chipBoxList = []
        

        selectedAttrList.forEach(({id,value}) => {
            
            chipBoxList.push(
                <Box key={`${categoryId}-${id}`} width="auto" display="inline-block" p={0.2}>
                    <Chip label={value}
                          color="primary"
                          onDelete={handleDelete(`${categoryId}-${id}`)}/>
                </Box>
            )
        })

        return chipBoxList
    }

    /**
     * Prepare chip list and render it.
     * @returns {null|[]}
     */
    const renderChipBoxes = () => {
        log.debug(`[FilterChips] renderChipBoxes is invoked`)

        let chipBoxList = []
        if (selectedGenders.length > 0) {
            chipBoxList = chipBoxList.concat(addChips(selectedGenders, "ge"))
        }
        if (selectedApparels.length > 0) {
            chipBoxList = chipBoxList.concat(addChips(selectedApparels, "ap"))
        }
        if (selectedBrands.length > 0) {
            chipBoxList = chipBoxList.concat(addChips(selectedBrands, "br"))
        }
        if (selectedPriceRanges.length > 0) {
            chipBoxList = chipBoxList.concat(addChips(selectedPriceRanges, "pr"))
        }

        if (chipBoxList) {
            
            return chipBoxList
        }

        
        return null
    }

    /**
     * Dispatch the chip from selected option list
     *
     * @param id
     * @param selectedAttrList
     * @param attributeName
     */
    const findValueAndDispatch = (id, selectedAttrList, attributeName) => {
        

        for (let i = 0; i < selectedAttrList.length; i++) {
            if(selectedAttrList[i].id === parseInt(id)) {
                log.info(`[FilterChips] id = ${id} dispatch`)
                dispatch({
                    type: ADD_SELECTED_CATEGORY,
                    payload: {
                        [attributeName]: {
                            id: selectedAttrList[i].id,
                            value: selectedAttrList[i].value
                        },
                        newQuery: null
                    }
                })

                const {ids} = toggleId(selectedAttrList[i].id, selectedAttrList[i].value, selectedAttrList)
                let queryString = updateQueryString(location, attributeName, selectedAttrList[i].id, ids)

                let URL = ""
                if(!queryString.startsWith(PRODUCT_BY_CATEGORY_DATA_API)) {
                    URL += PRODUCT_BY_CATEGORY_DATA_API
                }

                if(!queryString.startsWith(`?q=`)) {
                    URL += `?q=`
                }

                if(URL !== "") {
                    navigate(URL + queryString)
                } else {
                    navigate(queryString)
                }


                return
            }
        }
    }

    /**
     * Delete the chip
     * @param id
     * @returns {function(...[*]=)}
     */
    const handleDelete = id => () => {
        log.info(`[FilterChips] handleDelete for chip for id = ${id}`)
        const splitId = id.split("-")

        if(selectedGenders.length > 0 && splitId[0].localeCompare("ge") === 0) {
            findValueAndDispatch(splitId[1], selectedGenders, "genders")
        }
        if(selectedApparels.length > 0 && splitId[0].localeCompare("ap") === 0) {
            findValueAndDispatch(splitId[1], selectedApparels, "apparels")
        }
        if(selectedBrands.length > 0 && splitId[0].localeCompare("br") === 0) {
            findValueAndDispatch(splitId[1], selectedBrands, "brands")
        }
        if(selectedPriceRanges.length > 0 && splitId[0].localeCompare("pr") === 0) {
            findValueAndDispatch(splitId[1], selectedPriceRanges, "prices")
        }
    }

    
    return (
        <>
            {renderChipBoxes()}
        </>
    )
};
export default FilterChips;