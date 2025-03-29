import LandingPage from '../pages/LandingPage'
import SigninPage from '../pages/SigninPage'
import SignupPage from '../pages/SignupPage'
import Discover from '../pages/Discover'
import Dashboard from '../pages/DashBoard'
import Organization from '../pages/Organization'
import Teams from '../pages/Teams'
import Projects from '../pages/Projects'
import Tasks from '../pages/Tasks'

export const publicRoutes = [
  {
    path: 'landing-page',
    element: <LandingPage />
  },
  {
    path: 'sign-in',
    element: <SigninPage />
  },
  {
    path: 'sign-up',
    element: <SignupPage />
  }
]

export const privateRoutes = [
  {
    path: 'discover',
    element: <Discover />
  },
  {
    path: 'dashboard',
    element: <Dashboard />
  },
  {
    path: 'organization',
    element: <Organization />
  },
  {
    path: 'teams',
    element: <Teams />
  },
  {
    path: 'projects',
    element: <Projects />
  },
  {
    path: 'tasks',
    element: <Tasks />
  }
]