import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import Controls from './Controls';
import InfoBar from './InfoBar';
import './style';

export default () => {
    const { members } = useContext(Context);

    return (
        <header>
            {(members && members.length > 0) && (
                <React.Fragment>
                    <Controls />
                    <InfoBar />
                </React.Fragment>
            )}
        </header>
    );
};
