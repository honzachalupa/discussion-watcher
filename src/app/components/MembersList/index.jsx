import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import Member from './Member';
import AddNewButton from './AddNewButton';

export default () => {
    const { members, maxMembersCount } = useContext(Context);

    return (
        <section>
            <div className="list">
                {members.map(member => (
                    <Member key={member.id} {...member} />
                ))}

                {members.length < maxMembersCount && (
                    <AddNewButton />
                )}
            </div>
        </section>
    );
};
