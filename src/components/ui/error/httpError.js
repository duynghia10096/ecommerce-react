import React from 'react';
import {BAD_REQUEST_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE} from "../../../constants/http_error_codes";
import {InternalServerError} from "./internalServerError";
import {BadRequest} from "./badRequest";


export const HTTPError = props => {
   
    switch (props.statusCode) {
        case INTERNAL_SERVER_ERROR_CODE:
            return <InternalServerError/>
        case BAD_REQUEST_ERROR_CODE:
            return <BadRequest/>
        default:
            return null
    }
};