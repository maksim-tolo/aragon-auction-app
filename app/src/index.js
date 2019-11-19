import React from 'react';
import ReactDOM from 'react-dom';
import { AragonApi } from '@aragon/api-react';
import App from './App';

const reducer = state => {
  if (state === null) {
    return {
      openTime: 0,
      startTime: 0,
      numberOfRounds: 0,
      createFirstRound: 0,
      createPerRound: 0,
      foundation: '',
      isSyncing: true,
      raised: 0,
      currentPrice: 0,
    };
  }

  return state;
};

ReactDOM.render(
  <AragonApi reducer={reducer}>
    <App />
  </AragonApi>,
  document.getElementById('root')
);
