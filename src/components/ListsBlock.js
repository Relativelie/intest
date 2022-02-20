import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import plus from '../images/plus.png';
import { hideInputName, showInputName, determineListNumber } from "./basefunctions";
import { AddTasksBtn } from "./AddTasksBtn";
import { Tasks } from "./Tasks";



export const ListsBlock = () => {

    const [lists, setLists] = useState([]);
    const [listNumber, setListNumber] = useState(0);
    const [taskName, setTaskName] = useState("");
    const [previousName, setPreviousName] = useState("");


    // add new block of a list
    const addNewList = () => {
        let list = listNumber;
        let allLists = [...lists];
        if (list !== 8) {
            allLists[list] = ["Rename the list", []];
            setLists(allLists);
            setListNumber(listNumber + 1);
        }
        else alert("Only 8 lists can be created")
    }

    // add a new task in the list
    const addCard = (event) => {
        if (event.key === "Enter" || event.type === "click") {
            let elemKey = determineListNumber(event, { elementName: "addTask" });
            let allLists = [...lists];
            if (taskName !== "") {
                allLists[elemKey][1].push(taskName);
                setTaskName("");
                setLists(allLists);
            }
        }
    }

    const changeTaskName = (event) => {
        setTaskName(event)
    }

    // show input in block of adding task 
    const showAndHideElem = (e) => {
        const hiddenElem = e.target;

        if (hiddenElem.className === "overlap") {
            hiddenElem.parentElement.classList.add("hideElem");
            hiddenElem.parentElement.parentElement.children[1].classList.remove("hideElem");
            hiddenElem.parentElement.parentElement.children[1].children[0].focus();
        }

        else if (e.relatedTarget === null || e.relatedTarget.className !== "btnAddCard") {
            hiddenElem.parentElement.classList.add("hideElem");
            hiddenElem.parentElement.parentElement.children[0].classList.remove("hideElem");
            setTaskName("");
        }

        else if (e.relatedTarget.className === "btnAddCard") {
            hiddenElem.parentElement.parentElement.children[1].children[0].focus();
        }
    }

    // change task or list name
    const changeElemName = (event, elem) => {

        let elemKey = determineListNumber(event, { elementName: elem });
        let allLists = [...lists];
        if (elem === "list") {
            allLists[elemKey][0] = event.target.value;
        }

        else if (elem === "task") {
            allLists[elemKey[1]][1][elemKey[0]] = event.target.value;
        }

        setTaskName("");
        setLists(allLists);
    }

    const hideNameEditingAndAssertForEmpty = (event, elem) => {
        hideInputName(event);
        if (event.target.defaultValue === "" && (event.key === "Enter" || event.type === "blur")) {
            let elemKey = determineListNumber(event, { elementName: elem });
            let allLists = [...lists];
            if (elem === "list") {
                allLists[elemKey][0] = previousName;
            }

            else if (elem === "task") {
                allLists[elemKey[1]][1][elemKey[0]] = previousName;
            }

            setPreviousName("")
        }
    }


    // keep previous value for using in hideNameEditingAndAssertForEmpty() in case name is empty
    const showNameEditingAndKeepPreviousValue = (event) => {
        showInputName(event);
        if (event.type === "focus") {
            setPreviousName(event.target.defaultValue)
        }

        else if (event.type === "click") {
            setPreviousName(event.target.parentElement.children[0].innerText)
        }
    }


    const nameOfElements = ({ blockName, parText, inputClass, onFocusFunc, elementName, inputValue }) => {

        return (
            <div className={blockName}>

                <div className="namePar">
                    <p>{parText}</p>
                </div>

                <div className="nameInput">
                    <input className={inputClass} type="text"
                        maxLength="17"
                        onFocus={onFocusFunc}
                        onBlur={(blurEvent) => { hideNameEditingAndAssertForEmpty(blurEvent, elementName) }}
                        onChange={(e) => { changeElemName(e, elementName) }}
                        onKeyPress={(blurEvent) => { hideNameEditingAndAssertForEmpty(blurEvent, elementName) }}
                        value={inputValue}></input>
                </div>
            </div>
        )
    }

    // show block where task may be moved
    const handleOnDragStart = (result) => {
        if (result.source.droppableId !== "lists") {
            let allListsKeys = Object.keys(lists);
            let droppableFromList = result.source.droppableId;
            droppableFromList = droppableFromList.substring(5, droppableFromList.length);
            allListsKeys.splice(allListsKeys.indexOf(droppableFromList), 1);
            for (let item = 0; item < allListsKeys.length; item++) {
                document.querySelector(`[data-rbd-droppable-id="tasks${allListsKeys[item]}"]`).classList.add("availableDrop");
            }
        }
    }


    const handleOnDragEnd = (result) => {
        let allListsKeys = Object.keys(lists);
        for (let item = 0; item < allListsKeys.length; item++) {
            document.querySelector(`[data-rbd-droppable-id="tasks${allListsKeys[item]}"]`).classList.remove("availableDrop")
        }

        // drop lists
        if (result.type === "group") {
            if (!result.destination) return;
            const listOfItems = lists;
            const items = Array.from(listOfItems);
            const [recordedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, recordedItem)

            setLists(items)
        }
        // drop tasks
        else if (result.type === "tasks") {
            let allLists = lists;
            if (!result.destination) return;

            // the index of the list where the element is moved to
            let destinationDrop = result.destination.droppableId;
            destinationDrop = destinationDrop.substring(5, destinationDrop.length);

            // the index of the task where the element is moved to(inside the list)
            let destinationDrag = calculateTaskIndex(result.destination.index, destinationDrop);

            // the index of the list where the elem is moved from
            let dropFrom = result.source.droppableId;
            dropFrom = dropFrom.substring(5, dropFrom.length);

            // the index of the task where the element is moved from(inside the list)
            let dragFrom = calculateTaskIndex(result.source.index, dropFrom);

            let dragItemText = allLists[dropFrom][1][dragFrom];
            allLists[dropFrom][1].splice(dragFrom, 1);
            allLists[destinationDrop][1].splice(destinationDrag, 0, dragItemText);

            setLists(allLists)
        }
    }

    const assignTaskIndexForDrag = (listNumber, key) => {
        let allLists = [...lists];
        let numberOfTask = 0;
        if (!allLists[listNumber - 1]) return parseInt(key);
        else {
            while (listNumber != 0) {
                numberOfTask += parseInt(allLists[listNumber - 1][1].length);
                listNumber--;
            }
            return (parseInt(numberOfTask + parseInt(key)))
        }
    }

    const calculateTaskIndex = (index, listKey) => {
        let allLists = [...lists];
        let currentListKey = 0;

        while (currentListKey != parseInt(listKey)) {
            index -= allLists[currentListKey][1].length;
            currentListKey++;
        }
        return index
    }


    return (<div className="lists">

        <div className="addNewListContainer">
            <div className="addNewList addSomeElement list"
                onClick={() => addNewList()}>
                <img src={plus} alt="plus" ></img>
                <p>Add another list</p>
            </div>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>

            <Droppable droppableId="lists" direction="horizontal" type="group">
                {(provided) => (
                    <div className="createdListsContainer" {...provided.droppableProps} ref={provided.innerRef}>
                        {Object.keys(lists).map((key, index) => (
                            <Draggable type="group" key={key} draggableId={`list${key}`} index={index}>
                                {(provided) => (
                                    <div className={`createdList list createdList${key}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                        {nameOfElements({
                                            blockName: "listName",
                                            elementName: "list",
                                            parText: lists[key][0],
                                            inputValue: lists[key][0],
                                            inputClass: null,
                                            onFocusFunc: (event) => { showNameEditingAndKeepPreviousValue(event) }
                                        })}
                                        <div>
                                            <Tasks listKey={key}
                                                allLists={lists}
                                                assignTaskIndexForDrag={assignTaskIndexForDrag}
                                                nameOfElements={nameOfElements}
                                                showAndKeepValue={showNameEditingAndKeepPreviousValue} />
                                        </div>
                                        <AddTasksBtn plus={plus} showAndHideElem={showAndHideElem}
                                            changeTaskName={changeTaskName} addCard={addCard}
                                            taskName={taskName}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </div>
    )
}