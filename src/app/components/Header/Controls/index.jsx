import React, { useState, useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import PauseIcon from 'Icons/controls-pause';
import PlayIcon from 'Icons/controls-play';
import StopIcon from 'Icons/controls-stop';
import './style';

export default () => {
    const { members, timerStart, timerPause, timerStop } = useContext(Context);

    const [buttons] = useState([{
        id: 'pause',
        icon: PauseIcon,
        onClick: timerPause
    }, {
        id: 'start',
        icon: PlayIcon,
        onClick: timerStart
    }, {
        id: 'stop',
        icon: StopIcon,
        onClick: timerStop
    }]);

    return (
        <div className={cx({ 'is-disabled': members.length < 3 })}>
            {buttons.map(button => (
                <button key={button.id} className="button" onClick={button.onClick} type="button">
                    <img className="icon" src={button.icon} alt="" />
                </button>
            ))}
        </div>
    );
};
