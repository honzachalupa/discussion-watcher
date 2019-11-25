import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';

export default () => {
    const { time, timeFormatted, defaultTime, isTimerRunning } = useContext(Context);

    return time === defaultTime ? (
        <p>Přidejte členy a začněte novou diskuzi...</p>
    ) : !isTimerRunning ? (
        <p>Diskuze je pozastavena - {timeFormatted}.</p>
    ) : (
        <p>Diskuze běží - {timeFormatted}.</p>
    );
};
