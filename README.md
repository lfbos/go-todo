# TODO LIST APP

### Execute and test

* Install mongo
* Clone project `git clone https://github.com/lfbos/go-todo.git`

#### Server
* Enter to dir `cd server`
* Run server `go run main`
* Check the server running on `http://localhost:8080`

##### Endpoints available:
* GET `/api/task`: list all tasks
* GET `/api/task/{id}`: get specific task
* POST `/api/task`: create new task
* POST `/api/task/{id}/complete`: mark task as complete
* POST `/api/task/{id}/undo`: mark task as incomplete

#### Client
* Enter to dir `cd client`
* Install packages `yarn install`
* Start the client app `yarn start`
* Check the client running on `http://localhost:3000`

#### Ideas to keep testing
* Authentication
* Data validation
* Docker
* Reminders and task with expiration date