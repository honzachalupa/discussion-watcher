import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import AddMemberIcon from 'Icons/plus';

export default () => {
    const { members, isTimerRunning, Members } = useContext(Context);

    const SEX_MALE = 'MALE';

    const getNewId = () => members.length + 1; // To-do: Add more logic.

    const getDefaultMember = () => {
        const id = getNewId();

        return {
            id,
            name: `Nový člen ${id}`,
            sex: SEX_MALE
        };
    };

    return (
        <div className="item add-new" onClick={() => Members.add(getDefaultMember())} type="button" data-component="MembersList_Item">
            <div className="icon" style={{ backgroundImage: `url(${AddMemberIcon})` }} />

            <p className="label">{isTimerRunning ? 'Pozastavit diskuzi a přidat člena' : 'Přidat člena'}</p>
        </div>
    );
};
