import { createAction } from '@reduxjs/toolkit';
import { QuoteTicker, QuoteTickerSymbol } from '../interfaces';

type SetUpdateTickersPayload = Map<string, QuoteTicker>;

const tickersActions = {
  tickers: {
    set: createAction<SetUpdateTickersPayload>('tickers/set'),
    update: createAction<SetUpdateTickersPayload>('tickers/update'),
  },
  symbols: {
    set: createAction<QuoteTickerSymbol[]>('tickers/symbols/set')
  }
}

export default tickersActions;
