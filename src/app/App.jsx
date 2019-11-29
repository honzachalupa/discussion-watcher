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
    const [timerInterval, setTimerInterval] = useState();
    const [defaultTime] = useState(3600);

    const initialState = {
        defaultTime,
        currentMemberId: null,
        isTimerRunning: false,
        members: [],
        times: {},
        time: defaultTime,
        timeFormatted: formatTimeFromSeconds(defaultTime)
    };

    const [state, setState] = useState(initialState);

    const globalFunctions = {
        clearPersistentState,
        timerStart,
        timerPause,
        timerStop,
        addMember,
        setCurrentMember
    };

    useEffect(() => {
        if (config.caching) {
            app.initServiceWorker();
        }

        setState(prevState => ({
            ...prevState,
            ...getPersistentState()
        }));
    }, []);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            timeFormatted: formatTimeFromSeconds(prevState.time)
        }));

        if (state.time === 0) {
            timerStop();
        }

        setPersistentState();
    }, [state.time]);

    useEffect(() => {
        if (state.currentMemberId === null) {
            timerPause();
        } else {
            timerStart();
        }
    }, [state.currentMemberId]);

    function getPersistentState() {
        return /^(\[|{).*(\]|})$/.test(localStorage.getItem('state')) ? JSON.parse(localStorage.getItem('state')) : {};
    }

    function setPersistentState() {
        localStorage.setItem('state', JSON.stringify(state));
    }

    function clearPersistentState() {
        localStorage.removeItem('state', JSON.stringify(initialState));

        window.location.reload();
    }

    function timerStart() {
        if (!state.isTimerRunning) {
            setState(prevState => ({
                ...prevState,
                isTimerRunning: true
            }));

            tick();

            const timerInterval = setInterval(() => {
                tick();
            }, 1000);

            setTimerInterval(timerInterval);
        }
    }

    function timerPause() {
        clearInterval(timerInterval);

        setState(prevState => ({
            ...prevState,
            isTimerRunning: false,
            currentMemberId: null
        }));
    }

    function timerStop() {
        clearInterval(timerInterval);

        setState(prevState => ({
            ...prevState,
            isTimerRunning: false,
            currentMemberId: null,
            time: initialState.time,
            times: initialState.times
        }));
    }

    function tick() {
        setState(prevState => {
            const times = {};
            times[prevState.currentMemberId] = (prevState.times[prevState.currentMemberId] || defaultTime / 4) - 1;

            return {
                ...prevState,
                time: prevState.time - 1,
                times
            };
        });
    }

    function addMember(member) {
        setState(prevState => ({
            ...prevState,
            members: [...prevState.members, member]
        }));
    }

    function setCurrentMember(id) {
        setState(prevState => ({
            ...prevState,
            currentMemberId: prevState.currentMemberId !== id ? id : null
        }));
    }

    function formatTimeFromSeconds(s) {
        return s < 60 ? `${s} sekund` : `${Math.round(s / 60)} minut`;
    }

    return state.time ? (
        <Context.Provider value={{ ...state, ...globalFunctions }}>
            <Router basename={__BASENAME__}>
                <Switch>
                    <Route component={Page_Home} path="/" exact />
                    <Route component={Page_NotFound} exact />
                </Switch>
            </Router>
        </Context.Provider>
    ) : null;
};

render(<App />, document.querySelector('#app'));
