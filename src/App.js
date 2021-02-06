import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import OrderBook from './components/orderBook';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './App.scss';

function App() {
  return (
     <Provider store={store}>
        <OrderBook />
    </Provider>
  )
}

export default App;
