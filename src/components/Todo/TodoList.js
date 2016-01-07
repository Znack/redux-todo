import React, { Component, PropTypes } from 'react';
import TodoListItem from './TodoListItem';

export default class TodoList extends Component {
  render () {
    return (
      <ul>
        {this.props.todos.map((todo, index) =>
          <TodoListItem {...todo}
                key={index}
                onClick={() => this.props.onTodoClick(index)} />
        )}
      </ul>
    );
  }
}

TodoList.propTypes = {
  onTodoClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired
};
