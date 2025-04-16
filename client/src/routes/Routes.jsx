import LandingPage from '../pages/LandingPage'
import SigninPage from '../pages/SigninPage'
import SignupPage from '../pages/SignupPage'
import Profile from '../pages/Profile'
import Discover from '../pages/Discover'
import Dashboard from '../pages/DashBoard'
import Organization from '../pages/Organization'
import Teams from '../pages/Teams'
import CreateTeam from '../pages/CreateTeam'
import TeamDetails from '../pages/TeamDetails'
import Projects from '../pages/Projects'
import CreateProject from '../pages/CreateProject'
import ProjectDetails from '../pages/ProjectDetails'
import Tasks from '../pages/Tasks'
import CreateTask from '../pages/CreateTask'
import UpdateTask from '../pages/UpdateTask'
import Chats from '../pages/Chats'

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
    path: 'profile/:profileName',
    element: <Profile />
  },
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
    path: 'teams/create',
    element: <CreateTeam />
  },
  {
    path: 'teams/:teamName',
    element: <TeamDetails />
  },
  {
    path: 'projects',
    element: <Projects />
  },
  {
    path: 'projects/create',
    element: <CreateProject />
  },
  {
    path: 'projects/:projectName',
    element: <ProjectDetails />
  },
  {
    path: 'tasks',
    element: <Tasks />
  },
  {
    path: 'tasks/create',
    element: <CreateTask />
  },
  {
    path: 'tasks/update',
    element: <UpdateTask />
  },
  {
    path: 'chats',
    element: <Chats />
  }
]