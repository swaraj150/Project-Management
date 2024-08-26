import HomePage from '../pages/HomePage'
import SigninPage from '../pages/SigninPage'
import SignupPage from '../pages/SignupPage'

export const publicRoutes = [
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