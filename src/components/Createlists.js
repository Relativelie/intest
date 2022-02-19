import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import plus from '../images/plus.png';
import create from '../images/create.png'
import { hideInputName, showInputName, determineListNumber } from "./basefunctions";
import { AddTasks } from "./AddTasks";


const tasksBlockBg = (isDraggingOver) => (
    { background: isDraggingOver ? 'rgba(91, 201, 173, 0.685)' : 'none', }
);


export class CreateLists extends Component {
    constructor() {
        super();

        this.state = {
            lists: [],
            listNumber: 0,
            taskName: "",
            previousName: ""
        }
    }

    // add new block of a list
    addNewList() {
        let list = this.state.listNumber;
        let allLists = this.state.lists;
        if (list !== 8) {
            allLists[list] = ["Rename the list", []];
            this.setState({
                lists: allLists,
                listNumber: this.state.listNumber + 1
            });
        }
        else alert("Only 8 lists can be created")
    }

    // add a new task in the list
    addCard(event) {
        if (event.key === "Enter" || event.type === "click") {
            let elemKey = determineListNumber(event, { elementName: "addTask" });
            let allLists = this.state.lists;
            if (this.state.taskName !== "") {
                allLists[elemKey][1].push(this.state.taskName);
                this.setState({
                    taskName: "",
                    lists: allLists
                })
            }
        }

    }

    changeTaskName(event) {
        console.log(event)
        this.setState({ taskName: event })
    }

    // show input in block of adding task 
    showAndHideElem(e) {
        const hiddenElem = e.target;

        if (hiddenElem.className === "overlap") {
            hiddenElem.parentElement.classList.add("hideElem");
            hiddenElem.parentElement.parentElement.children[1].classList.remove("hideElem");
            hiddenElem.parentElement.parentElement.children[1].children[0].focus();
        }

        else if (e.relatedTarget === null || e.relatedTarget.className !== "btnAddCard") {
            hiddenElem.parentElement.classList.add("hideElem");
            hiddenElem.parentElement.parentElement.children[0].classList.remove("hideElem");
            this.setState({ taskName: "" })
        }

        else if (e.relatedTarget.className === "btnAddCard") {
            hiddenElem.parentElement.parentElement.children[1].children[0].focus();
        }
    }

    // change task or list name
    changeElemName(event, elem) {

        let elemKey = determineListNumber(event, { elementName: elem });
        let allLists = this.state.lists;
        if (elem === "list") {
            allLists[elemKey][0] = event.target.value;
        }

        else if (elem === "task") {
            allLists[elemKey[1]][1][elemKey[0]] = event.target.value;
        }

        this.setState({
            taskName: "",
            lists: allLists
        })
    }

    hideNameEditingAndAssertForEmpty(event, elem) {
        hideInputName(event);
        if (event.target.defaultValue === "" && (event.key === "Enter" || event.type === "blur")) {
            let elemKey = determineListNumber(event, { elementName: elem });
            let allLists = this.state.lists;
            if (elem === "list") {
                allLists[elemKey][0] = this.state.previousName;
            }

            else if (elem === "task") {
                allLists[elemKey[1]][1][elemKey[0]] = this.state.previousName;
            }

            this.setState({
                previousName: ""
            })
        }
    }


    // keep previous value for using in hideNameEditingAndAssertForEmpty() in case name is empty
    showNameEditingAndKeepPreviousValue(event) {
        showInputName(event);
        if (event.type === "focus") {
            this.setState({
                previousName: event.target.defaultValue
            })
        }

        else if (event.type === "click") {
            this.setState({
                previousName: event.target.parentElement.children[0].innerText
            })
        }
    }


    nameOfElements(props) {

        return (
            <div className={props.blockName}>

                <div className="namePar">
                    <p>{props.parText}</p>
                </div>

                <div className="nameInput">
                    <input className={props.inputClass} type="text"
                        maxLength="17"
                        onFocus={props.onFocusFunc}
                        onBlur={(blurEvent) => { this.hideNameEditingAndAssertForEmpty(blurEvent, props.elementName) }}
                        onChange={(e) => { this.changeElemName(e, props.elementName) }}
                        onKeyPress={(blurEvent) => { this.hideNameEditingAndAssertForEmpty(blurEvent, props.elementName) }}
                        value={props.inputValue}></input>
                </div>
            </div>
        )
    }

    // show block where task may be moved
    handleOnDragStart(result) {
        if (result.source.droppableId !== "lists") {
            let allListsKeys = Object.keys(this.state.lists);
            let droppableFromList = result.source.droppableId;
            droppableFromList = droppableFromList.substring(5, droppableFromList.length);
            allListsKeys.splice(allListsKeys.indexOf(droppableFromList), 1);
            for (let item = 0; item < allListsKeys.length; item++) {
                document.querySelector(`[data-rbd-droppable-id="tasks${allListsKeys[item]}"]`).classList.add("availableDrop");
            }
        }
    }


    handleOnDragEnd(result) {
        let allListsKeys = Object.keys(this.state.lists);
        for (let item = 0; item < allListsKeys.length; item++) {
            document.querySelector(`[data-rbd-droppable-id="tasks${allListsKeys[item]}"]`).classList.remove("availableDrop")
        }

        // drop lists
        if (result.type === "group") {
            if (!result.destination) return;
            const listOfItems = this.state.lists;
            const items = Array.from(listOfItems);
            const [recordedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, recordedItem)

            this.setState({
                lists: items
            })
        }
        // drop tasks
        else if (result.type === "tasks") {
            let allLists = this.state.lists;
            if (!result.destination) return;

            // the index of the list where the element is moved to
            let destinationDrop = result.destination.droppableId;
            destinationDrop = destinationDrop.substring(5, destinationDrop.length);

            // the index of the task where the element is moved to(inside the list)
            let destinationDrag = this.calculateTaskIndex(result.destination.index, destinationDrop);

            // the index of the list where the elem is moved from
            let dropFrom = result.source.droppableId;
            dropFrom = dropFrom.substring(5, dropFrom.length);

            // the index of the task where the element is moved from(inside the list)
            let dragFrom = this.calculateTaskIndex(result.source.index, dropFrom);

            let dragItemText = allLists[dropFrom][1][dragFrom];
            allLists[dropFrom][1].splice(dragFrom, 1);
            allLists[destinationDrop][1].splice(destinationDrag, 0, dragItemText);

            this.setState({
                lists: allLists
            })
        }
    }

    assignTaskIndexForDrag(listNumber, key) {
        let allLists = this.state.lists;
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

    calculateTaskIndex(index, listKey) {
        let allLists = this.state.lists;
        let currentListKey = 0;

        while (currentListKey != parseInt(listKey)) {
            index -= allLists[currentListKey][1].length;
            currentListKey++;
        }
        return index
    }


    render() {
        let allLists = this.state.lists;

        return (
            <div className="lists">

                <div className="addNewListContainer">
                    <div className="addNewList addSomeElement list"
                        onClick={() => this.addNewList()}>
                        <img src={plus} alt="plus" ></img>
                        <p>Add another list</p>
                    </div>
                </div>

                <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)} onDragStart={this.handleOnDragStart.bind(this)}>

                    <Droppable droppableId="lists" direction="horizontal" type="group">
                        {(provided) => (
                            <div className="createdListsContainer" {...provided.droppableProps} ref={provided.innerRef}>
                                {Object.keys(allLists).map((key, index) => (
                                    <Draggable type="group" key={key} draggableId={`list${key}`} index={index}>
                                        {(provided) => (
                                            <div className={`createdList list createdList${key}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                {this.nameOfElements({
                                                    blockName: "listName",
                                                    elementName: "list",
                                                    parText: allLists[key][0],
                                                    inputValue: allLists[key][0],
                                                    inputClass: null,
                                                    onFocusFunc: (event) => { this.showNameEditingAndKeepPreviousValue(event) }
                                                })}
                                                <div>
                                                    <Droppable droppableId={`tasks${key}`} type="tasks">
                                                        {(provided, snapshot) => (
                                                            <div className="tasksContainer" {...provided.droppableProps} ref={provided.innerRef}
                                                                style={tasksBlockBg(snapshot.isDraggingOver)}>
                                                                {allLists[key][1].map((item, taskKey) => (

                                                                    <Draggable type="tasks" key={this.assignTaskIndexForDrag(key, taskKey)}
                                                                        draggableId={`taskDrag${this.assignTaskIndexForDrag(key, taskKey)}`}
                                                                        index={this.assignTaskIndexForDrag(key, taskKey)}>
                                                                        {(provided) => (
                                                                            <div className={`listName${taskKey}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                                <div className="editTaskName">
                                                                                    {this.nameOfElements({
                                                                                        blockName: "taskName",
                                                                                        elementName: "task",
                                                                                        parText: item,
                                                                                        inputValue: allLists[key][1][taskKey],
                                                                                        inputClass: "taskNameInput",
                                                                                        onFocusFunc: null
                                                                                    })}
                                                                                    <img src={create} alt="create element" onClick={(event) => { this.showNameEditingAndKeepPreviousValue(event) }}></img>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>

                                                                ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>

                                                </div>
                                                <AddTasks plus={plus} showAndHideElem={this.showAndHideElem.bind(this)}
                                                changeTaskName={this.changeTaskName.bind(this)} addCard={this.addCard.bind(this)}
                                                taskName={this.state.taskName}
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
}