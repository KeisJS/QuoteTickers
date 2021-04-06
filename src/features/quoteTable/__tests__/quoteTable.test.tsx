import React from 'react';
import { render, screen } from '@testing-library/react';
import { byRole, byText } from 'testing-library-selector';
import QuoteTableView, { quoteTableClasses, QuoteTableViewProps } from '../QuoteTableView';
import { getMockQuoteTicker, getMockQuoteTickerSymbol } from '../utils';
import { QuoteTicker, QuoteTickerSymbol, QuoteTickerSymbolMap } from '../interfaces';

describe('Test QuoteTable', () => {
  let testTickers: QuoteTicker[];
  let previousData: QuoteTableViewProps['previousData'];
  let testTicker: QuoteTicker;
  let testTickerSymbol: QuoteTickerSymbol;
  let testSymbolMap: QuoteTickerSymbolMap;
  
  beforeEach(() => {
    testTicker = getMockQuoteTicker();
    testTickers = [testTicker];
    previousData = {
      [testTickers[0].symbol]: { ...testTickers[0], bid: '1000000', ask: '0.1' }
    };
    testTickerSymbol = getMockQuoteTickerSymbol(testTicker.symbol);
    testSymbolMap = {
      [testTickerSymbol.id]: testTickerSymbol
    }
  })
  
  it('Default use', () => {
    render(<QuoteTableView data={ testTickers } previousData={{}} symbolsMap={testSymbolMap} />);
  
    expect(byText(testTicker.last).query()).toBeInTheDocument();
  });
  
  it('Test dark theme', () => {
    render(<QuoteTableView data={ [] } previousData={{}} themeDark symbolsMap={testSymbolMap} />);
    
    expect(byRole('table').get()).toHaveClass(quoteTableClasses.dark.table);
  });
  
  it('Test previous data', () => {
    render(<QuoteTableView data={ testTickers } previousData={ previousData } symbolsMap={testSymbolMap} />);
    
    expect(byText(testTicker.bid).get()).toHaveClass(quoteTableClasses.cellValueDawn);
    expect(byText(testTicker.ask).get()).toHaveClass(quoteTableClasses.cellValueUp);
  })
})
