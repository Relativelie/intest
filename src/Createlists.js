import { Component } from "react";
import plus from './plus.png';


export class CreateLists extends Component {
    constructor() {
        super();

        this.state = {
            lists: {},
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

        let elem = event.target.parentElement.parentElement.parentElement.classList[2];
        let elemKey = elem.substring(11, elem.length);
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
        // if (e.relatedTarget != null) {
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
            console.log(this.state.taskName)
        // }
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


                <div className="createdListsContainer">
                    {Object.keys(allLists).map((key) => (
                        <div key={key} className={`createdList list createdList${key}`}>
                            <div>
                                <p>{allLists[key][0]}</p>
                            </div>
                            <div>
                                <ul>
                                    {allLists[key][1].map((item, listKey) => (
                                        <li key={listKey}>{item}</li>
                                    ))}
                                </ul>
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
                    ))}
                </div>
            </div>
        )
    }
}