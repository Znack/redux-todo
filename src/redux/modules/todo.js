import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'

export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

// ------------------------------------
// Actions
// ------------------------------------

export const actions = {
  addTodo: createAction(ADD_TODO, (text) => text),
  completeTodo: createAction(COMPLETE_TODO, (index) => index),
  setVisibilityFilter: createAction(SET_VISIBILITY_FILTER, (value) => value)
}

// ------------------------------------
// Reducer methods
// ------------------------------------
export const addTodo = (state, { payload }) => {
  return {...state, todos: [...state.todos, {text: payload, completed: false}]}
}

export const completeTodo = (state, { payload }) => {
  return Object.assign({}, state, {todos: [
    ...state.todos.slice(0, payload),
    Object.assign({}, state.todos[payload], {completed: true}),
    ...state.todos.slice(payload + 1)
  ]})
}

export const setVisibilityFilter = (state, { payload }) => {
  return {
    ...state,
    visibilityFilter: payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [ADD_TODO]: addTodo,
  [COMPLETE_TODO]: completeTodo,
  [SET_VISIBILITY_FILTER]: setVisibilityFilter
}, {
  visibilityFilter: 'SHOW_ALL',
  todos: [{
    text: 'Complete me!',
    completed: false
  }]
})
