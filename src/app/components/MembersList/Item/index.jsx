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
            <div className="icon" style={{ backgroundImage: `url(${member.sex === SEX_MALE ? MemberMaleIcon : MemberFemaleIcon})` }}>
                {!hasNoTimeLeft && (
                    <div className="sex-change-button" onClick={e => { e.stopPropagation(); Members.toggleSex(member.id); }} type="button">O</div>
                )}
            </div>

            {!hasNoTimeLeft ? (
                <TimeBar memberId={member.id} />
            ) : (
                <p className="label">Čas vypršel</p>
            )}

            <input className="name" type="text" defaultValue={member.name} onClick={e => e.stopPropagation()} onChange={e => Members.setName(member.id, e.target.value)} />
        </div>
    );
};
