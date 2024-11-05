import React from 'react'

import {Grid} from "@material-ui/core";

export const GenericErrorMsg = () => {

   
    return (
        <Grid container justify="center" style={{paddingTop: "2rem", fontSize: "3rem"}}>
            <p>Oops! Something went wrong....</p>
        </Grid>
    )
}