import React from 'react';


export const AddTasksBtn = (props) => {
    const myProps = {...props};

    return (
        <div className="addCards">
            <div className="addSomeElement" onClick={(e) => myProps.showAndHideElem(e)}>
                <div className="overlap"></div>
                <img src={myProps.plus} alt="plus"></img>
                <p>Add a card</p>
            </div>
            <div className="inputFieldForTasks hideElem">
                <input type="text"
                    placeholder="Enter task name"
                    onChange={(e) => { myProps.changeTaskName(e.target.value) }}
                    onBlur={(blurEvent) => { myProps.showAndHideElem(blurEvent) }}
                    onKeyPress={(event) => { myProps.addCard(event) }}
                    value={myProps.taskName}></input>
                <button className="btnAddCard" onClick={(event) => myProps.addCard(event)}>Add card</button>
                <button className="btnCancelAddCard" onClick={(e) => myProps.showAndHideElem(e)}>X</button>
            </div>
        </div>
    )
}