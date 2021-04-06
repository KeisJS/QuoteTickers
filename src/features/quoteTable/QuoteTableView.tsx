import React from 'react';
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

export const quoteTableClasses = {
  cellValueUp: 'text-success',
  cellValueDawn: 'text-danger',
  dark: {
    table: 'table-dark',
  }
}

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
      { data.map(ticker => (
        <tr key={ ticker.symbol }>
          { quoteTableFields.map(tableField => {
            let extClasses = '';
            let value = ticker[tableField.field];
            
            if (tableField.field === 'symbol') {
              let symbol = symbolsMap[ticker.symbol];
              value = `${symbol.baseCurrency} / ${symbol.feeCurrency}`;
            } else {
              if (previousData[ticker.symbol]) {
                switch (tableField.compare(ticker, previousData[ticker.symbol])) {
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
      ))}
      </tbody>
    </table>
  )
}
