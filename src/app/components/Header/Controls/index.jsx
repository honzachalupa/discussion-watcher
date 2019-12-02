import React, { useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import PauseIcon from 'Icons/controls-pause';
import StopIcon from 'Icons/controls-stop';
import './style';

export default () => {
    const { activeMembersCount, isTimerRunning, Timer } = useContext(Context);

    const buttons = [{
        icon: PauseIcon,
        onClick: Timer.pause,
        isDisabled: !isTimerRunning || activeMembersCount === 0
    }, {
        icon: StopIcon,
        onClick: Timer.stop,
        isDisabled: activeMembersCount === 0
    }];

    return (
        <div>
            {buttons.map(button => (
                <button key={button.icon} className={cx('button', { 'is-disabled': button.isDisabled })} onClick={button.onClick} type="button">
                    <img className="icon" src={button.icon} alt="" />
                </button>
            ))}
        </div>
    );
};
