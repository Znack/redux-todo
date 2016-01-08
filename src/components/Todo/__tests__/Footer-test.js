import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { bindActionCreators } from 'redux';
import Footer from '../Footer';

function shallowRender (component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<Footer {...props} />);
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<Footer {...props} />);
}

describe('(Component) Footer', () => {
  let _component, _rendered, _props, _spies;

  beforeEach(() => {
    _spies = {};
    _props = {
      filter: 'SHOW_ALL',  // SHOW_COMPLETED
      ...bindActionCreators({
        onFilterChange: (_spies.onFilterChange = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    };
    _component = shallowRenderWithProps(_props);
    _rendered = renderWithProps(_props);
  });

  it('Should render as a <p>.', () => {
    expect(_component.type).to.equal('p');
  });

  it('Should have two links and one simple text.', () => {
    const links = TestUtils.scryRenderedDOMComponentsWithTag(_rendered, 'a');
    const span = TestUtils.scryRenderedDOMComponentsWithTag(_rendered, 'span');

    expect(links).to.have.length(2);
    expect(span).to.have.length(1);
  });

  it('Should trigger the callback by click on filter link', () => {
    const links = TestUtils.scryRenderedDOMComponentsWithTag(_rendered, 'a');
    TestUtils.Simulate.click(links[0]);
    _spies.dispatch.should.have.been.called;
    _spies.onFilterChange.should.have.been.calledWith('SHOW_COMPLETED');
  });
});
