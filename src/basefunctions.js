
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

export function determineListNumber (event) {
    let elem = event.target.parentElement.parentElement.parentElement.classList[2];
    let elemKey = elem.substring(11, elem.length);
    return elemKey
}

