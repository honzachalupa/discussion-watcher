import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';
import Item from './Item';

export default () => {
    const { members } = useContext(Context);

    const MAX_MEMBERS_COUNT = 8;

    return (
        <section>
            <div className="list">
                {members.length > 0 && members.map(member => (
                    <Item key={member.id} type="member" member={member} />
                ))}

                {members.length < MAX_MEMBERS_COUNT && (
                    <Item type="add-new" />
                )}
            </div>
        </section>
    );
};
