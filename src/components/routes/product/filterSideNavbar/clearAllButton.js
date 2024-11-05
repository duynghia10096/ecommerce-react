import React from 'react';

import {useDispatch, useSelector} from "react-redux";
import {CLEAR_ALL_FILTERS, RESET_SELECTED_CATEGORY} from "../../../../actions/types";
import { useLocation, useNavigate } from 'react-router-dom';


function ClearAllButton() {
    const dispatch = useDispatch()
    const selectedFilterAttribute = useSelector(state => state.selectedFilterAttributesReducer)
    const navigate = useNavigate();
    const location = useLocation();
    // check if any filter is selected or not
    if ((selectedFilterAttribute.genders.length + selectedFilterAttribute.apparels.length
        + selectedFilterAttribute.brands.length + selectedFilterAttribute.prices.length) === 0) {
      
        return null
    }

    /**
     * remove all selected filters
     */
    const handleClearAllClick = () => {
        
        dispatch({
            type: RESET_SELECTED_CATEGORY
        })
        dispatch({
            type: CLEAR_ALL_FILTERS,
            payload: true
        })
        navigate(location.pathname + "?q=page=0,16")
    }

   

    return (
        <>
            <div onClick={handleClearAllClick} style={{
                fontWeight: "bold", cursor: 'pointer',
                fontSize: '0.9rem', height: 'inherit', color: 'red'
            }}>CLEAR ALL
            </div>
        </>
    );
}

export default ClearAllButton;