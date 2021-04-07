import { createAction, PrepareAction } from '@reduxjs/toolkit';
import { QuoteTicker, QuoteTickerSymbol } from '../interfaces';

type SetUpdateTickersPayload = Map<string, QuoteTicker>;
export interface SortPayload {
  field: keyof QuoteTicker,
  type: 'up' | 'down'
}

interface CreateActionTickerPayload {
  (tickersMap: SetUpdateTickersPayload): ReturnType<PrepareAction<QuoteTicker[]>>;
}

function prepareTickersMap(tickersMap: SetUpdateTickersPayload) {
  const result: QuoteTicker[] = [];
  
  tickersMap.forEach(ticker => result.push(ticker));
  
  return {
    payload: result
  };
}

const tickersActions = {
  tickers: {
    set: createAction<CreateActionTickerPayload>('tickers/set', prepareTickersMap),
    update: createAction<CreateActionTickerPayload>('tickers/update', prepareTickersMap),
  },
  symbols: {
    set: createAction<QuoteTickerSymbol[]>('tickers/symbols/set')
  },
  toggleDarkTheme: createAction<void>('tickers/toggle/DarkTheme'),
  setSortType: createAction<SortPayload>('tickers/sortType/set'),
  toggleLimit: createAction<void>('tickers/toggle/limit50'),
}

export default tickersActions;
