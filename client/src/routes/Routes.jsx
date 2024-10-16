import LandingPage from '../pages/LandingPage'
import SigninPage from '../pages/SigninPage'
import SignupPage from '../pages/SignupPage'
import HomePage from '../pages/HomePage'

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
    index: true,
    element: <HomePage />
  }
]