import React, { useContext } from 'react';
import { createColorsFromMap, rgbaString } from 'color-map';
import { Context } from '@honzachalupa/helpers';
import { formatTimeFromSeconds } from 'Helpers';
import './style';

export default ({ memberId }) => {
    const { activeMembersCount, defaultTime, times } = useContext(Context);

    const memberTime = Math.min(
        times[memberId] !== undefined
            ? defaultTime / activeMembersCount - times[memberId]
            : defaultTime / activeMembersCount,
        defaultTime / activeMembersCount
    );

    const progress = Math.round(100 / (defaultTime / activeMembersCount) * memberTime) || 0;

    const colors = [
        { index: 0, rgb: [255, 0, 0] },
        { index: 1, rgb: [231, 180, 22] },
        { index: 2, rgb: [45, 201, 55] }
    ];

    const color = rgbaString(createColorsFromMap(colors, 51)[progress]);

    return (
        <div>
            <div className="color-container" style={{ width: `${progress}%`, backgroundColor: color }} />

            <p className="label">{formatTimeFromSeconds(memberTime)}</p>
        </div>
    );
};
