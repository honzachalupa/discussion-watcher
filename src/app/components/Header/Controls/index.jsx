import React, { useContext } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import PauseIcon from 'Icons/controls-pause';
import PlayIcon from 'Icons/controls-play';
import StopIcon from 'Icons/controls-stop';
import './style';

export default () => {
    const { members, timerStart, timerPause, timerStop } = useContext(Context);

    return (
        <div className={cx({ 'is-disabled': members.length < 3 })}>
            <button className="button" onClick={timerPause} type="button">
                <img className="icon" src={PauseIcon} alt="" />
            </button>

            <button className="button" onClick={timerStart} type="button">
                <img className="icon" src={PlayIcon} alt="" />
            </button>

            <button className="button" onClick={timerStop} type="button">
                <img className="icon" src={StopIcon} alt="" />
            </button>
        </div>
    );
};
