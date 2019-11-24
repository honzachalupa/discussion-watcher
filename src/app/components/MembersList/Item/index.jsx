import React, { useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import './style';
import MemberMaleIcon from 'Icons/person-male';
import MemberFemaleIcon from 'Icons/person-female';
import AddMemberIcon from 'Icons/plus';

export default ({ type, member }) => {
    const { members, setCurrentMember, selectedMemberId, timerPause, updateContextProperty } = useContext(Context);

    const SEX_MALE = 'MALE';
    const SEX_FEMALE = 'FEMALE';

    const getNewId = () => members.length + 1; // To-do: Add more logic.

    const getDefaultMember = () => {
        const id = getNewId();

        return {
            id,
            name: `Nový člen ${id}`,
            sex: Math.round(Math.random() * 1000) % 2 === 0 ? SEX_MALE : SEX_FEMALE
        };
    };

    const addMember = () => {
        timerPause();

        updateContextProperty('members', [...members, getDefaultMember()]);
    };

    return type === 'member' ? (
        <div className={cx('item', 'member', { selected: member.id === selectedMemberId })} onClick={() => setCurrentMember(member.id)} type="button" data-component="MembersList_Item">
            <div className="icon" style={{ backgroundImage: `url(${member.sex === SEX_MALE ? MemberMaleIcon : MemberFemaleIcon})` }} />

            <p className="name">{member.name}</p>
        </div>
    ) : (
        <div className="item add-new" onClick={addMember} type="button" data-component="MembersList_Item">
            <div className="icon" style={{ backgroundImage: `url(${AddMemberIcon})` }} />

            <p className="button" type="button">Pozastavit diskuzi a přidat člena</p>
        </div>
    );
};
