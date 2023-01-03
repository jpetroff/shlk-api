import '../css/main.less'
import '../index.html'
import './modernizr_build.js'

import React from 'react'
import ReactDOM from 'react-dom'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { Home } from '../apps/Home/index'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home />
    ),
  }
]);

ReactDOM.render(
	<RouterProvider router={router} />,
	document.getElementById('app')
);