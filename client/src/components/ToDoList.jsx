import React, {Component} from "react";
import {Card, Form, Header, Icon, Input} from "semantic-ui-react";
import api from "../api";


class ToDoList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: []
        };
    }

    componentDidMount() {
        this.getTasks();
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    onSubmit = async (e) => {
        e.preventDefault();

        let {task} = this.state;

        if (task) {
            await api.createTask(task);

            this.getTasks();
            this.setState({
                task: ""
            });
        }
    };

    getTasks = async () => {
        try {
            const response = await api.getTasks();

            this.setState({
                items: response.data.map(item => {
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
        } catch (e) {
            /* Add sweet alert */
        }
    };

    completeTask = async id => {
        try {
            await api.completeTask(id);
            this.getTasks();
        } catch (e) {
            /* Add sweet alert */
        }
    };

    undoTask = async id => {
        try {
            await api.undoTask(id);
            this.getTasks();
        } catch (e) {
            /* Add sweet alert */
        }
    };

    deleteTask = async id => {
        try {
            await api.deleteTask(id);
            this.getTasks();
        } catch (e) {
            /* Add sweet alert */
        }
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