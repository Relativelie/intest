import { Component } from "react";
import { hideInputName, showInputName } from "./basefunctions";


export class ProjectName extends Component {
    constructor() {
        super();

        this.state = {
            name: "Write the name of the project",
            previousProjectName: ""
        }
    }

    changeProjectName(event) {
        this.setState({ name: event })
    }

    showInputAndKeepPreviousValue(event) {
        showInputName(event);
            this.setState({
                previousProjectName: event.target.defaultValue
            })
    }

    hideInputNameAndAssertEmptyName(event) {
        hideInputName(event);
        if (event.target.defaultValue === "" && (event.key === "Enter" || event.type === "blur")) {
            let previousName = this.state.previousProjectName

            this.setState({
                name: previousName,
                previousProjectName: "",
            })
        }
    }

    render() {
        return (
            <div className="projectName container">
                    <div className="namePar">
                        <p>{this.state.name}</p>
                    </div>
                    <div className="nameInput">
                        <input type="text"
                            maxLength="34"
                            onKeyPress={(blurEvent) => { this.hideInputNameAndAssertEmptyName(blurEvent) }}
                            onFocus={(event) => { this.showInputAndKeepPreviousValue(event) }}
                            onBlur={(blurEvent) => { this.hideInputNameAndAssertEmptyName(blurEvent) }}
                            onChange={(e) => { this.changeProjectName(e.target.value) }}
                            value={this.state.name}></input>
                    </div>
            </div>
        )
    }
}