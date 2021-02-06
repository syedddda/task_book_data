import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import OrderBookReducer from '../reducer/reducer';
import { loadState, saveState, throttler } from '../utils/utils';
import { LOCAL_STORAGE_THROTTLE_DELIMIT } from '../config/constants';

const middleware = [ reduxThunk ];

const reducers = combineReducers({
  orderbook: OrderBookReducer
})

const persistedState = loadState();

const store = createStore(
    reducers,
    persistedState,
    compose(
      applyMiddleware(...middleware)
    )
)

store.subscribe(throttler(() => {
  saveState(store.getState());
}, LOCAL_STORAGE_THROTTLE_DELIMIT));

export default store;

