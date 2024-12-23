import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import useTabStyles from "../../../styles/materialUI/tabStyles";
import {useDispatch, useSelector} from 'react-redux';
import {HANDLE_TAB_HOVER_EVENT} from "../../../actions/types";

import {TAB_CONFIG} from "../../../constants/constants";

export default function TabList() {
    const classes = useTabStyles();
    const dispatch = useDispatch();
    let {index} = useSelector(state => state.tabHoverEventReducer);

    const handleMouseEnter = (event) => {
       

        // check if index is number
        let index = parseInt(event.target.id.split('-')[2])
        if (isNaN(index)) {
            return
        }
        dispatch({
            type: HANDLE_TAB_HOVER_EVENT,
            payload: {
                index: index,
                hover: true,
            }
        });
    }

    const mouseLeaveHandler = event => {
      
        // detect the mouse is going out horizontally and vertically upwards.
        if(event.pageX < 230 || event.pageX > 795 || (event.pageY - window.scrollY) < 1) {
            dispatch({
                type: HANDLE_TAB_HOVER_EVENT, payload: {
                    index: false,
                    hover: false
                }
            })
        }
    }

    const renderTabs = () => {

      
        return TAB_CONFIG.map(({index, label}) => {
            return (
                    <Tab label={label}
                         key={index}
                         onMouseEnter={handleMouseEnter} onMouseLeave={mouseLeaveHandler}
                         classes={{wrapper: classes.tabsWrapper, root: classes.tabRoot}}
                         id={`simple-tab-${index}`}
                         aria-controls={`simple-tabpanel-${index}`}/>
            )
        })
    }

    // Sometimes a race condition occurs which spits out the index as NAN
    // So reset the value of index to default
    if (isNaN(index)) {
      
        index = false;
    }

   
    return (
        <Tabs value={index}
              aria-label="simple-tabs"
              TabIndicatorProps={{
                  style: {
                      backgroundColor: index === false ? 'none' : TAB_CONFIG[index].color,
                      height: '4px',
                  }
              }}>
            {renderTabs(index)}
        </Tabs>
    );
};
