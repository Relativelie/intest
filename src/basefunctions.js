import { useState } from "react";

// functions for rename lists, project, tasks
export function showInputName(e) {
    e.target.select();
    let inputElem = e.target;
    inputElem.classList.toggle("showNameInput");
}

export function hideInputName(e) {
    let inputElem = e.target;
    inputElem.classList.toggle("showNameInput");
}

export function determineListNumber(event, props) {
    let elem;
    let elemKey;
    if (props.elementName === "task") {
        elem = event.target.parentElement.parentElement.parentElement.classList[0];
        elemKey = elem.substring(8, elem.length);
    }
    else {
        elem = event.target.parentElement.parentElement.parentElement.classList[2];
        elemKey = elem.substring(11, elem.length);
    }
    return elemKey
}





