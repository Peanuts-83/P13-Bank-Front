import React from 'react';
import { createRoot } from 'react-dom/client';
import Router from './components/Router';
import "./style/index.scss"
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faCircleUser)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Router tab="home" />);