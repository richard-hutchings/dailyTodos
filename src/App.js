import React, { Component } from 'react';
import './App.css';
import Pomo from './timer.js';
import Clock from 'react-clock';
import { Table, Checkbox, Button } from 'semantic-ui-react';


class App extends Component {
  
  state = {
    date: new Date(),
    todos: [
      { title: 'Make Coffee!', completed: false },
      { title: 'Take 3 Deep Breaths', completed: false },
      { title: 'Begin...', completed: false },
    ],
    newTodo: '',
   
  }
 //clock.
 componentDidMount() {
    setInterval(
      () => this.setState({ date: new Date() }),
      1000
    );
  }
//Toggle button handler.
 handleToggleAll = () => {
   const [...todos] = this.state.todos
   const allToggled = todos.every(todo => todo.completed)
   const toggledTodos = todos.map(todo => ({
     ...todo,
     completed: !allToggled
   }))
   this.setState({ todos: toggledTodos })
 }
//Todo Handler.
 handleTodoClick(todo, index)  {
  const { completed } = todo   
  const [...todos] = this.state.todos
  todos[index] = {
     ...todo,
     completed: !completed 
    }
  this.setState({ todos })
}
//Input Handler.
handleInputChange = event => {
  const value = event.target.value
  this.setState({ newTodo: value })
}
//key down Handler.
handleNewTodoKeyDown = event => {
  if (this.state.todos.length >= 11) {
    //no more than 11 things to do.
    return
  }
  if (event.keyCode !== 13 ) { // 13 = enter key.
    return
  }
  event.preventDefault()

  const { newTodo, todos } = this.state
  const value = newTodo.trim()
  if (value) {
    this.setState({
      todos: [
        ...todos,
         { title: value, completed: false }
      ],
      newTodo: '',
    })
  }
}
//Delete Handler.
handleDelete = (todo, i) => {
   const { todos } = this.state
   const withoutDeletedTodo = todos.filter(
     (t, index) => 
     index !== i,
   )
   this.setState({ todos: withoutDeletedTodo })
}
//Clear completed handler.
handleClearCompleted = () => {
  const { todos } = this.state
  const inCompleteTodos = todos.filter(todo => !todo.completed)
  this.setState({ todos: inCompleteTodos })
}

  render() {
    const { todos, newTodo } = this.state
    const allToggled = todos.every(todo => todo.completed)
     return(
    <div className="app">
        <div className="todo-container"> 
        <input 
        id="new-todo" 
        className="new-todo" 
        placeholder="  What Needs To Be Done ?"
        autoFocus
        value={this.state.newTodo}
        onChange={this.handleInputChange}
        onKeyDown={this.handleNewTodoKeyDown}
        />
        <label htmlFor="new-todo" 
        style={{ display: 'none' }}> New Todo </label>
       { todos.length === 0 ? 
       (  <div>  <br/>  ... You Have Nothing To Do - Hooray! </div> 
               ) : ( 
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Checkbox 
                checked={allToggled}
                onChange={this.handleToggleAll}
                 />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        <Table.Body>
        {this.state.todos.map((todo, i) => (
          <Table.Row 
          key={i}
          positive={todo.completed} >
          <Table.Cell>
           <Checkbox 
            checked={todo.completed}
            onChange={() => 
              this.handleTodoClick(todo, i)
            }
           />
          </Table.Cell>
          <Table.Cell>
          { todo.title }
          <Button
           color="red"
           icon="trash"
           floated="right"
           compact
           size="small"
           onClick={() => this.handleDelete(todo, i)}
          />
          </Table.Cell>
        </Table.Row>
        ))}
        </Table.Body>
        
       <Table.Footer>
         <Table.Row>
           <Table.HeaderCell colSpan="2">
             <Button
             size="small"
             onClick={this.handleClearCompleted}
             >Clear Completed</Button>
           </Table.HeaderCell>
         </Table.Row>
       </Table.Footer>
       </Table>
          )
       }
        
      </div>
        <div className="clock"> 
        <Clock
          value={this.state.date}
          renderNumbers={true}
          size={230}
          hourHandWidth={7}
          minuteHandWidth={4}
          minuteHandLength={80}

        />
         </div>
      <div className="timer">
        <Pomo 
        />
         </div>
    </div>
     );
    
   
  }   

  
}

//setInterval({tick}, 1000);

export default App;


/*  line 82
 <div class="ui checked checkbox">
               <input type="checkbox" checked="" /> 
                <label>Active</label> 
                </div>
                </Checkbox>

<tr>
     <th>
     <div class="ui checked checkbox">
        <input type="checkbox" checked="" />         
      </div> 
     </th>
     <th>
       { props.children }
       <i class="trash alternate icon" color="red" floated="right"></i>
     </th>
   </tr>
)

<table class="ui definition table">
          <thead>
            <tr>
              <th>
              <div class="ui checked checkbox">
               <input type="checkbox" checked="" /> 
                <label>Active</label> 
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
          {this.state.todos.map((todo, i) => (
          <TodoItem key={i}>{ todo } </TodoItem>
        ))}
          </tbody>
        </table>  */
