import React, {useEffect, useState} from 'react';
import CheckboxList from "../../../ui/checkboxList";

import {useSelector} from "react-redux";
import CheckboxMoreButton from "./checkboxMoreButton";
import CheckboxSearchBar from "./checkboxSearchBar";
import {toggleId} from "../../../../helper/toggleId";

import {updateQueryString} from "../../../../helper/updateQueryString";
import { useLocation, useNavigate } from 'react-router-dom';

export default function ApparelCheckBox() {
    const TITLE = "Apparel"
    const propName = "apparels"
    const apparelList = useSelector(state => state.filterAttributesReducer.data ?
        state.filterAttributesReducer.data.apparels : null)
    const [searchApparelList, setSearchApparelList] = useState(null)
    const selectedApparels = useSelector(state => state.selectedFilterAttributesReducer.apparels)
    const [selectedList, setSelectedList] = useState([])
    const resetFilter = useSelector(state => state.clearFiltersReducer)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedApparels.length > 0) {
            setSelectedList(selectedApparels)
        } else {
            setSelectedList([])
        }
    }, [selectedApparels])

    useEffect(() => {
        if (resetFilter) {
            if (selectedList.length > 0) {
                setSelectedList([])
            }
        }

        // eslint-disable-next-line
    }, [location.search])

    // return if doesn't got anything from the server
    if (!apparelList) {
       
        return null
    }

    /**
     * return the normal list or list based on search keyword
     * @returns {any}
     */
    const getActiveApparelList = () => {
        return searchApparelList ? searchApparelList : apparelList
    }

    const handleSearchListChange = (searchList) => {
        setSearchApparelList(searchList)
    }

    const handleCheckBoxChange = (id, value) => {
       
        const {list, ids} = toggleId(id, value, selectedList)
        setSelectedList(list)
        navigate(updateQueryString(location, propName, id, ids))
    }

    

    return (
        <>
            <CheckboxSearchBar title={TITLE}
                               placeholderText="Search for Apparels"
                               checkboxList={apparelList}
                               searchListHandler={handleSearchListChange}/>
            <CheckboxList attrList={getActiveApparelList()}
                          title={TITLE}
                          maxItems={6}
                          selectedAttrList={selectedList}
                          onChangeHandler={handleCheckBoxChange}/>
            <CheckboxMoreButton title={TITLE}
                                checkboxList={apparelList}
                                propName={propName}
                                size={6}
                                selectedCheckboxList={selectedList}
                                checkboxChangeHandler={handleCheckBoxChange}/>

        </>
    );
}
