import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import Controls from 'Components/Controls';
import InfoBar from 'Components/InfoBar';
import './style';

export default () => {
    const { members } = useContext(Context);

    return (
        <header>
            {members.length > 0 && (
                <React.Fragment>
                    <Controls />
                    <InfoBar />
                </React.Fragment>
            )}
        </header>
    );
};
