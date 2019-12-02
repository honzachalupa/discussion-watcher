import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import AddMemberIcon from 'Icons/plus';

export default () => {
    const { members, isTimerRunning, Members } = useContext(Context);

    const SEX_MALE = 'MALE';

    const getNewId = () => {
        const existingIDs = members.map(member => member.id);
        const id = Math.round(Math.random() * 1000000);

        if (!existingIDs.includes(id)) {
            return id;
        } else {
            return getNewId();
        }
    };

    const getDefaultMember = () => ({
        id: getNewId(),
        name: 'Člen beze jména',
        sex: SEX_MALE
    });

    return (
        <button onClick={() => Members.add(getDefaultMember())} type="button" data-component="AddNewButton">
            <div className="icon" style={{ backgroundImage: `url(${AddMemberIcon})` }} />

            <p className="label">{isTimerRunning ? 'Pozastavit diskuzi a přidat člena' : 'Přidat člena'}</p>
        </button>
    );
};
