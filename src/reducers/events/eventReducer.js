import {HANDLE_TAB_HOVER_EVENT} from "../../actions/types";


export const tabHoverEventReducer = (state
                                         = {index: false, hover: false, tabColor: "black"}, action) => {
    switch (action.type) {
        case HANDLE_TAB_HOVER_EVENT:
          
            return action.payload;

        default:
            return state;
    }
};