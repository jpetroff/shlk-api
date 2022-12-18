import React from 'react';
import ReactDOM from 'react-dom';
import { HeroInput } from '../components/hero-input/index';

function App() {
	return (
		<HeroInput />
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);