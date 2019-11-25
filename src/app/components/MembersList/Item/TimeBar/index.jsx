import React, { useContext } from 'react';
import colormap from 'colormap';
import { Context } from '@honzachalupa/helpers';
import './style';

export default ({ memberId }) => {
    const { members, time, times } = useContext(Context);

    const memberTime = times[memberId] || time / members.length;
    const progress = Math.round(100 / time * memberTime) * members.length || 0;

    const formatTimeFromSeconds = s => s < 60 ? `${s} sekund` : `${Math.round(s / 60)} minut`;

    const colors = [
        { index: 0, rgb: [255, 0, 0] },
        { index: 25, rgb: [255, 165, 0] },
        { index: 50, rgb: [0, 255, 0] }
    ];

    const color = colormap({
        colormap: colors,
        nshades: colors.length
    })[progress];

    return memberTime ? (
        <div>
            <div className="color-container" style={{ width: `${progress}%`, backgroundColor: color }} />

            <p className="label">{formatTimeFromSeconds(memberTime)}</p>
        </div>
    ) : null;
};
