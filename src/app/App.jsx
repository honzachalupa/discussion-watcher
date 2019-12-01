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
    const defaultTime = 600; // To-do: Change 3600 s.

    const [timerInterval, setTimerInterval] = useState();

    const initialState = {
        defaultTime,
        currentMemberId: null,
        isTimerRunning: false,
        members: [],
        activeMembersCount: 0,
        times: {},
        time: defaultTime,
        timeFormatted: formatTimeFromSeconds(defaultTime),
        maxMembersCount: 8
    };

    const [state, setState] = useState(initialState);

    const tick = () => {
        setState(prevState => {
            const times = { ...prevState.times };

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

            setTimerInterval(
                setInterval(() => {
                    tick();
                }, 100) // To-do: Change to 1000 ms.
            );
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
        timerPause();

        setState(prevState => ({
            ...prevState,
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

    const setMemberName = (memberId, name) => {
        setState(prevState => ({
            ...prevState,
            members: prevState.members.map(member => {
                if (member.id === memberId) {
                    member.name = name;

                    return member;
                } else {
                    return member;
                }
            })
        }));
    };

    const toggleMemberSex = memberId => {
        setState(prevState => ({
            ...prevState,
            members: prevState.members.map(member => {
                if (member.id === memberId) {
                    member.sex = member.sex === 'MALE' ? 'FEMALE' : 'MALE';

                    return member;
                } else {
                    return member;
                }
            })
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
            const { members, time, times, currentMemberId } = prevState;

            if (time === 0) {
                timerStop();
            }

            if (times[currentMemberId] === 0) {
                timerPause();

                times[currentMemberId] = -1;
            }

            return {
                ...prevState,
                times,
                timeFormatted: formatTimeFromSeconds(time),
                activeMembersCount: members.length - Object.keys(times).filter(id => times[id] === -1).length
            };
        });

        setTimeout(() => setPersistentState(state), 500);
    }, [state.time, state.members]);

    useEffect(() => state.currentMemberId === null ? timerPause() : timerStart(), [state.currentMemberId]);
    useEffect(() => timerPause(), [state.members]);

    const globalFunctions = {
        Timer: {
            start: timerStart,
            pause: timerPause,
            stop: timerStop
        },
        Members: {
            add: addMember,
            setName: setMemberName,
            toggleSex: toggleMemberSex,
            setCurrent: setCurrentMember
        }
    };

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
