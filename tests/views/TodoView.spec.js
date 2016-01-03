import TestUtils from 'react-addons-test-utils'
import { bindActionCreators } from 'redux'
import { TodoView } from '../../src/views/TodoView'
import AddTodo from '../../src/components/todo/AddTodo'
import TodoList from '../../src/components/todo/TodoList'
import Footer from '../../src/components/todo/Footer'

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()

  renderer.render(component)
  return renderer.getRenderOutput()
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<TodoView {...props} />)
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<TodoView {...props} />)
}

describe('(View) Todo', function () {
  let _component, _rendered, _props, _spies

  beforeEach(function () {
    _spies = {}
    _props = {
      visibleTodos: [{
        text: 'Complete me!',
        completed: false
      }],
      visibilityFilter: 'SHOW_ALL',
      ...bindActionCreators({
        fetchTodos: (_spies.fetchTodos = sinon.spy()),
        addTodo: (_spies.addTodo = sinon.spy()),
        completeTodo: (_spies.completeTodo = sinon.spy()),
        setVisibilityFilter: (_spies.setVisibilityFilter = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    }

    _component = shallowRenderWithProps(_props)
    _rendered = renderWithProps(_props)
  })

  it('Should render as a <div>.', function () {
    expect(_component.type).to.equal('div')
  })

  it('Should include an <h1> with welcome text.', function () {
    const h1 = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'h1')

    expect(h1).to.exist
    expect(h1.textContent).to.match(/React Redux Starter Kit's Todo/)
  })

  it('Should dispatch fetchTodos action.', function () {
    _spies.dispatch.should.have.been.called
    _spies.fetchTodos.should.have.been.called
  })

  it('Should render AddTodo Component.', function () {
    const AddTodoComponent = TestUtils.findRenderedComponentWithType(_rendered, AddTodo)

    expect(AddTodoComponent).to.exist
    expect(AddTodoComponent.props).to.exist
    expect(AddTodoComponent.props.onAddClick).to.be.a('function')
  })

  it('Should render TodoList Component.', function () {
    const TodoListComponent = TestUtils.findRenderedComponentWithType(_rendered, TodoList)

    expect(TodoListComponent).to.exist
    expect(TodoListComponent.props).to.exist
    expect(TodoListComponent.props.todos).to.eql([{
      text: 'Complete me!',
      completed: false
    }])
    expect(TodoListComponent.props.onTodoClick).to.be.a('function')
  })

  it('Should render Footer Component.', function () {
    const FooterComponent = TestUtils.findRenderedComponentWithType(_rendered, Footer)

    expect(FooterComponent).to.exist
    expect(FooterComponent.props).to.exist
    expect(FooterComponent.props.filter).to.be.equal('SHOW_ALL')
    expect(FooterComponent.props.onFilterChange).to.be.a('function')
  })


})
