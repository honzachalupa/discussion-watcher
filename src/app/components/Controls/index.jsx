import React, { useContext } from 'react';
import { Context } from '@honzachalupa/helpers';
import PauseIcon from 'Icons/controls-pause';
import PlayIcon from 'Icons/controls-play';
import StopIcon from 'Icons/controls-stop';
import './style';

export default () => {
    const { timePlay, timePause, timeStop } = useContext(Context);

    return (
        <div>
            <button className="button" onClick={timePause} type="button">
                <img className="icon" src={PauseIcon} alt="" />
            </button>
            <button className="button" onClick={timePlay} type="button">
                <img className="icon" src={PlayIcon} alt="" />
            </button>
            <button className="button" onClick={timeStop} type="button">
                <img className="icon" src={StopIcon} alt="" />
            </button>
        </div>
    );
};