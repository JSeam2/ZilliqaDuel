import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import 'aframe';
// import 'aframe-animation-component'
// import 'aframe-event-set-component'
// import 'aframe-particle-system-component'
// import './components/aframe-custom'
// import './components/aframe-environment'
// import './components/aframe-effects'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


// document.addEventListener('DOMContentLoaded', () => {
//   render(<App />, document.querySelector('#root'))
// })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
