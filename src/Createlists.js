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

        let elemKey = determineListNumber(event, "card");
        let allLists = this.state.lists;
        if (this.state.taskName != "") {
            allLists[elemKey][1].push(this.state.taskName);
            this.setState({
                taskName: "",
                lists: allLists
            })
        }

    }

    changeTasktName(event) {
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

    changeListName(event) {
        let elemKey = determineListNumber(event, "list");
        let allLists = this.state.lists;
        allLists[elemKey][0] = event.target.value;
        this.setState({
            taskName: "",
            lists: allLists
        })
    }

    changeTaskName(e) {
        console.log(e);
        let elemKey = determineListNumber(e, "task");
        let allLists = this.state.lists;
        allLists[elemKey][1][elemKey] = e.target.value;
        this.setState({
            taskName: "",
            lists: allLists
        })
    }

    handleOnDragEnd(result) {
        if (!result.destination) return;
        const listOfItems = this.state.lists;
        const items = Array.from(listOfItems);
        const [recordedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, recordedItem)

        this.setState({
            lists: items
        })
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

                    <Droppable droppableId="characters" direction="horizontal">
                        {(provided) => (
                            <div className="createdListsContainer" {...provided.droppableProps} ref={provided.innerRef} >
                                {Object.keys(allLists).map((key, index) => (
                                    <Draggable key={key} draggableId={key} index={index}>
                                        {(provided) => (
                                            <div className={`createdList list createdList${key}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                <div className="listName">
                                                    <div className="listNamePar">
                                                        <p>{allLists[key][0]}</p>
                                                    </div>

                                                    <div className="listNameInput">
                                                        <input type="text"
                                                            maxLength="17"
                                                            onFocus={(event) => { showInputName(event) }}
                                                            onBlur={(blurEvent) => { hideInputName(blurEvent) }}
                                                            onChange={(e) => { this.changeListName(e) }}
                                                            value={allLists[key][0]}></input>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        {allLists[key][1].map((item, listKey) => (
                                                            <div className={`listName listName${listKey}`} key={listKey}>
                                                                <div className="listNamePar">
                                                                    <p>{item}</p>
                                                                </div>

                                                                <div className="listNameInput">
                                                                    <input type="text"
                                                                        maxLength="17"
                                                                        onFocus={(event) => { showInputName(event) }}
                                                                        onBlur={(blurEvent) => { hideInputName(blurEvent) }}
                                                                        onChange={(e) => { this.changeTaskName(e) }}
                                                                        value={allLists[key][1][listKey]}></input>
                                                                </div>
                                                            </div>




                                                        ))}
                                                    </div>

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
                                                            onChange={(e) => { this.changeTasktName(e.target.value) }}
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