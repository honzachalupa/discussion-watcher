import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';

export default () => {
    const { time, isTimerRunning } = useContext(Context);

    return time === 0 ? (
        <p>Přidejte členy a začněte novou diskuzi...</p>
    ) : !isTimerRunning ? (
        <p>Diskuze je pozastavena (čas: {time} sekund)</p>
    ) : (
        <p>Diskuze běží {time} sekund.</p>
    );
};
