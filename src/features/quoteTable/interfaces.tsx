export interface QuoteTicker {
  symbol: string,
  bid: string,
  ask: string,
  high: string,
  low: string,
  last: string,
}

export interface QuoteTickerSymbol {
  id: string
  baseCurrency: string,
  feeCurrency: string,
}

export interface QuoteTickerSymbolMap {
  [id: string]: QuoteTickerSymbol,
}
