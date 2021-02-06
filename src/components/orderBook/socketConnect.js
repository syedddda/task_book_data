import { SOCKET_HOST } from '../../config/config';

const pair = "BTCUSD"

let BOOK = {};

let connected = false;
let connecting = false;

let socketConnection;
let channels = {};
let count = 0;
let messageCount = 0;

function socketConnect ({ saveBook, setConnectionStatus, connectionStatus }) {

  if(!connecting && !connected) {
    socketConnection = new WebSocket(SOCKET_HOST);
  }

  if(!connectionStatus){ 
    socketConnection.close(); 
    return;
  }

  if (connecting || connected) {
    return;
  }

  connecting = true;

  socketConnection.onopen =  function open () {
    console.log('WS open');
    connecting = false;
    connected = true;
    setConnectionStatus(true);

    BOOK.bids = {};
    BOOK.asks = {};

    socketConnection.send(JSON.stringify({ event: 'subscribe', channel: 'book', pair: pair, len: 25 }));
  }

  socketConnection.onclose = function open () {
    console.log('WS close');
    connecting = false;
    connected = false;
    setConnectionStatus(false);
  }

  socketConnection.onmessage = function (message_event) {
    let msg = message_event.data;
    msg = JSON.parse(msg);

    if(msg.event === "subscribed") {
      channels[msg.channel] = msg.chanId;
      console.log({channels});
    }

    count++;
    if( count < 5 ) {
      console.log( 'message_event : ', msg );
    } 

    if(msg.event) {
      return;
    }

    const bookChannelId = msg[0];
        
    if(bookChannelId === channels['book']){

      if (messageCount === 0) {

        let bookData = msg[1];

        bookData.forEach( (eachBook) => {
          eachBook = { price: eachBook[0], count: eachBook[1], amount: eachBook[2] };
          let side = eachBook.amount >= 0 ? 'bids' : 'asks';
          eachBook.amount = Math.abs(eachBook.amount);
          BOOK[side][eachBook.price] = eachBook;
        });

      } else {
        msg = msg[1];

        let eachBook = { price: msg[0], count: msg[1], amount: msg[2] }

        if (!eachBook.count) {

          if (eachBook.amount > 0) {
            if (BOOK['bids'][eachBook.price]) {
              delete BOOK['bids'][eachBook.price];
            } 
          } else if (eachBook.amount < 0) {
            if (BOOK['asks'][eachBook.price]) {
              delete BOOK['asks'][eachBook.price];
            }
          }

        } else {
          let side = eachBook.amount >= 0 ? 'bids' : 'asks';
          eachBook.amount = Math.abs(eachBook.amount);
          BOOK[side][eachBook.price] = eachBook;
        }
      }

      messageCount++;
      saveBook(BOOK);
    }
  }
}

export {connected, socketConnect}
