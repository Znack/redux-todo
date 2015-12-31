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
        addTodo: (_spies.addTodo = sinon.spy()),
        completeTodo: (_spies.completeTodo = sinon.spy()),
        setVisibilityFilter: (_spies.setVisibilityFilter = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    }

    _component = shallowRenderWithProps(_props)
    _rendered = renderWithProps(_props)
  })

  it('Should render as a <div>.', function () {
    console.log(_component)
    expect(_component.type).to.equal('div')
  })

  it('Should include an <h1> with welcome text.', function () {
    const h1 = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'h1')

    expect(h1).to.exist
    expect(h1.textContent).to.match(/React Redux Starter Kit's Todo/)
  })

  it('Should render AddTodo Component.', function () {
    const AddTodoComponent = TestUtils.findRenderedComponentWithType(_rendered, AddTodo)

    expect(AddTodoComponent).to.exist
  })

  it('Should render TodoList Component.', function () {
    const TodoListComponent = TestUtils.findRenderedComponentWithType(_rendered, TodoList)

    expect(TodoListComponent).to.exist
  })

  it('Should render Footer Component.', function () {
    const FooterComponent = TestUtils.findRenderedComponentWithType(_rendered, Footer)

    expect(FooterComponent).to.exist
  })
})
