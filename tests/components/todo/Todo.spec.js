import TestUtils from 'react-addons-test-utils'
import { bindActionCreators } from 'redux'
import Todo from '../../../src/components/todo/Todo'

function shallowRender (component) {
  const renderer = TestUtils.createRenderer()

  renderer.render(component)
  return renderer.getRenderOutput()
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<Todo {...props} />)
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<Todo {...props} />)
}

describe('(Component) Todo', () => {
  let _component, _rendered, _props, _spies

  beforeEach(() => {
    _spies = {}
    _props = {
      text: 'Completed todo!',
      completed: true,
      ...bindActionCreators({
        onClick: (_spies.onClick = sinon.spy()),
      }, _spies.dispatch = sinon.spy())
    }
  })

  it('Should render as a <li>.', () => {
    _component = shallowRenderWithProps(_props)
    expect(_component.type).to.equal('li')
  })

  it('Should handle the click event', () => {
    _rendered = renderWithProps(_props)
    let element = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'li')
    TestUtils.Simulate.click(element)
    _spies.onClick.should.have.been.called
    _spies.dispatch.should.have.been.called
  })

})
