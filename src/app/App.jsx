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

    jsonPattern = /^(\[|{).*(\]|})$/;

    defaultState = {
        members: [],
        times: {},
        time: 0
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
        selectedMemberId: null,
        isTimerRunning: false
    }

    componentDidMount() {
        if (config.caching) {
            app.initServiceWorker();
        }

        window.addEventListener('beforeunload', e => this.onPageWillReload(e));
    }

    componentDidUpdate(_, prevState) {
        if (prevState.selectedMemberId !== this.state.selectedMemberId) {
            if (this.state.selectedMemberId === null) {
                this.timerPause();
            }
        }
    }

    componentWillUnount() {
        window.removeEventListener('beforeunload', e => this.onPageWillReload(e));
    }

    onPageWillReload(e) {
        e.preventDefault();

        return this.setPersistentState();
    }

    getPersistentState() {
        return new RegExp(this.jsonPattern).test(localStorage.getItem('state'))
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
            this.setState(prevState => ({
                isTimerRunning: true,
                time: prevState.time + 1
            }));

            this.timeInterval = setInterval(() => {
                this.setState(prevState => ({
                    time: prevState.time + 1
                }));
            }, 1000);
        }
    }

    @autobind
    timerPause() {
        this.setState({
            isTimerRunning: false,
            selectedMemberId: null
        });

        clearInterval(this.timeInterval);
    }

    @autobind
    timerStop() {
        this.timerPause();

        this.setState({
            isTimerRunning: false,
            time: 0,
            selectedMemberId: null
        });
    }

    @autobind
    setCurrentMember(id) {
        this.setState(prevState => ({
            selectedMemberId: prevState.selectedMemberId !== id ? id : null
        }));

        this.timerStart();
    }

    @autobind
    updateContextProperty(key, value) {
        this.setState({
            [key]: value
        });
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
