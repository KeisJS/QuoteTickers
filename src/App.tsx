import React from 'react';
import './App.css';
import QuoteTable from './features/quoteTable/QuoteTableContainer';

function App() {
  return (
    <div className='container-lg'>
      <div className='row'>
        <div className='col-12'>
          <QuoteTable />
        </div>
      </div>
    </div>
  );
}

export default App;
