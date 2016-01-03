import { combineReducers } from 'redux';
import { routeReducer as router } from 'redux-simple-router';
import counter from './modules/counter';
import todo from './modules/todo';

export default combineReducers({
  counter,
  todo,
  router
});
