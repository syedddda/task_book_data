import React, { useEffect, useState, useCallback } from 'react';
import { socketConnect } from './socketConnect';
import { connect } from 'react-redux';
import { saveBooks } from '../../actions/actions';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { formattedNumber, throttler, getComputed, getTotal } from '../../utils/utils';
import Loader from "react-loader-spinner";
import { APP_TEXT_DATA, SAVE_BOOK_THROTTLE_DELIMIT, BOOK_LIST_MAX_LIMIT } from '../../config/constants';

export const OrderBook = (props) => {
  const { orderbooks, orderbooks: { bids, asks } } = props;
  let { saveBook } = props;
  saveBook = useCallback(throttler(saveBook, SAVE_BOOK_THROTTLE_DELIMIT));

  const [scale, setScale] = useState(1.0);

  const decScale = () => setScale(scale + 0.1);
  const incScale = () => setScale(scale - 0.1);

  const [connectionStatus, setConnectionStatus] = useState(true);

  useEffect(() => {
    socketConnect({ orderbooks, saveBook, setConnectionStatus, connectionStatus });
  }, [orderbooks, connectionStatus, saveBook]);

  const _asks = asks && getComputed(asks, Object.keys(asks), BOOK_LIST_MAX_LIMIT);
  const maxAsksTotal = getTotal( _asks, Object.keys(_asks) );

  const _bids = bids && getComputed(bids, Object.keys(bids), BOOK_LIST_MAX_LIMIT);
  const maxBidsTotal = getTotal( _bids, Object.keys(_bids) );

  return (
    <div className="orderBookContainer">
      <div className="orderBook">
        <div className="flexContainer">
          <div className="orderBookHeader">
            <h4>
              { APP_TEXT_DATA.ORDER_BOOK } 
              <span> { APP_TEXT_DATA.BTC_USD }</span>
            </h4>
            <div className="orderBookZoom">
              <div className="orderBookIcon" onClick={decScale}><MdZoomOut /></div>
              <div className="orderBookIcon" onClick={incScale}><MdZoomIn /></div>
            </div>
          </div>
          {
            !Object.keys(_bids).length &&
            <div className="orderBookLoader">
              <Loader type="ThreeDots" color="#98e35d" height={40} width={40} />
            </div>
          }
          <div className="flexRowContainer">
            <div className="orderBookTable">
              {
                Object.keys(_bids).length ?
                <div className="tableHead">
                  <div className="tableRow">
                    <div className="tableCell count">{ APP_TEXT_DATA.COUNT }</div>
                    <div className="tableCell">{ APP_TEXT_DATA.AMOUNT }</div>
                    <div className="tableCell total">{ APP_TEXT_DATA.TOTAL }</div>
                    <div className="tableCell">{ APP_TEXT_DATA.PRICE }</div>
                  </div>
                </div>
                : null
              }
              <div className="tableBody">
                {_bids && Object.keys(_bids).map((bid, idx) => {
                  const item = _bids[bid]
                  const { count, amount, price, total } = item
                  const percentage = ((total * 100) / (maxBidsTotal * scale))
                  return (
                    <div
                      className="tableRow"
                      key={idx}
                    >
                      <div className="graphBar inverted" style={{width: `${Math.min(percentage, 100)}%`}}></div>
                      <div className="tableCell count">{count}</div>
                      <div className="tableCell">{amount.toFixed(2)}</div>
                      <div className="tableCell total">{total.toFixed(2)}</div>
                      <div className="tableCell">{formattedNumber(price.toFixed(0))}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="orderBookTable">
              {
                Object.keys(_asks).length ?
                <div className="tableHead">
                  <div className="tableRow">
                    <div className="tableCell">{ APP_TEXT_DATA.PRICE }</div>
                    <div className="tableCell total">{ APP_TEXT_DATA.TOTAL }</div>
                    <div className="tableCell">{ APP_TEXT_DATA.AMOUNT }</div>
                    <div className="tableCell count">{ APP_TEXT_DATA.COUNT }</div>
                  </div>
                </div>
                : null
              }
              <div className="tableBody">
                {_asks && Object.keys(_asks).map((ask) => {
                  const item = _asks[ask]
                  const { count, amount, price, total } = item
                  const percentage = (total * 100) / (maxAsksTotal * scale)
                  return (
                    <div 
                      className="tableRow"
                      key={`book-${count}${amount}${price}${total}`}
                    >
                      <div className="graphBar" style={{width: `${Math.min(percentage, 100)}%`}}></div>
                      <div className="tableCell">{formattedNumber(price.toFixed(0))}</div>
                      <div className="tableCell total">{total.toFixed(2)}</div>
                      <div className="tableCell">{amount.toFixed(2)}</div>
                      <div className="tableCell count">{count}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ( { orderbooks: state.orderbook } );
const mapDispatchToProps = (dispatch) => { 
  return {
    saveBook: (data) => {
      dispatch(saveBooks(data))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBook);
