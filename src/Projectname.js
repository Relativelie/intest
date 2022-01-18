import { Component } from "react";
import { hideInputName, showInputName } from "./basefunctions";


export class ProjectName extends Component {
    constructor() {
        super();

        this.state = {
            name: "Write the name of the project"
        }
    }

    changeProjectName(event) {
        this.setState({ name: event })
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
                            onFocus={(event) => { showInputName(event) }}
                            onBlur={(blurEvent) => { hideInputName(blurEvent) }}
                            onChange={(e) => { this.changeProjectName(e.target.value) }}
                            value={this.state.name}></input>
                    </div>
            </div>
        )
    }
}