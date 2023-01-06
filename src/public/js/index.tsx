
require.context('../assets/', true)
import '../css/main.less'
import '../index.html'
import './modernizr_build.js'

import React from 'react'
import ReactDOM from 'react-dom'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { withRouter } from './router-hoc'
import { Home } from '../apps/Home/index'

const Home_R = withRouter(Home)

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home_R />
    ),
  }
]);

ReactDOM.render(
	<RouterProvider router={router} />,
	document.getElementById('app')
);