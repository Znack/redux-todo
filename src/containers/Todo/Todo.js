import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import * as todoModule from 'redux/modules/todo';
import { UserChooser, AddTodo, TodoList, Footer } from 'components/Todo';
import {initializeWithKey} from 'redux-form';
import connectData from 'helpers/connectData';
import { WidgetForm } from 'components';

const selectTodos = (todos, filter, authorId) => {
  let selectedTodos = todos;
  switch (filter) {
    case todoModule.VisibilityFilters.SHOW_COMPLETED:
      selectedTodos = todos.filter(todo => todo.completed);
      break;
    case todoModule.VisibilityFilters.SHOW_ACTIVE:
      selectedTodos = todos.filter(todo => !todo.completed);
      break;
    default:
      break;
  }
  return selectedTodos.filter(todo => todo.userId === authorId);
};

export const mapStateToProps = (state) => {
  return {
    users: state.todo.users,
    currentUser: state.todo.currentUser,
    visibleTodos: selectTodos(state.todo.todos, state.todo.visibilityFilter, state.todo.currentUser),
    visibilityFilter: state.todo.visibilityFilter
  };
};

@connect(
  mapStateToProps,
  {...todoModule.actions, initializeWithKey })
export default class Todo extends Component {
  static propTypes = {
    users: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired
    }).isRequired).isRequired,
    currentUser: React.PropTypes.number,
    visibleTodos: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.string.isRequired,
      completed: React.PropTypes.bool.isRequired
    })),
    visibilityFilter: React.PropTypes.oneOf([
      'SHOW_ALL',
      'SHOW_COMPLETED',
      'SHOW_ACTIVE'
    ]).isRequired,

    fetchUsers: React.PropTypes.func.isRequired,
    changeUser: React.PropTypes.func.isRequired,
    addTodo: React.PropTypes.func.isRequired,
    fetchTodos: React.PropTypes.func.isRequired,
    completeTodo: React.PropTypes.func.isRequired,
    setVisibilityFilter: React.PropTypes.func.isRequired
  };

  componentDidMount () {
    this.props.fetchUsers();
    this.props.fetchTodos();
  }

  render () {
    return (

      <div className="container text-center">
        <h1>React Redux Starter Kit's Todo</h1>
        <div>
          <UserChooser
            currentUser={this.props.currentUser}
            users={this.props.users}
            onUserChosen={this.props.changeUser} />
          <AddTodo
            onAddClick={this.props.addTodo} />
        </div>
        <TodoList
          todos={this.props.visibleTodos}
          onTodoClick={this.props.completeTodo} />
        <Footer
          filter={this.props.visibilityFilter}
          onFilterChange={this.props.setVisibilityFilter} />
        <hr />
      </div>
    );
  }
}
