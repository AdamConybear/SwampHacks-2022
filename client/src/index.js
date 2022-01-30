import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import { store } from './store/store';
import { createGlobalStyle } from "styled-components";
// import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

const GlobalStyle = createGlobalStyle`
  html {
    background-color: #AFADA0;
    box-sizing: border-box;
    transition: all 0.5s ease-in;
  }
`;

ReactDOM.render(
	<React.StrictMode>
		{/* <Provider store={store}> */}
		<GlobalStyle />
		<App />
		{/* </Provider> */}
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
