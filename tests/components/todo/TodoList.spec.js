import TestUtils from 'react-addons-test-utils'
import { bindActionCreators } from 'redux'
import TodoList from '../../../src/components/todo/TodoList'
import Todo from '../../../src/components/todo/Todo'

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()

  renderer.render(component)
  return renderer.getRenderOutput()
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<TodoList {...props} />)
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<TodoList {...props} />)
}

describe('(Component) TodoList', () => {
  let _component, _rendered, _props, _spies

  beforeEach(() => {
    _spies = {}
    _props = {
      todos: [
        {
          text: 'Not completed yet',
          completed: false
        },
        {
          text: 'Completed!',
          completed: true
        }
      ],
      ...bindActionCreators({
        onTodoClick: (_spies.onTodoClick = sinon.spy()),
      }, _spies.dispatch = sinon.spy())
    }
    _component = shallowRenderWithProps(_props)
    _rendered = renderWithProps(_props)
  })

  it('Should render as a <ul>.', () => {
    expect(_component.type).to.equal('ul')
  })

  it('Should render 2 Todo Components.', function () {
    const TodoComponents = TestUtils.scryRenderedComponentsWithType(_rendered, Todo)

    expect(TodoComponents).to.have.length(2)
    expect(TodoComponents[0].props).to.exist
    expect(TodoComponents[0].props.text).to.be.equal('Not completed yet')
    expect(TodoComponents[0].props.completed).to.be.equal(false)
    expect(TodoComponents[1].props.text).to.be.equal('Completed!')
    expect(TodoComponents[1].props.completed).to.be.equal(true)
    expect(TodoComponents[1].props.onClick).to.be.a('function')
  })

})
