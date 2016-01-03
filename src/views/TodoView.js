import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions, VisibilityFilters } from '../redux/modules/todo';
import UserChooser from '../components/todo/UserChooser';
import AddTodo from '../components/todo/AddTodo';
import TodoList from '../components/todo/TodoList';
import Footer from '../components/todo/Footer';

const selectTodos = (todos, filter, authorId) => {
  var selectedTodos = todos;
  switch (filter) {
    case VisibilityFilters.SHOW_COMPLETED:
      selectedTodos = todos.filter(todo => todo.completed);
      break;
    case VisibilityFilters.SHOW_ACTIVE:
      selectedTodos = todos.filter(todo => !todo.completed);
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

export class TodoView extends React.Component {
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

      <div className='container text-center'>
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
        <Link to='/'>Go To Home View</Link>
        <Link to='/about'>Go To About View</Link>
      </div>
    );
  }
}

export default connect(mapStateToProps, actions)(TodoView);
