import React, { Component } from 'react';
import cx from 'classnames';
import { Context } from '@honzachalupa/helpers';
import './style';

export default class AssistantView extends Component {
    static contextType = Context;

    runningTimerName = '';

    componentDidMount() {
        this.startTicker();
    }

    startTicker() {
        const ticker = setInterval(() => {
            if (Object.keys(this.context.times).includes(this.runningTimerName)) {
                const times = this.context.times;

                times[this.runningTimerName] += 1;

                this.context.updateContextProperty('times', times);
            }
        }, 1000);

        if (this.context.elapsedTime === 0) {
            clearInterval(ticker);
        }
    }

    handleStartTimer(member) {
        this.runningTimerName = member;

        this.forceUpdate();
    }

    handleStopTimer() {
        this.runningTimerName = '';

        this.forceUpdate();
    }

    render() {
        return (
            <section style={{ marginTop: 16 }}>
                <div className="grid desk-layout">
                    {this.context.members.map(member => {
                        const isActive = this.runningTimerName === member;

                        return (
                            <button key={member} className={cx('tile', 'member', { active: isActive })} type="button" onClick={isActive ? () => this.handleStopTimer() : () => this.handleStartTimer(member)}>
                                <p className="name">{member}</p>
                                <p className="label">{isActive ? 'Stop' : 'Start'}</p>
                            </button>
                        );
                    })}

                    <div className="desk" />
                </div>
            </section>
        );
    }
}
