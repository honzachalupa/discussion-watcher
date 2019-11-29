import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import Item from './Item';

export default () => {
    const { members, maxMembersCount } = useContext(Context);

    return (
        <section>
            <div className="list">
                {members.map(member => (
                    <Item key={member.id} type="member" member={member} />
                ))}

                {members.length < maxMembersCount && (
                    <Item type="add-new" />
                )}
            </div>
        </section>
    );
};
