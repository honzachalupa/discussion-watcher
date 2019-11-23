import React from 'react';
import Controls from 'Components/Controls';
import InfoBar from 'Components/InfoBar';
import './style';

export default () => {
    return (
        <header>
            <Controls />
            <InfoBar />
        </header>
    );
};
