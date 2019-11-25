/* globals __BASENAME__ */

// To-do: Rewrite to React Hooks syntax.

import '@babel/polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { autobind } from 'core-decorators';
import { Context, app } from '@honzachalupa/helpers';
import config from 'app-config';
import './App.scss';
import Page_Home from 'Pages/Home';
import Page_NotFound from 'Pages/NotFound';

class App extends Component {
    timeInterval = null;

    defaultTime = 3600; // 1 hour in seconds

    defaultState = {
        members: [],
        times: {},
        time: this.defaultTime,
        timeFormatted: this.formatTimeFromSeconds(this.defaultTime)
    };

    globalFunctions = {
        updateContextProperty: this.updateContextProperty,
        clearPersistentState: this.clearPersistentState,
        timerStart: this.timerStart,
        timerPause: this.timerPause,
        timerStop: this.timerStop,
        setCurrentMember: this.setCurrentMember
    };

    state = {
        ...this.getPersistentState(),
        defaultTime: this.defaultTime,
        currentMemberId: null,
        isTimerRunning: false
    }

    componentDidMount() {
        if (config.caching) {
            app.initServiceWorker();
        }

        window.addEventListener('beforeunload', e => this.onPageWillUnload(e));
    }

    componentDidUpdate(_, { time, currentMemberId }) {
        if (currentMemberId !== this.state.currentMemberId && this.state.currentMemberId === null) {
            this.timerPause();
        }

        if (time !== this.state.time) {
            this.setState(({ time }) => ({
                timeFormatted: this.formatTimeFromSeconds(time)
            }));
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onPageWillUnload);
    }

    onPageWillUnload(e) {
        e.preventDefault();

        return this.setPersistentState();
    }

    getPersistentState() {
        return /^(\[|{).*(\]|})$/.test(localStorage.getItem('state'))
            ? JSON.parse(localStorage.getItem('state'))
            : this.defaultState;
    }

    setPersistentState() {
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    @autobind
    clearPersistentState() {
        this.setState(this.defaultState);

        localStorage.setItem('state', JSON.stringify(this.defaultState));
    }

    @autobind
    timerStart() {
        if (!this.state.isTimerRunning) {
            this.setState({
                isTimerRunning: true
            });

            this.tick();

            this.timeInterval = setInterval(() => {
                this.tick();
            }, 50);
        }
    }

    @autobind
    timerPause() {
        this.setState({
            isTimerRunning: false,
            currentMemberId: null
        });

        clearInterval(this.timeInterval);
    }

    @autobind
    timerStop() {
        this.timerPause();

        this.setState({
            isTimerRunning: false,
            time: this.defaultState.time,
            times: this.defaultState.times,
            currentMemberId: null
        });
    }

    tick() {
        this.setState(({ time, times, currentMemberId }) => {
            times[currentMemberId] = (times[currentMemberId] || this.defaultState.time / 4) - 1;

            return {
                time: time - 1,
                times
            };
        });
    }

    @autobind
    setCurrentMember(id) {
        this.setState(({ currentMemberId }) => ({
            currentMemberId: currentMemberId !== id ? id : null
        }));

        this.timerStart();
    }

    @autobind
    updateContextProperty(key, value) {
        this.setState({
            [key]: value
        });
    }

    formatTimeFromSeconds(s) {
        return s < 60 ? `${s} sekund` : `${Math.round(s / 60)} minut`;
    }

    render() {
        return (
            <Context.Provider value={{ ...this.state, ...this.globalFunctions }}>
                <Router basename={__BASENAME__}>
                    <Switch>
                        <Route component={Page_Home} path="/" exact />
                        <Route component={Page_NotFound} exact />
                    </Switch>
                </Router>
            </Context.Provider>
        );
    }
}

render(<App />, document.querySelector('#app'));
