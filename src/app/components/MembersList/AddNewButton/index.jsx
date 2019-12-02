import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import AddMemberIcon from 'Icons/plus';

export default () => {
    const { isTimerRunning, Members } = useContext(Context);

    return (
        <button onClick={() => Members.add()} type="button" data-component="AddNewButton">
            <div className="icon" style={{ backgroundImage: `url(${AddMemberIcon})` }} />

            <p className="label">{isTimerRunning ? 'Pozastavit diskuzi a přidat člena' : 'Přidat člena'}</p>
        </button>
    );
};
