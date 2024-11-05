import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    label: {
        fontWeight: "bold",
        fontSize: "0.9rem"
    }
}));

export default function RadioButtonsGroup(props) {
    const classes = useStyles()

    const handleChange = (event) => {
       
        props.onChangeHandler(event.target.value)
    };

    const renderRadioButtonList = rbList => {

        if (!rbList) {
          
            return null
        }

        

        return rbList.map(({id, value}) => {
            return <FormControlLabel key={id}
                                     value={value}
                                     control={<Radio size="small"/>}
                                     label={value}
                                    classes={{label: classes.label}}/>
        })
    }

   
    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label={props.title} name={props.title}
                        value={props.selectedValue? props.selectedValue: false}
                        onChange={handleChange}>
                {renderRadioButtonList(props.attrList)}
            </RadioGroup>
        </FormControl>
    );
}
