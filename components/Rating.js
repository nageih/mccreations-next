'use client'

import { postRating } from "app/getData";
import { getCookie, setCookie } from "app/setCookies";
import { useState, useEffect } from "react";

export default function Rating(props) {
    const [value, setValue] = useState(props.value);
    let contentId = props.contentId;

    console.log(value)

    const sendRating = async (value) => {
        if(!getCookie("RATED_" + contentId)) {
            let newRating = await postRating(contentId, value);
            setCookie("RATED_" + contentId, true)
            setValue(newRating)
        }
    }

    let ratingHover = (event) => {
        let value = Math.floor(((event.pageX - event.currentTarget.offsetLeft) / 12.0) + 2)
        value = (Math.floor(value/2))/5
        setValue(value)
    }

    return (
        <div>
            <ul className="rating" onMouseMove={(e) => {ratingHover(e)}} onMouseLeave={() => {setValue(props.value)}}>
                <li className="currentRating" style={{width: value*100 + '%'}}></li>
                <li><a id="one" href="#" title="1 out of 5 stars" onClick={() => {sendRating(0.2)}}></a></li>
                <li><a id="two" href="#" title="2 out of 5 stars" onClick={() => {sendRating(0.4)}}></a></li>
                <li><a id="three" href="#" title="3 out of 5 stars" onClick={() => {sendRating(0.6)}}></a></li>
                <li><a id="four" href="#" title="4 out of 5 stars" onClick={() => {sendRating(0.8)}}></a></li>
                <li><a id="five" href="#" title="5 out of 5 stars" onClick={() => {sendRating(1)}}></a></li>
            </ul>
        </div>
    )
}