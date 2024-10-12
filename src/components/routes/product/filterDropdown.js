import React, {useEffect, useState} from 'react';
import log from 'loglevel';
import {useSelector} from "react-redux";
import DropdownSection from "../../ui/dropDown";
import {SORT_ATTRIBUTE} from "../../../constants/constants";
import { useLocation, useNavigate } from 'react-router-dom';


export default function FilterDropdown() {
    const sortList = useSelector(state => state.filterAttributesReducer.data ?
        state.filterAttributesReducer.data[SORT_ATTRIBUTE] : null)
    const selectedSort = useSelector(state => state.selectSortReducer)
    const [sortValue, setSortValue] = useState({id:1, value: ""})
    const location = useLocation();    
    const navigate = useNavigate();
    useEffect(() => {
        if (selectedSort != null) {
            setSortValue(selectedSort)
        }
    }, [selectedSort])

    if (!sortList) {
        return null
    }

    const onChangeHandler = (id, value) => {
        log.info(`[FilterDropdown] onChangeHandler id = ${id}, value = ${value}`)
        setSortValue({id, value})
        let route = location.pathname
        let queryStr = location.search
        if (location.search.search("sortby") === -1) {
            navigate(`${route}${queryStr}::sortby=${id}`)
        } else {
            navigate(`${route}${queryStr.replace(new RegExp(`sortby=[0-9]`), `sortby=${id}`)}`)
        }
    }

    log.info(`[FilterDropdown] Rendering FilterDropdown Component`)

    return (
        <DropdownSection
            attrList={sortList}
            selectedValue={sortValue}
            appendText="Sort by:"
            title="sortby"
            size="lg"
            onChangeHandler={onChangeHandler}/>
    );
}
