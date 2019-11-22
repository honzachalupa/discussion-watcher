/* globals __BASENAME__ */

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
    jsonPattern = /^(\[|{).*(\]|})$/;

    defaultState = {
        members: []
    };

    state = {
        ...this.prepareState(),
        updateContextProperty: this.updateContextProperty,
        clearCache: this.clearCache
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

    prepareState() {
        return new RegExp(this.jsonPattern).test(localStorage.getItem('state'))
            ? JSON.parse(localStorage.getItem('state'))
            : this.defaultState;
    }

    saveState() {
        localStorage.setItem('state', JSON.stringify(this.state));
    }

    @autobind
    updateContextProperty(key, value) {
        this.setState({
            [key]: value
        });
    }

    @autobind
    clearCache() {
        this.setState(this.defaultState);

        localStorage.setItem('state', JSON.stringify(this.defaultState));
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
