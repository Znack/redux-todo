import { connect } from 'react-redux'
import { Link } from 'react-router'
import { actions, VisibilityFilters } from '../redux/modules/todo'
import AddTodo from '../components/todo/AddTodo'
import TodoList from '../components/todo/TodoList'
import Footer from '../components/todo/Footer'

const selectTodos = (todos, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed)
  }
}

const mapStateToProps = (state) => {
  return {
    visibleTodos: selectTodos(state.todo.todos, state.todo.visibilityFilter),
    visibilityFilter: state.todo.visibilityFilter
  }
}

export class TodoView extends React.Component {
  static propTypes = {
    visibleTodos: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.string.isRequired,
      completed: React.PropTypes.bool.isRequired
    })),
    visibilityFilter: React.PropTypes.oneOf([
      'SHOW_ALL',
      'SHOW_COMPLETED',
      'SHOW_ACTIVE'
    ]).isRequired,
    addTodo: React.PropTypes.func.isRequired,
    fetchTodos: React.PropTypes.func.isRequired,
    completeTodo: React.PropTypes.func.isRequired,
    setVisibilityFilter: React.PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchTodos()
  }

  render () {
    return (

      <div className='container text-center'>
        <h1>React Redux Starter Kit's Todo</h1>
        <AddTodo
          onAddClick={this.props.addTodo} />
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
    )
  }
}

export default connect(mapStateToProps, actions)(TodoView)
