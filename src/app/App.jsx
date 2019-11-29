/* globals __BASENAME__ */

import '@babel/polyfill';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Context, app } from '@honzachalupa/helpers';
import { getPersistentState, setPersistentState, formatTimeFromSeconds } from 'Helpers';
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
        timeFormatted: formatTimeFromSeconds(defaultTime),
        maxMembersCount: 8
    };

    const [state, setState] = useState(initialState);

    const tick = () => {
        setState(prevState => {
            const times = {};
            times[prevState.currentMemberId] = (prevState.times[prevState.currentMemberId] || defaultTime / 4) - 1;

            return {
                ...prevState,
                time: prevState.time - 1,
                times
            };
        });
    };

    const timerStart = () => {
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
    };

    const timerPause = () => {
        clearInterval(timerInterval);

        setState(prevState => ({
            ...prevState,
            isTimerRunning: false,
            currentMemberId: null
        }));
    };

    const timerStop = () => {
        clearInterval(timerInterval);

        setState(prevState => ({
            ...prevState,
            isTimerRunning: false,
            currentMemberId: null,
            time: initialState.time,
            times: initialState.times
        }));
    };

    const addMember = member => {
        setState(prevState => ({
            ...prevState,
            members: [...prevState.members, member]
        }));
    };

    const setCurrentMember = id => {
        setState(prevState => ({
            ...prevState,
            currentMemberId: prevState.currentMemberId !== id ? id : null
        }));
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
        setState(prevState => {
            if (prevState.time === 0) {
                timerStop();
            }

            return {
                ...prevState,
                timeFormatted: formatTimeFromSeconds(prevState.time)
            };
        });

        setTimeout(() => setPersistentState(state), 500);
    }, [state.time]);

    useEffect(() => state.currentMemberId === null ? timerPause() : timerStart(), [state.currentMemberId]);
    useEffect(() => timerPause(), [state.members]);

    return state.time ? (
        <Context.Provider value={{ ...state, timerStart, timerPause, timerStop, addMember, setCurrentMember }}>
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
