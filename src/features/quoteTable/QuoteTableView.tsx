import React from 'react';
import { QuoteTicker } from './interfaces';
import quoteTableFields from './tableFields';

export interface QuoteTableViewProps {
  data: QuoteTicker[],
  previousData: {
    [symbolId: string]: QuoteTicker
  },
  themeDark?: boolean
}

export const quoteTableClasses = {
  cellValueUp: 'text-success',
  cellValueDawn: 'text-danger',
  dark: {
    table: 'table-dark',
  }
}

export default function QuoteTableView({ data, previousData, themeDark }: QuoteTableViewProps) {
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
            
            return (
              <td key={ tableField.field } className={ extClasses }>{ ticker[tableField.field] }</td>
            )
          })}
        </tr>
      ))}
      </tbody>
    </table>
  )
}
