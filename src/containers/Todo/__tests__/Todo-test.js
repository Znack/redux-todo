import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { bindActionCreators } from 'redux';
import { Todo, mapStateToProps } from '../Todo';
import AddTodo from '../../../components/Todo/AddTodo';
import TodoList from '../../../components/Todo/TodoList';
import Footer from '../../../components/Todo/Footer';

function shallowRender (component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function renderWithProps (props = {}) {
  return TestUtils.renderIntoDocument(<Todo {...props} />);
}

function shallowRenderWithProps (props = {}) {
  return shallowRender(<Todo {...props} />);
}

describe('(View) Todo', function () {
  let _component, _rendered, _props, _spies;

  beforeEach(function () {
    _spies = {};
    _props = {
      users: [{
        id: 1,
        name: 'Vasya'
      }, {
        id: 2,
        name: 'Petya'
      }],
      currentUser: 1,
      visibleTodos: [{
        text: 'Complete me!',
        userId: 1,
        completed: false
      }],
      visibilityFilter: 'SHOW_ALL',
      ...bindActionCreators({
        fetchUsers: (_spies.fetchUsers = sinon.spy()),
        changeUser: (_spies.changeUser = sinon.spy()),
        fetchTodos: (_spies.fetchTodos = sinon.spy()),
        addTodo: (_spies.addTodo = sinon.spy()),
        completeTodo: (_spies.completeTodo = sinon.spy()),
        setVisibilityFilter: (_spies.setVisibilityFilter = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    };

    _component = shallowRenderWithProps(_props);
    _rendered = renderWithProps(_props);
  });

  it('Should render as a <div>.', function () {
    expect(_component.type).to.equal('div');
  });

  it('Should include an <h1> with welcome text.', function () {
    const h1 = TestUtils.findRenderedDOMComponentWithTag(_rendered, 'h1');

    expect(h1).to.exist;
    expect(h1.textContent).to.match(/React Redux Starter Kit's Todo/);
  });

  it('Should dispatch fetchTodos action.', function () {
    _spies.dispatch.should.have.been.called;
    _spies.fetchTodos.should.have.been.called;
  });

  it('Should render AddTodo Component.', function () {
    const AddTodoComponent = TestUtils.findRenderedComponentWithType(_rendered, AddTodo);

    expect(AddTodoComponent).to.exist;
    expect(AddTodoComponent.props).to.exist;
    expect(AddTodoComponent.props.onAddClick).to.be.a('function');
  });

  it('Should render TodoList Component.', function () {
    const TodoListComponent = TestUtils.findRenderedComponentWithType(_rendered, TodoList);

    expect(TodoListComponent).to.exist;
    expect(TodoListComponent.props).to.exist;
    expect(TodoListComponent.props.todos).to.eql([{
      text: 'Complete me!',
      userId: 1,
      completed: false
    }]);
    expect(TodoListComponent.props.onTodoClick).to.be.a('function');
  });

  it('Should render Footer Component.', function () {
    const FooterComponent = TestUtils.findRenderedComponentWithType(_rendered, Footer);

    expect(FooterComponent).to.exist;
    expect(FooterComponent.props).to.exist;
    expect(FooterComponent.props.filter).to.be.equal('SHOW_ALL');
    expect(FooterComponent.props.onFilterChange).to.be.a('function');
  });

  describe('mapStateToProps function', function () {
    it('Should correctly map state to props.', function () {
      const state = {
        justAnotherBlock: {
          currentUser: 2,
          users: [{id: -1, name: 'Unreal user'}],
          visibilityFilter: 'INCORRECT_FILTER',
          todos: undefined
        },
        todo: {
          currentUser: 2,
          users: [
            {id: 1, name: 'Leanne Graham'},
            {id: 2, name: 'Ervin Howell'},
            {id: 3, name: 'Clementine Bauch'}
          ],
          visibilityFilter: 'SHOW_ACTIVE',
          todos: [
            {text: 'First', userId: 2, completed: true},
            {text: 'Second', userId: 1, completed: true},
            {text: 'Third', userId: 2, completed: false},
            {text: 'Forth', userId: 4, completed: false},
            {text: 'Fifth', userId: 2, completed: false}
          ]
        }
      };
      const props = mapStateToProps(state);

      expect(props).to.be.eql({
        users: [
          {id: 1, name: 'Leanne Graham'},
          {id: 2, name: 'Ervin Howell'},
          {id: 3, name: 'Clementine Bauch'}
        ],
        currentUser: 2,
        visibleTodos: [
          {text: 'Third', userId: 2, completed: false},
          {text: 'Fifth', userId: 2, completed: false}
        ],
        visibilityFilter: 'SHOW_ACTIVE'
      });
    });
  });
});
