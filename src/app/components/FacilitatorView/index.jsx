import React, { Component } from 'react';
import { Context } from '@honzachalupa/helpers';
import './style';

export default class FacilitatorView extends Component {
    static contextType = Context;

    getSum() {
        let sum = 0;

        Object.values(this.context.times).forEach(time => sum += time);

        return sum;
    }

    formatTime(seconds) {
        return seconds < 60 ? `${seconds} sekund`
            : seconds % 60 === 0 ? `${Math.floor(seconds / 60)} minut`
                : `${Math.floor(seconds / 60)} minut ${seconds % 60} sekund`;
    }

    render() {
        const sum = this.getSum();

        return (
            <section>
                <header>
                    <p>Délka diskuze: {this.formatTime(this.context.elapsedTime)} (z toho prodiskutováno: {this.formatTime(sum)})</p>
                </header>

                <div className="grid desk-layout">
                    {this.context.members.map(member => {
                        const time = this.context.times[member];
                        const isAboveAverage = time > sum / this.context.members.length;
                        const color = isAboveAverage ? '0, 255, 0' : '255, 0, 0';
                        const opacity = Math.min((100 / sum * time) / 100 + 0.2, 1) || 0;

                        return (
                            <div key={member} className="tile orange member" style={{ boxShadow: `0 0 30px rgba(${color}, ${opacity}) inset` }}>
                                <div className="color-overlay" style={{ backgroundColor: `rgb(${color})`, opacity }} />
                                <p className="name">{member}</p>
                                <p className="label">{time} sekund</p>
                            </div>
                        );
                    })}

                    <div className="desk" />
                </div>
            </section>
        );
    }
}
