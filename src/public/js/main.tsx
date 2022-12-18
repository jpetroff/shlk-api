import React from 'react';
import ReactDOM from 'react-dom';
import { Test } from '../components/test/index';

function App() {
	return (
		<Test />
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);