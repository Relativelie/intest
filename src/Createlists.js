import { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import plus from './plus.png';
import { hideInputName, showInputName, determineListNumber } from "./basefunctions";


export class CreateLists extends Component {
    constructor() {
        super();

        this.state = {
            lists: [],
            listNumber: 0,
            taskName: ""
        }
    }

    addNewList() {
        let list = this.state.listNumber;
        let allLists = this.state.lists;
        if (list != 15) {
            allLists[list] = ["Rename the list", []];

            this.setState({
                lists: allLists,
                listNumber: this.state.listNumber + 1
            });
        }
        else alert("Only 15 lists can be created")

    }

    addCard(event) {
        let elemKey = determineListNumber(event, {elementName: "addTask"});
        let allLists = this.state.lists;
        if (this.state.taskName != "") {
            allLists[elemKey][1].push(this.state.taskName);
            this.setState({
                taskName: "",
                lists: allLists
            })
        }
    }

    changeTaskName(event) {
        this.setState({ taskName: event })
    }

    showAndHideElem(e) {
        const hiddenElem = e.target;
        if (hiddenElem.className === "overlap") {
            hiddenElem.parentElement.classList.add("hideElem");
            hiddenElem.parentElement.parentElement.children[1].classList.remove("hideElem");
            hiddenElem.parentElement.parentElement.children[1].children[0].focus();
        }

        else if (e.relatedTarget === null || e.relatedTarget.className != "btnAddCard") {
            hiddenElem.parentElement.classList.add("hideElem");
            hiddenElem.parentElement.parentElement.children[0].classList.remove("hideElem");
            this.setState({ taskName: "" })
        }

        else if (e.relatedTarget.className === "btnAddCard") {
            hiddenElem.parentElement.parentElement.children[1].children[0].focus();
        }
    }

    changeElemName(event, elem) {
        let elemKey = determineListNumber(event, {elementName: elem});
        let allLists = this.state.lists;
        if (elem === "list") {
            allLists[elemKey][0] = event.target.value;
        }
        
        else if (elem === "task") {
            allLists[elemKey][1][elemKey] = event.target.value;
        }

        this.setState({
            taskName: "",
            lists: allLists
        })
    }


    nameOfElements(props) {

        return (
            <div className={props.blockName}>
    
                <div className="namePar">
                    <p>{props.parText}</p>
                </div>
    
                <div className="nameInput">
                    <input type="text"
                        maxLength="17"
                        onFocus={(event) => { showInputName(event) }}
                        onBlur={(blurEvent) => { hideInputName(blurEvent) }}
                        onChange={(e) => { this.changeElemName(e, props.elementName) }}
                        value={props.inputValue}></input>
                </div>
            </div>
        )
    }

    handleOnDragEnd(result) {
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

    assignTaskIndexForGrag(listNumber, key) {
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

                <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>

                    <Droppable droppableId="lists" direction="horizontal" type="group">
                        {(provided) => (
                            <div className="createdListsContainer" {...provided.droppableProps} ref={provided.innerRef} >
                                {Object.keys(allLists).map((key, index) => (
                                    <Draggable type="group" key={key} draggableId={`list${key}`} index={index}>
                                        {(provided) => (

                                            <div className={`createdList list createdList${key}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                {this.nameOfElements({
                                                    blockName: "listName",
                                                    elementName: "list",
                                                    parText: allLists[key][0],
                                                    inputValue: allLists[key][0]
                                                })}
                                                <div>

                                                    <Droppable droppableId={`tasks${key}`} type="tasks">
                                                        {(provided) => (
                                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                {allLists[key][1].map((item, taskKey) => (

                                                                        <Draggable type="tasks" key={this.assignTaskIndexForGrag(key, taskKey)} draggableId={`taskDrag${this.assignTaskIndexForGrag(key, taskKey)}`} index={this.assignTaskIndexForGrag(key, taskKey)}>

                                                                            {(provided) => (
                                                                                <div className={`listName${taskKey}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                                                    {this.nameOfElements({
                                                                                        blockName: "listName",
                                                                                        elementName: "task",
                                                                                        parText: item,
                                                                                        inputValue: allLists[key][1][taskKey]
                                                                                    })}
                                                                                </div>
                                                                            )}
                                                                        </Draggable>

                                                                    ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>

                                                </div>
                                                <div className="addCards">
                                                    <div className="addSomeElement" onClick={(e) => this.showAndHideElem(e)}>
                                                        <div className="overlap"></div>
                                                        <img src={plus} alt="plus"></img>
                                                        <p>Add a card</p>
                                                    </div>
                                                    <div className="inputFieldForTasks hideElem">
                                                        <input type="text"
                                                            placeholder="Enter task name"
                                                            onChange={(e) => { this.changeTaskName(e.target.value) }}
                                                            onBlur={(blurEvent) => { this.showAndHideElem(blurEvent) }}
                                                            value={this.state.taskName}></input>
                                                        <button className="btnAddCard" onClick={(event) => this.addCard(event)}>Add card</button>
                                                        <button onClick={(e) => this.showAndHideElem(e)}>X</button>
                                                    </div>
                                                </div>

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