import React, { useEffect, useState, memo } from 'react';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject, Observable, pipe } from 'rxjs';
import { observeOn } from 'rxjs/operators';

enum REQUEST_IDS {
  getSymbols= 'getSymbols',
  subscribeTicker = 'subscribeTicker'
}

interface SymbolData {
  id: string
  baseCurrency: string,
  feeCurrency: string,
}

interface SymbolRequestResponse {
  id: REQUEST_IDS.getSymbols,
  result?: SymbolData[],
  method?: string
}

interface TickerSubscribeRequestResponse {
  id: REQUEST_IDS.subscribeTicker,
  method: string,
  params?: any,
}

interface TickerData {
  symbol: string,
  number: {
    // bid: number,
    // ask: number,
    // high: number,
    // low: number,
    // last: number,
  },
  string: {
    bid: string,
    ask: string,
    high: string,
    low: string,
    last: string,
  }
}

interface TickerResponse {
  method: 'ticker',
  params: {
    symbol: string,
    bid: string,
    ask: string,
    high: string,
    low: string,
    last: string,
  }
}

type WebsocketData = SymbolRequestResponse | TickerSubscribeRequestResponse | TickerResponse;

function tickerGuard(msg: WebsocketData): msg is TickerResponse {
  return msg.method === 'ticker';
}

function normalizeTickerResponse(msg: TickerResponse['params']): TickerData {
  const { symbol, ...rest } = msg;
  
  return {
    symbol: msg.symbol,
    string: rest,
    number: {
      // bid: Number(msg.bid),
      // ask: Number(msg.ask),
      // high: Number(msg.high),
      // low: Number(msg.low),
      // last: Number(msg.last)
    }
  }
}

const TickerRow = memo((props: {
  symbol: string,
  bid: string,
  ask: string,
  high: string,
  low: string,
  last: string,
}) => {
  return (
    <tr>
      <td>{ props.symbol }</td>
      <td>{ props.bid }</td>
      <td>{ props.ask }</td>
      <td>{ props.high }</td>
      <td>{ props.low }</td>
      <td>{ props.last }</td>
    </tr>
  )
})
const apiUrl = 'wss://api.exchange.bitcoin.com/api/2/ws';

const requestSymbols = {
  id: REQUEST_IDS.getSymbols,
  method: 'getSymbols'
}

const tickerCache = new Map();
const initData: TickerData[] = [];
let dataLength: number;
let initialized = false;

export default function Prototype() {
  const [data, setData] = useState<TickerData[]>([]);
  
  useEffect(() => {

    const webSocketSubject = webSocket<WebsocketData>(apiUrl);

    const queue = webSocketSubject.pipe(
      websocket => new Observable(observer => {
        const subscription = websocket.subscribe(msg => {
          if (tickerGuard(msg)) {
              const ticker = normalizeTickerResponse(msg.params);

              if (initialized) {
                tickerCache.set(ticker.symbol, ticker);
              } else {
                const existTickerIndex = initData.findIndex(curTicker => curTicker.symbol === ticker.symbol);

                if (existTickerIndex !== -1) {
                  initData.splice(existTickerIndex, 1, ticker);
                } else {
                  initData.push(ticker);
                }

                if (initData.length === dataLength) {
                  initialized = true;
                  setData(initData);
                }
              }
            } else {
            switch (msg.id) {
              case REQUEST_IDS.getSymbols:
                dataLength = (msg.result as SymbolData[]).length;
                
                msg.result?.forEach(symbolData => {
                  (websocket as WebSocketSubject<WebsocketData>).next({
                    id: REQUEST_IDS.subscribeTicker,
                    method: REQUEST_IDS.subscribeTicker,
                    params: {
                      symbol: symbolData.id
                    }
                  })
                })
                break;
              case REQUEST_IDS.subscribeTicker:
                // console.log({ msg })
                // subscription.unsubscribe();
                break;
            }
          }
        });

        (websocket as WebSocketSubject<WebsocketData>).next(requestSymbols);
      })
    );

    queue.subscribe();
  }, [])
  
  // useEffect(() => {
  //   const webSocket = new WebSocket(apiUrl);
  //
  //   webSocket.addEventListener('open', () => {
  //     webSocket.send(JSON.stringify(requestSymbols));
  //   });
  //
  //   const initData: TickerData[] = [];
  //   let dataLength: number;
  //   let initialized = false;
  //
  //   webSocket.addEventListener('message', event => {
  //     const msg = JSON.parse(event.data) as WebsocketData;
  //
  //     if (tickerGuard(msg)) {
  //       const ticker = normalizeTickerResponse(msg.params);
  //
  //       if (initialized) {
  //         tickerCache.set(ticker.symbol, ticker);
  //       } else {
  //         const existTickerIndex = initData.findIndex(ticker => ticker.symbol === msg.params.symbol);
  //
  //         if (existTickerIndex !== -1) {
  //           initData.splice(existTickerIndex, 1, ticker);
  //         } else {
  //           initData.push(ticker);
  //         }
  //
  //         if (initData.length === dataLength) {
  //           initialized = true;
  //           setData(initData);
  //         }
  //       }
  //     } else {
  //       if (msg.id === REQUEST_IDS.getSymbols) {
  //         dataLength = (msg.result as SymbolData[]).length;
  //
  //         (msg.result as SymbolData[]).forEach(symbolData => {
  //           webSocket.send(JSON.stringify({
  //             id: REQUEST_IDS.subscribeTicker + symbolData.id,
  //             method: REQUEST_IDS.subscribeTicker,
  //             params: {
  //               symbol: symbolData.id
  //             }
  //           }))
  //         })
  //       }
  //     }
  //   });
  // }, [setData]);
  
  useEffect(() => {
    window.setInterval(() => {
      if (tickerCache.size === 0) {
        return;
      }
    
      setData(lastData => {
        const result = [...lastData];
      
        tickerCache.forEach(msgTicker => {
          const existTickerIndex = result.findIndex(ticker => ticker.symbol === msgTicker.symbol);
        
          result.splice(existTickerIndex, 1, msgTicker);
        });
      
      
        result.sort((a, b) => {
          const lastA = Number(a.string.last);
          const lastB = Number(b.string.last);
        
          if (lastA < lastB) {
            return 1
          } else if (lastA > lastB) {
            return -1
          }
        
          return 0;
        })
      
        return result;
      })
    }, 34)
  }, [setData]);
  
  return (
    <table className="table table-striped">
      <thead>
      {/*<tr>*/}
      {/*  <th scope="col">#</th>*/}
      {/*  <th scope="col">First</th>*/}
      {/*  <th scope="col">Last</th>*/}
      {/*  <th scope="col">Handle</th>*/}
      {/*</tr>*/}
      </thead>
      <tbody>
      { data.slice(0, 49).map(data => (
        <TickerRow key={data.symbol} {...{ symbol: data.symbol, ...data.string }} />
      ))}
      </tbody>
    </table>
  )
}
