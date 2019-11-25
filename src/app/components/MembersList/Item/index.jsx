import React, { useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import './style';
import MemberMaleIcon from 'Icons/person-male';
import MemberFemaleIcon from 'Icons/person-female';
import AddMemberIcon from 'Icons/plus';
import TimeBar from './TimeBar';

export default ({ type, member }) => {
    const { members, setCurrentMember, currentMemberId, isTimerRunning, timerPause, updateContextProperty } = useContext(Context);

    const SEX_MALE = 'MALE';
    const SEX_FEMALE = 'FEMALE';

    const getNewId = () => members.length + 1; // To-do: Add more logic.

    const getDefaultMember = () => {
        const id = getNewId();

        return {
            id,
            name: `Nový člen ${id}`,
            sex: Math.round(Math.random() * 10) % 2 === 0 ? SEX_MALE : SEX_FEMALE
        };
    };

    const addMember = () => {
        timerPause();

        updateContextProperty('members', [...members, getDefaultMember()]);
    };

    return type === 'member' ? (
        <div className={cx('item', 'member', { selected: member.id === currentMemberId })} onClick={() => setCurrentMember(member.id)} type="button" data-component="MembersList_Item">
            <div className="icon" style={{ backgroundImage: `url(${member.sex === SEX_MALE ? MemberMaleIcon : MemberFemaleIcon})` }} />

            <TimeBar memberId={member.id} />

            <p className="label">{member.name}</p>
        </div>
    ) : (
        <div className="item add-new" onClick={addMember} type="button" data-component="MembersList_Item">
            <div className="icon" style={{ backgroundImage: `url(${AddMemberIcon})` }} />

            <p className="label">{isTimerRunning ? 'Pozastavit diskuzi a přidat člena' : 'Přidat člena'}</p>
        </div>
    );
};
