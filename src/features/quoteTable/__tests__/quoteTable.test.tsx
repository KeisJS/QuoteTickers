import React from 'react';
import { render, screen } from '@testing-library/react';
import { byRole, byText } from 'testing-library-selector';
import QuoteTableView, { quoteTableClasses, QuoteTableViewProps } from '../QuoteTableView';
import getMockQuoteTicker from '../utils/getMockQuoteTicker';
import quoteTableFields from '../tableFields';
import { QuoteTicker } from '../interfaces';

describe('Test QuoteTable', () => {
  let testTickers: QuoteTicker[];
  let previousData: QuoteTableViewProps['previousData'];
  let testTicker: QuoteTicker;
  
  beforeEach(() => {
    testTicker = getMockQuoteTicker();
    testTickers = [testTicker];
    previousData = {
      [testTickers[0].symbol]: { ...testTickers[0], bid: '1000000', ask: '0.1' }
    }
  })
  
  it('Default use', () => {
    render(<QuoteTableView data={ testTickers } previousData={{}}  />);
    
    quoteTableFields.forEach(field => {
      expect(byText(testTicker[field.field]).query()).toBeInTheDocument();
    })
  });
  
  it('Test dark theme', () => {
    render(<QuoteTableView data={ [] } previousData={{}} themeDark  />);
    
    expect(byRole('table').get()).toHaveClass(quoteTableClasses.dark.table);
  });
  
  it('Test previous data', () => {
    render(<QuoteTableView data={ testTickers } previousData={ previousData } />);
    
    expect(byText(testTicker.bid).get()).toHaveClass(quoteTableClasses.cellValueDawn);
    expect(byText(testTicker.ask).get()).toHaveClass(quoteTableClasses.cellValueUp);
  })
})
