export const formatDate = (dateString) => {
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', options)
}

export const formatBudget = (budget) => {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(budget)
}

export const technologies = {
  react: 'REACT',
  vue: 'VUE',
  angular: 'ANGULAR',
  nextjs: 'NEXT_JS',
  redux: 'REDUX',
  zustand: 'ZUSTAND',
  springBoot: 'SPRING_BOOT',
  nodejs: 'NODE_JS',
  express: 'EXPRESS',
  nestjs: 'NEST_JS',
  postgresql: 'POSTGRESQL',
  mongodb: 'MONGODB',
  mysql: 'MYSQL',
  socketio: 'SOCKET_IO',
  signalr: 'SIGNALR',
  jwt: 'JWT',
  oauth2: 'OAUTH2',
  firebaseAuth: 'FIREBASE_AUTH',
  auth0: 'AUTH0',
  tailwind: 'TAILWIND_CSS',
  materialUI: 'MATERIAL_UI',
  docker: 'DOCKER',
  githubActions: 'GITHUB_ACTIONS',
  jest: 'JEST',
  cypress: 'CYPRESS',
  firebase: 'FIREBASE',
  aws: 'AWS',
  vercel: 'VERCEL',
  netlify: 'NETLIFY',
  swagger: 'SWAGGER',
  postman: 'POSTMAN',
  stripe: 'STRIPE',
  sendgrid: 'SENDGRID',
  onesignal: 'ONESIGNAL',
  firebaseMessaging: 'FIREBASE_MESSAGING'
}

export const technologyLabels = [
  {
    label: 'Frontend',
    options: [
      { value: technologies.react, label: 'React' },
      { value: technologies.vue, label: 'Vue.js' },
      { value: technologies.angular, label: 'Angular' },
      { value: technologies.nextjs, label: 'Next.js' }
    ]
  },
  {
    label: 'State Management',
    options: [
      { value: technologies.redux, label: 'Redux Toolkit' },
      { value: technologies.zustand, label: 'Zustand' }
    ]
  },
  {
    label: 'Backend',
    options: [
      { value: technologies.springBoot, label: 'Spring Boot' },
      { value: technologies.nodejs, label: 'Node.js' },
      { value: technologies.express, label: 'Express.js' },
      { value: technologies.nestjs, label: 'NestJS' }
    ]
  },
  {
    label: 'Database',
    options: [
      { value: technologies.postgresql, label: 'PostgreSQL' },
      { value: technologies.mongodb, label: 'MongoDB' },
      { value: technologies.mysql, label: 'MySQL' }
    ]
  },
  {
    label: 'WebSockets / Realtime',
    options: [
      { value: technologies.socketio, label: 'Socket.IO' },
      { value: technologies.signalr, label: 'SignalR' }
    ]
  },
  {
    label: 'Authentication',
    options: [
      { value: technologies.jwt, label: 'JWT' },
      { value: technologies.oauth2, label: 'OAuth2' },
      { value: technologies.firebaseAuth, label: 'Firebase Auth' },
      { value: technologies.auth0, label: 'Auth0' }
    ]
  },
  {
    label: 'Styling / UI',
    options: [
      { value: technologies.tailwind, label: 'Tailwind CSS' },
      { value: technologies.materialUI, label: 'Material UI' }
    ]
  },
  {
    label: 'Cloud & Deployment',
    options: [
      { value: technologies.docker, label: 'Docker' },
      { value: technologies.githubActions, label: 'GitHub Actions' },
      { value: technologies.firebase, label: 'Firebase' },
      { value: technologies.aws, label: 'AWS' },
      { value: technologies.vercel, label: 'Vercel' },
      { value: technologies.netlify, label: 'Netlify' }
    ]
  },
  {
    label: 'Testing',
    options: [
      { value: technologies.jest, label: 'Jest' },
      { value: technologies.cypress, label: 'Cypress' }
    ]
  },
  {
    label: 'API / Docs',
    options: [
      { value: technologies.swagger, label: 'Swagger' },
      { value: technologies.postman, label: 'Postman' }
    ]
  },
  {
    label: 'Payments & Messaging',
    options: [
      { value: technologies.stripe, label: 'Stripe' },
      { value: technologies.sendgrid, label: 'SendGrid' },
      { value: technologies.onesignal, label: 'OneSignal' },
      { value: technologies.firebaseMessaging, label: 'Firebase Messaging' }
    ]
  }
]