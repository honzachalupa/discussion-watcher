import React, { useState, useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import PauseIcon from 'Icons/controls-pause';
import StopIcon from 'Icons/controls-stop';
import './style';

export default () => {
    const { activeMembersCount, Timer } = useContext(Context);

    const [buttons] = useState([{
        id: 'pause',
        icon: PauseIcon,
        onClick: Timer.pause
    }, {
        id: 'stop',
        icon: StopIcon,
        onClick: Timer.stop
    }]);

    return (
        <div className={cx({ 'is-disabled': activeMembersCount === 0 })}>
            {buttons.map(button => (
                <button key={button.id} className="button" onClick={button.onClick} type="button">
                    <img className="icon" src={button.icon} alt="" />
                </button>
            ))}
        </div>
    );
};
