import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import Item from './Item';
import AddNewButton from './AddNewButton';

export default () => {
    const { members, maxMembersCount } = useContext(Context);

    return (
        <section>
            <div className="list">
                {members.map(member => (
                    <Item key={member.id} member={member} />
                ))}

                {members.length < maxMembersCount && (
                    <AddNewButton />
                )}
            </div>
        </section>
    );
};
