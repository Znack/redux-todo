import { createAction, handleActions } from 'redux-actions';
import superagent from 'superagent';
import promisify from 'superagent-promise';

const request = promisify(superagent, Promise);

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';

export const REQUEST_TODOS = 'REQUEST_TODOS';
export const RECEIVE_TODOS = 'RECEIVE_TODOS';
export const ADD_TODO = 'ADD_TODO';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

// ------------------------------------
// Actions
// ------------------------------------

export const actions = {
  fetchTodos: () => {
    return (dispatch) => {
      dispatch({type: REQUEST_TODOS});
      return request
        .get('http://jsonplaceholder.typicode.com/todos')
        .end()
        .then(res => res.body)
        .then(todos => todos.map(todo => { return {text: todo.title, completed: todo.completed}; }))
        .then(todos => todos.slice(0, 5))
        .then(todos => {
          dispatch(actions.receiveTodos(todos));
        });
    };
  },
  receiveTodos: createAction(RECEIVE_TODOS, (todos) => {
    if (todos instanceof Array) return todos;
    else throw new Error('Expected todos to be Array, but got: ${todos}');
  }),
  addTodo: createAction(ADD_TODO),
  completeTodo: createAction(COMPLETE_TODO),
  setVisibilityFilter: createAction(SET_VISIBILITY_FILTER)
};

// ------------------------------------
// Reducer methods
// ------------------------------------
export const fetchTodos = (state) => {
  return {...state, todosIsLoading: true};
};

export const receiveTodos = (state, { payload }) => {
  return {...state, todosIsLoading: false, todos: payload};
};

export const addTodo = (state, { payload }) => {
  return {...state, todos: [...state.todos, {text: payload, completed: false}]};
};

export const completeTodo = (state, { payload }) => {
  return Object.assign({}, state, {todos: [
    ...state.todos.slice(0, payload),
    Object.assign({}, state.todos[payload], {completed: true}),
    ...state.todos.slice(payload + 1)
  ]});
};

export const setVisibilityFilter = (state, { payload }) => {
  return {
    ...state,
    visibilityFilter: payload
  };
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_TODOS]: fetchTodos,
  [RECEIVE_TODOS]: receiveTodos,
  [ADD_TODO]: addTodo,
  [COMPLETE_TODO]: completeTodo,
  [SET_VISIBILITY_FILTER]: setVisibilityFilter
}, {
  visibilityFilter: 'SHOW_ALL',
  todos: []
});
