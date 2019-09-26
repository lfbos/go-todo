import React, {Component} from "react";
import axios from "axios";
import {Card, Form, Header, Icon, Input} from "semantic-ui-react";

let BASE_URL = "http://localhost:8080";
let TASK_API_URL = `${BASE_URL}/api/task/`;

class ToDoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: []
        };
    }

    componentDidMount() {
        this.getTask();
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onSubmit = () => {
        let {task} = this.state;

        if (task) {
            axios
                .post(TASK_API_URL, {task})
                .then(() => {
                    this.getTask();
                    this.setState({
                        task: ""
                    });
                });
        }
    };

    getTask = () => {
        axios.get(TASK_API_URL).then(res => {
            this.setState({
                items: res.data.map(item => {
                    let color = "yellow";

                    if (item.status) {
                        color = "green";
                    }

                    return (
                        <Card key={item._id} color={color} fluid>
                            <Card.Content>
                                <Card.Header textAlign="left">
                                    <Icon color={color} name="circle"/> <span
                                    style={{wordWrap: "break-word"}}>{item.task}</span>
                                </Card.Header>

                                <Card.Meta textAlign="right">
                                    <a href="#"
                                       onClick={(e) => {
                                           e.preventDefault();
                                           this.completeTask(item._id);
                                       }}
                                    >
                                        <Icon
                                            name="check circle"
                                            color="green"
                                        />
                                        <span style={{paddingRight: 10}}>Done</span>
                                    </a>
                                    <a href="#"
                                       onClick={(e) => {
                                           e.preventDefault();
                                           this.undoTask(item._id);
                                       }}
                                    >
                                        <Icon
                                            name="undo"
                                            color="yellow"
                                        />
                                        <span style={{paddingRight: 10}}>Undo</span>
                                    </a>
                                    <a href="#"
                                       onClick={(e) => {
                                           e.preventDefault();
                                           this.deleteTask(item._id);
                                       }}
                                    >
                                        <Icon
                                            name="delete"
                                            color="red"
                                        />
                                        <span style={{paddingRight: 10}}>Delete</span>
                                    </a>
                                </Card.Meta>
                            </Card.Content>
                        </Card>
                    );
                })
            });
        });
    };

    completeTask = id => {
        axios
            .post(`${TASK_API_URL}${id}/complete`)
            .then(() => {
                this.getTask();
            });
    };

    undoTask = id => {
        axios
            .post(`${TASK_API_URL}${id}/undo`)
            .then(() => {
                this.getTask();
            });
    };

    deleteTask = id => {
        axios.delete(`${TASK_API_URL}${id}`)
            .then(() => {
                this.getTask();
            });
    };

    render() {
        return (
            <div>
                <div className="row">
                    <Header className="header" as="h2">
                        TO DO LIST
                    </Header>
                </div>
                <div className="row">
                    <Form onSubmit={this.onSubmit}>
                        <Input
                            type="text"
                            name="task"
                            onChange={this.onChange}
                            value={this.state.task}
                            fluid
                            placeholder="Create Task"
                        />
                    </Form>
                </div>
                <div className="row">
                    <Card.Group>{this.state.items}</Card.Group>
                </div>
            </div>
        );
    }
}

export default ToDoList;