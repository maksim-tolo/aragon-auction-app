import React, { useMemo } from 'react';
import { useAragonApi } from '@aragon/api-react';
import { Text, DataView } from '@aragon/ui';
import { toBN } from 'web3-utils';

import { formatCurrency, isEmpty } from '../../common/helper';
import { AUCTION_ROUNDS_PER_PAGE } from '../../common/constants';
import { getCurrentPrice } from '../../hooks/auction-round-price';
import AuctionClosing from '../../components/AuctionClosing';

function createRoundsByLength(length) {
  return Array.from({ length: length + 1 }, (v, k) => k);
}

function getUserBuys(currentRound, address, rounds) {
  const round = rounds[currentRound] || {};
  return round[address];
}

function getUserReward(price, userBuys) {
  if (!price || !userBuys || price === '0' || userBuys === '0') {
    return null;
  }

  const precision = 10000;
  const reward = toBN(userBuys)
    .mul(toBN(precision.toString()))
    .div(toBN(price))
    .toNumber() / precision
  return (
    Math.round(reward)
  );
}

function AuctionRounds({ style = {}, currentRound, ...props }) {
  const { appState } = useAragonApi();
  const {
    numberOfRounds,
    createFirstRound,
    createPerRound,
    totalRaisedByRound,
    account,
    rounds,
  } = appState;

  const allRounds = useMemo(
    () =>
      isEmpty(numberOfRounds) ? null : createRoundsByLength(numberOfRounds),
    [numberOfRounds]
  );

  return (
    <div style={{ wordBreak: 'break-all', ...style }} {...props}>
      {!isEmpty(currentRound) && !isEmpty(allRounds) && (
        <DataView
          fields={[
            { label: 'Round', align: 'start' },
            { label: 'Distributed, GGOL', align: 'end' },
            { label: 'Total, ETH', align: 'end' },
            { label: 'PRICE, ETH/GGOL', align: 'end' },
            { label: 'Closing', align: 'end' },
            { label: 'Your ETH', align: 'end' },
            { label: 'Your GGOL', align: 'end' },
          ]}
          entries={allRounds.map(round => {
            const raised = totalRaisedByRound[round];
            const currentPrice = getCurrentPrice(
              round,
              createFirstRound,
              createPerRound,
              raised
            );
            const userBuys = getUserBuys(round, account, rounds);
            const reward = getUserReward(currentPrice, userBuys);

            return [
              round,
              round === 0 ? createFirstRound : createPerRound,
              raised || '0',
              currentPrice || '0',
              userBuys || '0',
              reward || '0',
            ];
          })}
          renderEntry={([
            round,
            distributed,
            raised,
            currentPrice,
            userBuys,
            reward,
          ]) => [
            <Text>{round}</Text>,
            <Text>{distributed}</Text>,
            <Text>{formatCurrency(raised, 4)}</Text>,
            <Text>{formatCurrency(currentPrice, 5)}</Text>,
            <AuctionClosing currentRound={currentRound} round={round} />,
            <Text>{formatCurrency(userBuys, 0)}</Text>,
            <Text>{reward}</Text>,
          ]}
          mode="table"
          entriesPerPage={AUCTION_ROUNDS_PER_PAGE}
        />
      )}
    </div>
  );
}

export default AuctionRounds;
