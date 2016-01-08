import {
  default as reducer,
  actions,
  REQUEST_USERS,
  RECEIVE_USERS,
  REQUEST_TODOS,
  RECEIVE_TODOS,
  REQUEST_ADD_TODO,
  RESPOND_ADD_TODO,
  COMPLETE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from '../todo';
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

  it('should try to fetch users on REQUEST_USERS action.', (done) => {
    const mockUsers = [
      {
        'id': 1,
        'name': 'Leanne Graham',
        'username': 'Bret',
        'email': 'Sincere@april.biz',
        'address': {
          'street': 'Kulas Light',
          'suite': 'Apt. 556',
          'city': 'Gwenborough',
          'zipcode': '92998-3874',
          'geo': {
            'lat': '-37.3159',
            'lng': '81.1496'
          }
        },
        'phone': '1-770-736-8031 x56442',
        'website': 'hildegard.org',
        'company': {
          'name': 'Romaguera-Crona',
          'catchPhrase': 'Multi-layered client-server neural-net',
          'bs': 'harness real-time e-markets'
        }
      },
      {
        'id': 2,
        'name': 'Ervin Howell',
        'username': 'Antonette',
        'email': 'Shanna@melissa.tv',
        'address': {
          'street': 'Victor Plains',
          'suite': 'Suite 879',
          'city': 'Wisokyburgh',
          'zipcode': '90566-7771',
          'geo': {
            'lat': '-43.9509',
            'lng': '-34.4618'
          }
        },
        'phone': '010-692-6593 x09125',
        'website': 'anastasia.net',
        'company': {
          'name': 'Deckow-Crist',
          'catchPhrase': 'Proactive didactic contingency',
          'bs': 'synergize scalable supply-chains'
        }
      }
    ];
    const expectedActions = [
      { type: REQUEST_USERS },
      { type: RECEIVE_USERS, payload: mockUsers.map(user => { return {id: user.id, name: user.name}; }) }
    ];
    const store = mockStore({ users: [] }, expectedActions, done);
    store.dispatch(actions.fetchUsers());
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.be.equal('http://jsonplaceholder.typicode.com/users');
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(mockUsers));
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
      { type: RECEIVE_TODOS, payload: mockTodos.map(todo => { return {text: todo.title, completed: todo.completed, userId: todo.userId}; }) }
    ];
    const store = mockStore({ currentUser: 1, todos: [] }, expectedActions, done);
    store.dispatch(actions.fetchTodos());
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.be.equal('http://jsonplaceholder.typicode.com/todos');
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(mockTodos));
  });

  it('should return function after ADD_TODO action and call dispatch within it.', (done) => {
    const mockTodo = {
      userId: 1,
      id: 201,
      title: 'quis ut nam facilis et officia qui',
      completed: false
    };
    const expectedActions = [
      { type: REQUEST_ADD_TODO },
      { type: RESPOND_ADD_TODO, payload: mockTodo}
    ];
    const store = mockStore({ currentUser: 1, todos: [] }, expectedActions, done);
    store.dispatch(actions.addTodo());
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.be.equal('http://jsonplaceholder.typicode.com/todos');
    requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(mockTodo));
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
      currentUser: 1,
      users: [],
      visibilityFilter: 'SHOW_ALL',
      todos: []
    });
  });

  it('should change usersIsLoading on REQUEST_USERS', () => {
    expect(
      reducer(
        {todos: [], users: [], currentUser: 1, usersIsLoading: false},
        {type: REQUEST_USERS}
      )
    ).to.eql({todos: [], users: [], currentUser: 1, usersIsLoading: true});
  });

  it('should change users list on RECEIVE_USERS', () => {
    expect(
      reducer(
        {todos: [], users: [], currentUser: 1, usersIsLoading: true},
        actions.receiveUsers([{id: 1, name: 'Leanne Graham'}, {id: 2, name: 'Ervin Howell'}]))
    ).to.eql({
      todos: [],
      users: [{id: 1, name: 'Leanne Graham'}, {id: 2, name: 'Ervin Howell'}],
      currentUser: 1,
      usersIsLoading: false
    });
  });

  it('should change currentUser on CHANGE_USER', () => {
    expect(
      reducer({todos: [], users: [{id: 1, name: 'Leanne Graham'}, {id: 2, name: 'Ervin Howell'}], currentUser: 1}, actions.changeUser(2))
    ).to.eql({
      todos: [],
      users: [{id: 1, name: 'Leanne Graham'}, {id: 2, name: 'Ervin Howell'}],
      currentUser: 2
    });
  });

  it('should handle ADD_TODO to initial', () => {
    expect(
      reducer({todos: [], currentUser: 1}, actions.addTodo('Run the tests'))
    ).to.eql({currentUser: 1, todos: [{
      text: 'Run the tests',
      userId: 1,
      completed: false
    }]});
  });

  it('should handle ADD_TODO to already existing', () => {
    expect(
      reducer({currentUser: 1, todos: [{
        text: 'Use Redux',
        userId: 1,
        completed: false
      }]}, actions.addTodo('Run the tests'))
    ).to.eql({currentUser: 1, todos: [
      {
        text: 'Use Redux',
        userId: 1,
        completed: false
      },
      {
        text: 'Run the tests',
        userId: 1,
        completed: false
      }
    ]});
  });

  it('should handle COMPLETE_TODO for second todo', () => {
    expect(
      reducer({currentUser: 1, todos: [{
        text: 'First',
        userId: 1,
        completed: false
      }, {
        text: 'Second',
        userId: 1,
        completed: false
      }, {
        text: 'Third',
        userId: 1,
        completed: false
      }]}, actions.completeTodo(1))
    ).to.eql({currentUser: 1, todos: [
      {
        text: 'First',
        userId: 1,
        completed: false
      }, {
        text: 'Second',
        userId: 1,
        completed: true
      }, {
        text: 'Third',
        userId: 1,
        completed: false
      }
    ]});
  });

  it('should handle SET_VISIBILITY_FILTER to be "SHOW_COMPLETED"', () => {
    expect(
      reducer({
        currentUser: 1,
        visibilityFilter: VisibilityFilters.SHOW_ALL,
        todos: [{
          text: 'First',
          userId: 1,
          completed: false
        }, {
          text: 'Second',
          userId: 1,
          completed: false
        }]
      }, actions.setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))
    ).to.eql({
      currentUser: 1,
      visibilityFilter: VisibilityFilters.SHOW_COMPLETED,
      todos: [{
        text: 'First',
        userId: 1,
        completed: false
      }, {
        text: 'Second',
        userId: 1,
        completed: false
      }]
    });
  });
});
