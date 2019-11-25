import React, { useContext } from 'react';
import colormap from 'colormap';
import { Context } from '@honzachalupa/helpers';
import './style';

export default ({ memberId }) => {
    const { time, times } = useContext(Context);

    const memberTime = times[memberId] || time / 4;
    const widthPercents = Math.round(100 / time * memberTime) * 4 || 0;

    const formatTimeFromSeconds = s => s < 60 ? `${s} sekund` : `${Math.round(s / 60)} minut`;

    const colorPalette = [
        { index: 0, rgb: [255, 0, 0] },
        { index: 25, rgb: [255, 165, 0] },
        { index: 50, rgb: [0, 255, 0] }
    ];

    const colorMap = colormap({
        colormap: colorPalette,
        nshades: colorPalette.length
    });

    const color = colorMap[widthPercents];

    console.log(colorMap.length, widthPercents, color);

    return memberTime ? (
        <div>
            <div className="color-container" style={{ width: `${widthPercents}%`, backgroundColor: color }} />

            <p className="label">{formatTimeFromSeconds(memberTime)}</p>
        </div>
    ) : null;
};
