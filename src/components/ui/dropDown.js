import React from 'react'
import {Menu} from 'semantic-ui-react'
import {
    StyledLargeDropdown,
    StyledSmallDropdown,
    StyledSmallMenu
} from "../../styles/semanticUI/customStyles";
import "../../styles/semanticUI/commonStyles.css"


const DropdownSection = props => {

    if (!props.attrList) {
       
        return null
    }

    let optionList = props.attrList.map(({id, type}) => {
       
        return {
            key: id,
            text: type,
            value: id
        }
    })

    const handleDropdownChange = (e, {id, value}) => {
       
        props.onChangeHandler(value, optionList[value - 1].text, id.split("-")[0])
    }

    const renderLargeDropdown = () => {
        return (
            <Menu compact>
                <StyledLargeDropdown options={optionList}
                                     simple item
                                     id={`${props.title}-dropdown`}
                                     text={`${props.appendText} ${props.selectedValue.value ? props.selectedValue.value
                                         : optionList ? optionList[0].text : null}`}
                                     onChange={handleDropdownChange}
                                     value={props.selectedValue.id}/>

            </Menu>
        )
    }

    const renderSmallDropdown = () => {
        return (
            <StyledSmallMenu compact>
                <StyledSmallDropdown options={optionList}
                                     simple item
                                     id={`${props.title}-dropdown`}
                                     text={`${props.appendText} ${props.selectedValue.value ? props.selectedValue.value
                                         : optionList ? optionList[0].text : null}`}
                                     onChange={handleDropdownChange}
                                     value={props.selectedValue.id}/>
            </StyledSmallMenu>
        )
    }

   
    return (
        <>
            {props.size && props.size.localeCompare("sm") === 0? renderSmallDropdown(): renderLargeDropdown()}
        </>
    )
}

export default DropdownSection