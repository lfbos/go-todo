import ToDoList from "./components/ToDoList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default [
    {
        path: "/",
        exact: true,
        isPrivate: true,
        component: ToDoList
    },
    {
        path: "/login/",
        isPrivate: false,
        component: LoginForm
    },
    {
        path: "/signup/",
        isPrivate: false,
        component: RegisterForm
    }
];