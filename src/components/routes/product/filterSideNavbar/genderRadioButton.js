import React, {useEffect, useState} from 'react';

import RadioButtonsGroup from "../../../ui/radioButtonGroup";
import {useSelector} from "react-redux";
import {Grid} from "@material-ui/core";
import {NavBarHeader} from "../../../ui/headers";
import { useLocation, useNavigate } from 'react-router-dom';


export default function GenderRadioButton() {
    const genderList = useSelector(state => state.filterAttributesReducer.data ?
        state.filterAttributesReducer.data.genders : null)
    const resetFilter = useSelector(state => state.clearFiltersReducer)
    const selectedGenders = useSelector(state => state.selectedFilterAttributesReducer.genders)
    const [selectedValue, setSelectedValue] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        if(selectedGenders.length > 0) {
            setSelectedValue(selectedGenders[0].value)
        } else {
            setSelectedValue(false)
        }
    }, [selectedGenders])

    useEffect(() => {
        if(resetFilter) {
            if(selectedValue !== false) {
                setSelectedValue(false)
            }
        }
        // eslint-disable-next-line
    }, [resetFilter])

    if (!genderList) {

        return null
    }

    const handleRadioButtonChange = value => {
       

        // compare first character only as all the options has unique first character
        for (let i = 0; i < genderList.length; i++) {
            if (value.charAt(0).localeCompare(genderList[i].value.charAt(0)) === 0) {
               
                setSelectedValue(value)
                let route = location.pathname
                let queryStr = location.search
                if(location.search.search("genders") === -1) {
                    navigate(`${route}${queryStr}::genders=${genderList[i].id}`)
                } else {
                    navigate(`${route}${queryStr.replace(/genders=[0-9]/gi, `genders=${genderList[i].id}`)}`)
                }
                return
            }
        }

        // scroll window to top after selection
        window.scrollTo(0, 80)
    }

   
    return (
        <>
            <Grid item style={{padding: "1rem 0"}}>
                <NavBarHeader title="Gender"/>
            </Grid>
            <Grid item style={{marginLeft: "0.5rem"}}>
                <RadioButtonsGroup onChangeHandler={handleRadioButtonChange}
                                   attrList={genderList.filter(obj => obj.id < 5)}
                                   selectedValue={selectedValue}
                                   title="Gender"/>
            </Grid>
        </>
    );
}
