import React from 'react';
import Swiper from 'react-id-swiper';

import {useSelector} from "react-redux";
import {BadRequest} from "../../ui/error/badRequest";

const VerticalSlider = () => {
    const homeAPIData = useSelector(state => state.homePageDataReducer)
    
    const params = {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    }

    const renderImageList = (imageList) => {

        if(!imageList) {
           
            
            return <BadRequest/>
        }

        // filter out images which are not for carousels.
        imageList = imageList.filter(image => image.imageLocalPath.search("icon") === -1)

       
        return imageList.map(({id, imageLocalPath, imageURL}) => {
           
            return (
                <img key={id} src={imageURL} alt={imageLocalPath}/>
            )
        });
    };

   
    return (
        <Swiper {...params}>
            {renderImageList(homeAPIData.data.carousels)}
        </Swiper>
    )
};
export default VerticalSlider;