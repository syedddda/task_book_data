import { SAVE_BOOKS } from '../config/constants';

const initialState = {
      bids: {},
      asks: {}
};

function OrderBookReducer(state = initialState, action) {
  
  switch (action.type) {
    case SAVE_BOOKS:
      return {...state, ...action.payload }
    default:
      return state
  }

}

export default OrderBookReducer;
