import React from 'react';
import { createRoot } from 'react-dom/client';
import Router from './components/Router';
import "./style/index.scss"
import { faCircleUser, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import store from './utils/store'
import { Provider } from 'react-redux'

library.add(faCircleUser, faSignOut)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <Router tab="home" />
    </Provider>
);
