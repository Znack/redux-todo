import TestUtils from 'react-addons-test-utils'
import { bindActionCreators } from 'redux'
import AddTodo from '../../../src/components/todo/AddTodo'

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()

  renderer.render(component)
  return renderer.getRenderOutput()
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<AddTodo {...props} />)
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<AddTodo {...props} />)
}

describe('(Component) AddTodo', () => {
  let _component, _rendered, _props, _spies

  beforeEach(() => {
    _spies = {}
    _props = {
      ...bindActionCreators({
        onAddClick: (_spies.onAddClick = sinon.spy()),
      }, _spies.dispatch = sinon.spy())
    }
    _component = shallowRenderWithProps(_props)
    _rendered = renderWithProps(_props)
  })

  it('Should render as a <div>.', () => {
    expect(_component.type).to.equal('div')
  })

  it('Should trigger the callback by click with trimmed text', () => {
    let input = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'input')
    input.value = ' New Todo!  '
    let button = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'button')
    TestUtils.Simulate.click(button)
    _spies.dispatch.should.have.been.called
    _spies.onAddClick.should.have.been.calledWith('New Todo!')
  })

})
