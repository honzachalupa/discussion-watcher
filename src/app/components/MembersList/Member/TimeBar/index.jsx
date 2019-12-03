import React, { useContext } from 'react';
import { createColorsFromMap, rgbaString } from 'color-map';
import { Context } from '@honzachalupa/helpers';
import { formatTimeFromSeconds } from 'Helpers';
import './style';

export default ({ memberId }) => {
    const { activeMembersCount, defaultTime, times } = useContext(Context);

    const memberTime = times[memberId] !== undefined
        ? defaultTime / Math.max(activeMembersCount, 1) - times[memberId]
        : defaultTime / Math.max(activeMembersCount, 1)
    || 0;

    const progress = Math.min(Math.round(100 / (defaultTime / Math.max(activeMembersCount, 1)) * memberTime), 100);

    const colors = [
        { index: 0, rgb: [255, 0, 0] },
        { index: 1, rgb: [231, 180, 22] },
        { index: 2, rgb: [45, 201, 55] }
    ];

    const color = rgbaString(createColorsFromMap(colors, 51)[progress]);

    return (
        <div>
            <div className="color-container">
                <div className="color" style={{ width: `${progress}%`, backgroundColor: color }} />
            </div>

            <p className="label">{formatTimeFromSeconds(memberTime)}</p>
        </div>
    );
};
