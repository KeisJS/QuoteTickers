import React, { memo } from 'react';
import { QuoteTicker, QuoteTickerSymbol } from './interfaces';
import quoteTableFields from './tableFields';

export interface QuoteTableViewProps {
  data: QuoteTicker[],
  previousData: {
    [symbolId: string]: QuoteTicker
  },
  themeDark?: boolean,
  symbolsMap: {
    [id: string]: QuoteTickerSymbol
  }
}

interface QuoteTableRow {
  ticker: QuoteTicker,
  previousTicker: null | QuoteTicker,
  symbol: QuoteTickerSymbol,
}

export const quoteTableClasses = {
  cellValueUp: 'text-success',
  cellValueDawn: 'text-danger',
  dark: {
    table: 'table-dark',
  }
}

const QuoteTableRow = memo(({ ticker, previousTicker, symbol }:QuoteTableRow ) => {
  return (
    (
      <tr key={ ticker.symbol }>
        { quoteTableFields.map(tableField => {
          let extClasses = '';
          let value = ticker[tableField.field];
        
          if (tableField.field === 'symbol') {
            value = `${symbol.baseCurrency} / ${symbol.feeCurrency}`;
          } else {
            if (previousTicker !== null) {
              switch (tableField.compare(ticker, previousTicker)) {
                case -1:
                  extClasses = quoteTableClasses.cellValueDawn;
                  break;
                case 1:
                  extClasses = quoteTableClasses.cellValueUp;
                  break;
              }
            }
          }
        
          return (
            <td key={ tableField.field } className={ extClasses }>{ value }</td>
          )
        })}
      </tr>
    )
  )
})

export default function QuoteTableView({ data, previousData, themeDark, symbolsMap }: QuoteTableViewProps) {
  return (
    <table className={ `table table-striped ${ themeDark ? quoteTableClasses.dark.table : '' }` }>
      <thead>
        <tr>
          { quoteTableFields.map(tableField => (
            <th key={ tableField.field }>{ tableField.title }</th>
          ))}
        </tr>
      </thead>
      <tbody>
      { data.map(ticker => {
        const previousTicker = previousData[ticker.symbol] || null;
        const symbol = symbolsMap[ticker.symbol];
        
        return (
          <QuoteTableRow
            key={ ticker.symbol }
            ticker={ ticker }
            previousTicker={ previousTicker }
            symbol={ symbol }
          />
        )
      })}
      </tbody>
    </table>
  )
}
