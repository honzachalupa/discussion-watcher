import React, { useContext } from 'react';
import colormap from 'colormap';
import { Context } from '@honzachalupa/helpers';
import { formatTimeFromSeconds } from 'Helpers';
import './style';

export default ({ memberId }) => {
    const { activeMembersCount, defaultTime, times } = useContext(Context);

    const memberTime = times[memberId] !== undefined ? times[memberId] : defaultTime / activeMembersCount;
    const progress = Math.min(Math.round(100 / (defaultTime / activeMembersCount) * memberTime), 100);

    const colors = [
        { index: 0, rgb: [255, 0, 0] },
        { index: 50, rgb: [255, 165, 0] },
        { index: 100, rgb: [0, 255, 0] }
    ];

    const color = colormap({
        colormap: colors,
        nshades: colors.length
    })[progress];

    return (
        <div>
            <div className="color-container" style={{ width: `${progress}%`, backgroundColor: color }} />

            <p className="label">{formatTimeFromSeconds(memberTime)}</p>
        </div>
    );
};
