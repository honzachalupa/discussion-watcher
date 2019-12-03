/* globals __BASENAME__ */

import '@babel/polyfill';
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Context, app } from '@honzachalupa/helpers';
import { useRefState, getPersistentState, setPersistentState, formatTimeFromSeconds, getDefaultMember } from 'Helpers';
import config from 'app-config';
import './App.scss';
import Page_Home from 'Pages/Home';
import Page_NotFound from 'Pages/NotFound';
import { sumObjectProperty } from './helpers';

const App = () => {
    const defaultTime = 3600; // To-do: Change 3600 s.

    const [timerInterval, setTimerInterval] = useState();

    const initialState = {
        defaultTime,
        currentMemberId: null,
        isTimerRunning: false,
        members: [],
        activeMembersCount: 0,
        times: {},
        time: 0,
        timeFormatted: formatTimeFromSeconds(defaultTime),
        maxMembersCount: 8
    };

    const [state, stateRef, setState] = useRefState(initialState);

    const saveDiscussion = () => {
        let discussionsHistory = [];
        const discussionsHistoryNode = localStorage.getItem('discussionsHistory');

        if (discussionsHistoryNode) {
            discussionsHistory = JSON.parse(discussionsHistoryNode);
        }

        discussionsHistory.push({
            id: Date.now(),
            data: stateRef.current.members.map(member => ({
                name: member.name,
                time: stateRef.current.times[member.id]
            }))
        });

        localStorage.setItem('discussionsHistory', JSON.stringify(discussionsHistory));
    };

    const tick = () => {
        setState(prevState => {
            const times = { ...prevState.times };

            times[prevState.currentMemberId] = (times[prevState.currentMemberId] || 0) + 1;

            return {
                ...prevState,
                time: prevState.time + 1,
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
                }, 1000) // To-do: Change to 1000 ms.
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
        saveDiscussion();

        setState(prevState => ({
            ...prevState,
            time: initialState.time,
            times: initialState.times
        }));
    };

    const addMember = () => {
        setState(prevState => {
            const { time, members, activeMembersCount } = prevState;
            const times = { ...prevState.times };
            const newMember = getDefaultMember(members);
            let timeForMember = 0;

            if (time > 0) {
                Object.keys(times).forEach(key => {
                    // console.log(`time[${key}]`, times[key], '=>', times[key] / (activeMembersCount + 1) * activeMembersCount);

                    times[key] -= times[key] / (activeMembersCount + 1) * activeMembersCount;
                });

                timeForMember = time - sumObjectProperty(times);

                // console.log({ time, activeMembersCount, 'sumObjectProperty(times)': sumObjectProperty(times), 'time[newMemberId]': timeForMember });
            }

            // console.log('- - - - - - - - - - - - - - - - - - - -');

            times[newMember.id] = timeForMember;

            return {
                ...prevState,
                members: [...members, newMember],
                times
            };
        });
    };

    const removeMember = id => {
        setState(({ members, times, ...rest }) => {
            times = { ...times };

            delete times[id];

            return {
                ...rest,
                members: [...members].filter(member => member.id !== id),
                times
            };
        });
    };

    const setMemberName = (memberId, name) => {
        setState(({ members, ...rest }) => ({
            ...rest,
            members: [...members].map(member => {
                if (member.id === memberId) {
                    member.name = name;
                }

                return member;
            })
        }));
    };

    const toggleMemberSex = memberId => {
        setState(({ members, ...rest }) => ({
            ...rest,
            members: [...members].map(member => {
                if (member.id === memberId) {
                    member.sex = member.sex === 'MALE' ? 'FEMALE' : 'MALE';
                }

                return member;
            })
        }));
    };

    const setCurrentMember = id => {
        setState(({ currentMemberId, ...rest }) => ({
            ...rest,
            currentMemberId: currentMemberId !== id ? id : null
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
            const { members, time, defaultTime, times, currentMemberId, activeMembersCount } = prevState;

            if (time === defaultTime || times[currentMemberId] >= defaultTime / Math.max(activeMembersCount, 1)) {
                timerPause();
            }

            return {
                ...prevState,
                times,
                timeFormatted: formatTimeFromSeconds(defaultTime - time),
                activeMembersCount: members.length // - Object.keys(times).filter(id => times[id] === 0).length
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
            remove: removeMember,
            setName: setMemberName,
            toggleSex: toggleMemberSex,
            setCurrent: setCurrentMember
        },
        Discussion: {
            save: saveDiscussion
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
