import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/css/index.css';
import App from './pages/App';
import { Provider } from 'react-redux';
import {store }from 'main/frontend/redux/store';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
   <Provider store={store} >
    <App />
    </Provider>
  </>     
);


