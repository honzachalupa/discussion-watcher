/* globals __BASENAME__ */

import '@babel/polyfill';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Context, app } from '@honzachalupa/helpers';
import config from 'app-config';
import './App.scss';
import Page_Home from 'Pages/Home';
import Page_NotFound from 'Pages/NotFound';

const App = () => {
    let timeInterval = null;

    const defaultState = {
        members: [],
        times: {},
        time: 0
    };

    const globalFunctions = {
        clearPersistentState,
        timerStart,
        timerPause,
        timerStop,
        setCurrentMember
    };

    const [state] = useState(getPersistentState());
    const [time, setTime] = useState(0);
    const [isTimerRunning, setTimerRunning] = useState(false);
    const [currentMemberId, setSelectedMemberId] = useState(null);
    const [isFirstRun, setFirstRun] = useState(true);

    useEffect(() => {
        if (isFirstRun) {
            if (config.caching) {
                app.initServiceWorker();
            }

            window.addEventListener('beforeunload', e => onPageWillReload(e));

            setFirstRun(false);
        }

        if (currentMemberId === null) {
            timerPause();
        }

        return () => {
            window.removeEventListener('beforeunload', onPageWillReload);
        };
    });

    function onPageWillReload(e) {
        e.preventDefault();

        return setPersistentState();
    }

    function getPersistentState() {
        return /^(\[|{).*(\]|})$/.test(localStorage.getItem('state'))
            ? JSON.parse(localStorage.getItem('state'))
            : defaultState;
    }

    function setPersistentState() {
        localStorage.setItem('state', JSON.stringify(state));
    }

    function clearPersistentState() {
        // this.setState(defaultState);

        localStorage.setItem('state', JSON.stringify(defaultState));
    }

    function timerStart() {
        if (!isTimerRunning) {
            setTimerRunning(true);
            tick();

            timeInterval = setInterval(() => {
                tick();
            }, 1000);
        }
    }

    function timerPause() {
        setTimerRunning(false);
        setSelectedMemberId(null);

        clearInterval(timeInterval);
    }

    function timerStop() {
        timerPause();
        setTime(0);

        setSelectedMemberId(null);
    }

    function tick() {
        setTime(time + 1);
    }

    function setCurrentMember(id) {
        setSelectedMemberId(currentMemberId === null ? id : null);
        timerStart();
    }

    console.log(state);

    return (
        <Context.Provider value={{ ...state, ...globalFunctions }}>
            <Router basename={__BASENAME__}>
                <Switch>
                    <Route component={Page_Home} path="/" exact />
                    <Route component={Page_NotFound} exact />
                </Switch>
            </Router>
        </Context.Provider>
    );
};

render(<App />, document.querySelector('#app'));
