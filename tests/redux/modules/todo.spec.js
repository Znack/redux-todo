import {
  default as reducer,
  actions,
  REQUEST_TODOS,
  RECEIVE_TODOS,
  ADD_TODO,
  COMPLETE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
  } from '../../../src/redux/modules/todo';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([ thunk ]);

describe('(Action) todos actions:', () => {
  var xhr, requests;
  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = (req) => requests.push(req);
  });
  afterEach(() => {
    // Like before we must clean up when tampering with globals.
    xhr.restore();
  });

  it('should return function after REQUEST_TODOS action and call dispatch within it.', (done) => {
    const mockTodos = [
      {
        userId: 1,
        id: 2,
        title: 'quis ut nam facilis et officia qui',
        completed: false
      },
      {
        userId: 1,
        id: 1,
        title: 'delectus aut autem',
        completed: false
      }
    ];
    const expectedActions = [
      { type: REQUEST_TODOS },
      { type: RECEIVE_TODOS, payload: mockTodos.map(todo => { return {text: todo.title, completed: todo.completed}; }) }
    ];
    const store = mockStore({ todos: [] }, expectedActions, done);
    store.dispatch(actions.fetchTodos());
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.be.equal('http://jsonplaceholder.typicode.com/todos');
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(mockTodos));
  });

  it('should return correct ADD_TODO action', () => {
    expect(actions.addTodo('Run the tests')).to.eql({
      type: ADD_TODO,
      payload: 'Run the tests'
    });
  });

  it('should return correct COMPLETE_TODO action', () => {
    expect(actions.completeTodo(3)).to.eql({
      type: COMPLETE_TODO,
      payload: 3
    });
  });

  it('should return correct SET_VISIBILITY_FILTER action', () => {
    expect(actions.setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED)).to.eql({
      type: SET_VISIBILITY_FILTER,
      payload: VisibilityFilters.SHOW_COMPLETED
    });
  });
});

describe('(Reducer) todos reducers:', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.eql({
      visibilityFilter: 'SHOW_ALL',
      todos: []
    });
  });

  it('should handle ADD_TODO to initial', () => {
    expect(
      reducer({todos: []}, actions.addTodo('Run the tests'))
    ).to.eql({todos: [{
      text: 'Run the tests',
      completed: false
    }]});
  });

  it('should handle ADD_TODO to already existing', () => {
    expect(
      reducer({todos: [{
        text: 'Use Redux',
        completed: false
      }]}, actions.addTodo('Run the tests'))
    ).to.eql({todos: [
      {
        text: 'Use Redux',
        completed: false
      },
      {
        text: 'Run the tests',
        completed: false
      }
    ]});
  });

  it('should handle COMPLETE_TODO for second todo', () => {
    expect(
      reducer({todos: [{
        text: 'First',
        completed: false
      }, {
        text: 'Second',
        completed: false
      }, {
        text: 'Third',
        completed: false
      }]}, actions.completeTodo(1))
    ).to.eql({todos: [
      {
        text: 'First',
        completed: false
      }, {
        text: 'Second',
        completed: true
      }, {
        text: 'Third',
        completed: false
      }
    ]});
  });

  it('should handle SET_VISIBILITY_FILTER to be "SHOW_COMPLETED"', () => {
    expect(
      reducer({
        visibilityFilter: 'SHOW_ALL',
        todos: [{
          text: 'First',
          completed: false
        }, {
          text: 'Second',
          completed: false
        }]
      }, actions.setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))
    ).to.eql({
      visibilityFilter: VisibilityFilters.SHOW_COMPLETED,
      todos: [{
        text: 'First',
        completed: false
      }, {
        text: 'Second',
        completed: false
      }]
    });
  });
});
