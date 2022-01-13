
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


