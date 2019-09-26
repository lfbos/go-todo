import React from "react";
import {Container} from "semantic-ui-react";

import "./App.css";
import ToDoList from "./ToDoList";

function App() {
    return (
        <div>
            <Container>
                <ToDoList />
            </Container>
        </div>
    );
}

export default App;
