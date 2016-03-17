import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-middleware-api';
import { syncHistory, routeReducer } from 'redux-simple-router'
import DevTools from '../pages/DevTools';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import createSagaMiddleware from 'redux-saga';

import reducers from '../state';
import sagas from '../sagas';

export default function configureStore(initialState = {}, browserHistory) {

    let reduxRouterMiddleware = syncHistory(browserHistory);

    const middlewares = [];
    middlewares.push(apiMiddleware);
    middlewares.push(thunk);
    middlewares.push(reduxRouterMiddleware);
    middlewares.push(setUpIo());
    //middlewares.push(createSagaMiddleware(...sagas));

    if (__DEVELOPMENT__) {
        const createLogger = require('redux-logger');
        const logger = createLogger();
        middlewares.push(logger);
    }

    let createStoreWithMiddleware = applyMiddleware(...middlewares);

    if (__DEVTOOLS__) {
        createStoreWithMiddleware = compose(
            createStoreWithMiddleware,
            DevTools.instrument()
        );
    }

    const finalCreateStore = createStoreWithMiddleware(createStore);
    const store = finalCreateStore(reducers, initialState);

    reduxRouterMiddleware.listenForReplays(store);

    if (__DEVELOPMENT__) {
        if (module.hot) {
            // Enable Webpack hot module replacement for reducers
            module.hot.accept('../state', () => {
                const nextReducer = require('../state');
                store.replaceReducer(nextReducer);
            });
        }
    }

    return store;
}

function setUpIo() {
    const socket = io();
    const middleware = createSocketIoMiddleware(socket, 'server/');

    return middleware;
}
