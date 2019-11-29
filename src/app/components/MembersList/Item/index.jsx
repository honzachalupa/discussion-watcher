import React, { useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import './style';
import MemberMaleIcon from 'Icons/person-male';
import MemberFemaleIcon from 'Icons/person-female';
import TimeBar from './TimeBar';

export default ({ member }) => {
    const { times, currentMemberId, Members } = useContext(Context);

    const SEX_MALE = 'MALE';

    const hasNoTimeLeft = times[member.id] === -1;

    return (
        <div
            className={cx('item', 'member', { selected: member.id === currentMemberId, 'has-no-time-left': hasNoTimeLeft })}
            onClick={!hasNoTimeLeft ? () => Members.setCurrent(member.id) : () => {}}
            type="button"
            data-component="MembersList_Item"
        >
            <div className="icon" style={{ backgroundImage: `url(${member.sex === SEX_MALE ? MemberMaleIcon : MemberFemaleIcon})` }} />

            {!hasNoTimeLeft ? (
                <TimeBar memberId={member.id} />
            ) : (
                <p className="label">Čas vypršel</p>
            )}

            <p className="label">{member.name}</p>
        </div>
    );
};
