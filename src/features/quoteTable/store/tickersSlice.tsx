import { createReducer } from '@reduxjs/toolkit';
import { QuoteTicker, QuoteTickerSymbol } from '../interfaces';
import tickersActions from './actions';

interface TickersState {
  data: QuoteTicker[],
  previousData: {
    [id: string]: QuoteTicker
  },
  symbols: {
    [id: string]: QuoteTickerSymbol
  }
}

export const initialTickersState: TickersState = {
  data: [],
  previousData: {},
  symbols: {}
}

const reducer = createReducer(initialTickersState, builder => {
  builder
    .addCase(tickersActions.tickers.set, ({ data }, { payload: tickersCache }) => {
      tickersCache.forEach(ticker => { data.push(ticker) });
    })
    .addCase(tickersActions.tickers.update, ({ data, previousData }, { payload: tickersCache }) => {
      Object.keys(previousData).forEach(id => delete previousData[id]);
  
      tickersCache.forEach(ticker => {
        const existIndex = data.findIndex(existTicker => existTicker.symbol === ticker.symbol);
        
        if (existIndex !== -1) {
          previousData[ticker.symbol] = { ...data[existIndex] };
          data[existIndex] = ticker;
        } else {
          data.push(ticker);
        }
      })
    })
    .addCase(tickersActions.symbols.set, ({ symbols }, { payload }) => {
      payload.forEach(symbol => {
        symbols[symbol.id] = symbol
      })
    })
});

const tickersSlice = {
  reducer,
  actions: tickersActions
}

export default tickersSlice;
