import { React, useEffect } from 'react'

export default function Video() {

    useEffect(() => {
        var video = document.querySelector("#video");

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log("Something went wrong!");
                });
        }
    })

    return (
        <video autoPlay={true} id="video">

        </video>
    )
}



