import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tickersSelector } from './store/selectors';
import QuoteTableView from './QuoteTableView';
import tickerQueue from './api/tickerQueue';
import { tickersWs } from './api/socketConnect';

export default function QuoteTable() {
  const dispatch = useDispatch();
  const tickersState = useSelector(tickersSelector);
  
  useEffect(() => {
    const ws = tickersWs();
    
    tickerQueue(ws, dispatch);
    
    return () => {
      ws.close();
    }
  }, [dispatch])
  
  return (
    <QuoteTableView
      data={ tickersState.data }
      previousData={ tickersState.previousData }
      symbolsMap={ tickersState.symbols }
    />
  )
}
