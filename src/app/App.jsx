/* globals __BASENAME__ */

import '@babel/polyfill';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { autobind } from 'core-decorators';
import config from 'app-config';
import './App.scss';
import Page_Home from 'Pages/Home';
import Page_NotFound from 'Pages/NotFound';
import { Context, app } from '@honzachalupa/helpers';

class App extends Component {
    defaultMembersList = ['Účastník 1', 'Účastník 2', 'Účastník 3', 'Účastník 4', 'Účastník 5', 'Účastník 6', 'Účastník 7', 'Účastník 8'];

    jsonPattern = /^(\[|{).*(\]|})$/;

    times = null;

    state = {
        members: new RegExp(this.jsonPattern).test(localStorage.getItem('members')) ? JSON.parse(localStorage.getItem('members')) : this.defaultMembersList,
        times: new RegExp(this.jsonPattern).test(localStorage.getItem('times')) ? JSON.parse(localStorage.getItem('times')) : {},
        elapsedTime: Number(localStorage.getItem('elapsedTime')) || 0,
        resetState: this.resetState,
        handleStartDiscussion: this.handleStartDiscussion,
        updateContextProperty: this.updateContextProperty
    }

    componentDidMount() {
        if (config.caching) {
            app.initServiceWorker();
        }

        window.addEventListener('beforeunload', e => {
            e.preventDefault();

            return this.saveState();
        });
    }

    saveState() {
        localStorage.setItem('members', JSON.stringify(this.state.members));
        localStorage.setItem('times', JSON.stringify(this.state.times));
        localStorage.setItem('elapsedTime', this.state.elapsedTime);
    }

    @autobind
    resetState() {
        this.stopTimer();

        this.setState({
            members: this.defaultMembersList,
            times: {},
            elapsedTime: 0
        });
    }

    @autobind
    updateContextProperty(key, value) {
        this.setState({
            [key]: value
        });
    }

    startTimer() {
        this.times = setInterval(() => {
            this.setState(prevState => {
                return {
                    elapsedTime: prevState.elapsedTime + 1
                };
            });
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.times);
    }

    @autobind
    handleStartDiscussion(members) {
        this.resetState();

        this.saveState();
        this.startDiscussion(members || this.defaultMembersList);
    }

    startDiscussion(members) {
        const times = {};
        members.forEach(member => {
            times[member] = this.state.times && Object.keys(this.state.times).includes(member) ? this.state.times[member] : 0;
        });

        this.setState({
            members,
            times,
            elapsedTime: 0
        });

        this.startTimer();
        this.saveState();
    }

    render() {
        return (
            <Context.Provider value={this.state}>
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
