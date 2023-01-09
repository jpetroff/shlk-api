
require.context('../assets/', true)
import '../css/main.less'
import '../index.html'

import * as React from 'react'
import { createRoot } from 'react-dom/client'
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

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<RouterProvider router={router} />)
