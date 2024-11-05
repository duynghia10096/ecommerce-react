import React from 'react';
import {Dimmer, Loader} from "semantic-ui-react";


export default function BackgroundDisabledSpinner() {
    
    return (
        <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
        </Dimmer>
    );
}
