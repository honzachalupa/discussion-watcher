import React, { useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import { sumObjectProperty } from 'Helpers';
import { SEX_MALE } from 'Enumerator';
import './style';
import MemberMaleIcon from 'Icons/person-male';
import MemberFemaleIcon from 'Icons/person-female';
import ChangeSexIcon from 'Icons/person-change-sex';
import RemoveIcon from 'Icons/recycle-bin';
import TimeBar from './TimeBar';

export default ({ id, name, sex }) => {
    const { defaultTime, times, currentMemberId, activeMembersCount, Members } = useContext(Context);
    const timesSum = sumObjectProperty(times);
    const hasNoTimeLeft = timesSum === defaultTime || times[id] >= defaultTime / Math.max(activeMembersCount, 1);

    return (
        <div className={cx({ selected: id === currentMemberId, 'has-no-time-left': hasNoTimeLeft })} data-component="Member">
            <button
                className="icon"
                style={{ backgroundImage: `url(${sex === SEX_MALE ? MemberMaleIcon : MemberFemaleIcon})` }}
                onClick={!hasNoTimeLeft ? () => Members.setCurrent(id) : () => {}}
                type="button"
            />

            {!hasNoTimeLeft ? (
                <TimeBar memberId={id} />
            ) : (
                <p className="label">Čas vypršel.</p>
            )}

            <input className="name" type="text" defaultValue={name} onClick={e => e.stopPropagation()} onChange={e => Members.setName(id, e.target.value)} />

            {!hasNoTimeLeft && (
                <div className="actions">
                    <button onClick={() => Members.toggleSex(id)} type="button">
                        <img className="icon" src={ChangeSexIcon} alt="" />
                        <span className="label">Změnit pohlaví</span>
                    </button>

                    <button onClick={() => Members.remove(id)} type="button">
                        <img className="icon" src={RemoveIcon} alt="" />
                        <span className="label">Odebat člena</span>
                    </button>
                </div>
            )}
        </div>
    );
};
