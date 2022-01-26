import { useState } from "react";

// functions for rename lists, project, tasks
export function showInputName(e) {
    if (e.type === "click") {
        let inputElem = e.target.parentElement.children[0].children[1].children[0];
        inputElem.select();
        inputElem.classList.toggle("showNameInput");
        inputElem.parentElement.classList.toggle("showNameInput");
    }
    else {
        e.target.select();
        let inputElem = e.target;
        inputElem.classList.toggle("showNameInput");
    }

}

export function hideInputName(e) {
    if (e.type === "blur" || e.key === "Enter") {
        let inputElem = e.target;
        inputElem.classList.remove("showNameInput");
        inputElem.parentElement.classList.remove("showNameInput");
        inputElem.blur()
    }
}

export function determineListNumber(event, props) {
    let elem;
    let elemKey;
    let tasksElem = [];
    if (props.elementName === "task") {
        elem = event.target.parentElement.parentElement.parentElement.parentElement.classList[0];
        elemKey = elem.substring(8, elem.length);
        tasksElem.push(elemKey);
        elem = event.nativeEvent.path[7].classList[2];
        elemKey = elem.substring(11, elem.length);
        tasksElem.push(elemKey);
        return tasksElem
    }
    else {
        elem = event.target.parentElement.parentElement.parentElement.classList[2];
        elemKey = elem.substring(11, elem.length);
        return elemKey
    }

}





