import create from '../images/create.png'
import React from 'react';
import { Droppable, Draggable } from "react-beautiful-dnd";


const tasksBlockBg = (isDraggingOver) => (
    { background: isDraggingOver ? 'rgba(91, 201, 173, 0.685)' : 'none', }
);

export const Tasks = (props) => {
    const myProps = { ...props };

    return (
        <Droppable droppableId={`tasks${myProps.listKey}`} type="tasks">
            {(provided, snapshot) => (
                <div className="tasksContainer" {...provided.droppableProps} ref={provided.innerRef}
                    style={tasksBlockBg(snapshot.isDraggingOver)}>
                    {myProps.allLists[myProps.listKey][1].map((item, taskKey) => (

                        <Draggable type="tasks" key={myProps.assignTaskIndexForDrag(myProps.listKey, taskKey)}
                            draggableId={`taskDrag${myProps.assignTaskIndexForDrag(myProps.listKey, taskKey)}`}
                            index={myProps.assignTaskIndexForDrag(myProps.listKey, taskKey)}>
                            {(provided) => (
                                <div className={`listName${taskKey}`} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                    <div className="editTaskName">
                                        {myProps.nameOfElements({
                                            blockName: "taskName",
                                            elementName: "task",
                                            parText: item,
                                            inputValue: myProps.allLists[myProps.listKey][1][taskKey],
                                            inputClass: "taskNameInput",
                                            onFocusFunc: null
                                        })}
                                        <img src={create} alt="create element" onClick={(event) => { myProps.showAndKeepValue(event) }}></img>
                                    </div>
                                </div>
                            )}
                        </Draggable>

                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}