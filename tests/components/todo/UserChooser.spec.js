import TestUtils from 'react-addons-test-utils';
import { bindActionCreators } from 'redux';
import UserChooser from '../../../src/components/todo/UserChooser';

function shallowRender (component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<UserChooser {...props} />);
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<UserChooser {...props} />);
}

describe('(Component) UserChooser', () => {
  let _component, _rendered, _props, _spies;

  beforeEach(() => {
    _spies = {};
    _props = {
      users: [{id: 1, name: 'Leanne Graham'}, {id: 2, name: 'Ervin Howell'}, {id: 3, name: 'Clementine Bauch'}],
      currentUser: 0,
      ...bindActionCreators({
        onUserChosen: (_spies.onUserChosen = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    };
    _component = shallowRenderWithProps(_props);
    _rendered = renderWithProps(_props);
  });

  it('Should render as a <select>.', () => {
    expect(_component.type).to.equal('select');
  });

  it('Should render 3 <option> with correct text and values.', function () {
    const options = TestUtils.scryRenderedDOMComponentsWithTag(_rendered, 'option');

    expect(options).to.have.length(3);
    expect(options[0].textContent).to.be.equal('Leanne Graham');
    expect(options[2].textContent).to.be.equal('Clementine Bauch');
    expect(options[0].value).to.be.equal('1');
    expect(options[2].value).to.be.equal('3');
  });

  it('Should trigger the callback by selecting the user', () => {
    let input = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'select');
    input.value = 2;
    TestUtils.Simulate.change(input);
    _spies.dispatch.should.have.been.called;
    _spies.onUserChosen.should.have.been.calledWith(2);
  });
});
