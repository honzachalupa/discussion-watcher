import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import MemberMaleIcon from 'Icons/person-male';
import MemberFemaleIcon from 'Icons/person-female';
import AddMemberIcon from 'Icons/plus';

export default () => {
    const { members, updateContextProperty } = useContext(Context);

    const MAX_MEMBERS_COUNT = 8;
    const SEX_MALE = 'MALE';
    const SEX_FEMALE = 'FEMALE';

    const getNewId = () => members.length + 1;

    const getDefaultMember = () => {
        const id = getNewId();

        return {
            id,
            name: `Nový člen ${id}`,
            sex: Math.round(Math.random() * 1000) % 2 === 0 ? SEX_MALE : SEX_FEMALE
        };
    };

    const addMember = () => {
        updateContextProperty('members', [...members, getDefaultMember()]);
    };

    return (
        <section>
            <div className="list">
                {members.map(member => (
                    <div key={member.id} className="item member">
                        <div className="icon" style={{ backgroundImage: `url(${member.sex === SEX_MALE ? MemberMaleIcon : MemberFemaleIcon})` }} />

                        <p className="name">{member.name}</p>
                    </div>
                ))}

                {members.length < MAX_MEMBERS_COUNT && (
                    <div className="item add-new" onClick={addMember} type="button">
                        <div className="icon" style={{ backgroundImage: `url(${AddMemberIcon})` }} />

                        <p className="button" type="button">Přidat člena</p>
                    </div>
                )}
            </div>
        </section>
    );
};
