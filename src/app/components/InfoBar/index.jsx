import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';

export default () => {
    const { time, isTimeRunning } = useContext(Context);

    return time === 0 ? (
        <p>Začněte novou diskuzi...</p>
    ) : !isTimeRunning ? (
        <p>Diskuze je pozastavena (čas: {time} sekund)</p>
    ) : (
        <p>Diskuze běží {time} sekund.</p>
    );
};
