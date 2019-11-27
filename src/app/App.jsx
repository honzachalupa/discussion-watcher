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
    const [isFirstRun, setFirstRun] = useState(true);
    const [timerInterval, setTimerInterval] = useState();
    const [state, setState] = useState({
        defaultTime: 3600,
        currentMemberId: null,
        isTimerRunning: false
    });

    const defaultState = {
        members: [],
        times: {},
        time: state.defaultTime,
        timeFormatted: formatTimeFromSeconds(state.defaultTime)
    };

    const globalFunctions = {
        clearPersistentState,
        timerStart,
        timerPause,
        timerStop,
        addMember,
        setCurrentMember
    };

    useEffect(() => {
        console.log('isFirstRun', isFirstRun);

        if (isFirstRun) {
            setFirstRun(false);

            if (config.caching) {
                app.initServiceWorker();
            }

            setState(prevState => {
                console.log(getPersistentState(), prevState);

                return {
                    ...getPersistentState(),
                    ...prevState
                };
            });

            window.addEventListener('beforeunload', e => onPageWillUnload(e));
        }

        setState(prevState => ({
            ...prevState,
            timeFormatted: formatTimeFromSeconds(state.time)
        }));

        return () => window.removeEventListener('beforeunload', e => onPageWillUnload(e));
    }, [isFirstRun, state.time]);

    function onPageWillUnload(e) {
        e.preventDefault();

        setPersistentState();
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
        setState(defaultState);

        localStorage.setItem('state', JSON.stringify(defaultState));
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
            time: defaultState.time,
            times: defaultState.times
        }));
    }

    function tick() {
        setState(prevState => {
            prevState.times[prevState.currentMemberId] = (prevState.times[prevState.currentMemberId] || defaultState.time / 4) - 1;

            return {
                ...prevState,
                time: prevState.time - 1,
                times: prevState.times
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
            currentMemberId: state.currentMemberId !== id ? id : null
        }));

        timerStart();
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
