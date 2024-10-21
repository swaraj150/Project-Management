import { createSlice } from '@reduxjs/toolkit'

export const projectsSlice = createSlice({
  name: 'Projects',
  initialState: {
    projects: [
      // {
      //   id: "1a2b3c4d-1234-5678-9abc-d9e8f7a6b5c4",
      //   title: "AI Chatbot Integration",
      //   description: "Develop an AI-powered chatbot for customer support.",
      //   tasks: [],
      //   teams: ["team_alpha"],
      //   projectManager: {
      //     id: "pm_mark_thompson",
      //     name: "Mark Thompson",
      //     username: "mark_thompson",
      //     emails: ["mark.thompson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-07-01",
      //   estimatedEndDate: "2024-10-31",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 50000,
      //   completionStatus: null
      // },
      // {
      //   id: "2b3c4d5e-2345-6789-0abc-e7f8d6c5b4a3",
      //   title: "Mobile App Redesign",
      //   description: "Complete UI/UX overhaul of the company’s mobile app.",
      //   tasks: [],
      //   teams: ["design_team"],
      //   projectManager: {
      //     id: "pm_james_hill",
      //     name: "James Hill",
      //     username: "james_hill",
      //     emails: ["james.hill@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-05-15",
      //   estimatedEndDate: "2024-11-20",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 100000,
      //   completionStatus: null
      // },
      // {
      //   id: "3c4d5e6f-3456-7890-1abc-d9e8f7b6c5a4",
      //   title: "Cloud Migration",
      //   description: "Migrate all on-prem services to AWS cloud infrastructure.",
      //   tasks: [],
      //   teams: ["cloud_migration_team"],
      //   projectManager: {
      //     id: "pm_mark_thompson",
      //     name: "Mark Thompson",
      //     username: "mark_thompson",
      //     emails: ["mark.thompson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-08-01",
      //   estimatedEndDate: "2025-02-15",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 200000,
      //   completionStatus: null
      // },
      // {
      //   id: "4d5e6f7g-4567-8901-2abc-d9e8f7c6b5d4",
      //   title: "E-commerce Platform Revamp",
      //   description: "Implement new features and improve scalability of the e-commerce platform.",
      //   tasks: [],
      //   teams: ["product_team"],
      //   projectManager: {
      //     id: "pm_james_hill",
      //     name: "James Hill",
      //     username: "james_hill",
      //     emails: ["james.hill@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-06-01",
      //   estimatedEndDate: "2024-12-30",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 180000,
      //   completionStatus: null
      // },
      // {
      //   id: "5e6f7g8h-5678-9012-3abc-d9e8f7c5b4a3",
      //   title: "Data Warehouse Optimization",
      //   description: "Optimize the data warehouse to improve query performance.",
      //   tasks: [],
      //   teams: ["data_team"],
      //   projectManager: {
      //     id: "pm_mark_thompson",
      //     name: "Mark Thompson",
      //     username: "mark_thompson",
      //     emails: ["mark.thompson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-04-20",
      //   estimatedEndDate: "2024-10-30",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 120000,
      //   completionStatus: null
      // },
      // {
      //   id: "1a2b3c4d-1234-5678-9abc-d9e8f7a6b5c4",
      //   title: "AI Chatbot Integration",
      //   description: "Develop an AI-powered chatbot for customer support.",
      //   tasks: [],
      //   teams: ["team_alpha"],
      //   projectManager: {
      //     id: "pm_mark_thompson",
      //     name: "Mark Thompson",
      //     username: "mark_thompson",
      //     emails: ["mark.thompson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-07-01",
      //   estimatedEndDate: "2024-10-31",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 50000,
      //   completionStatus: null
      // },
      // {
      //   id: "2b3c4d5e-2345-6789-0abc-e7f8d6c5b4a3",
      //   title: "Mobile App Redesign",
      //   description: "Complete UI/UX overhaul of the company’s mobile app.",
      //   tasks: [],
      //   teams: ["design_team"],
      //   projectManager: {
      //     id: "pm_james_hill",
      //     name: "James Hill",
      //     username: "james_hill",
      //     emails: ["james.hill@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-05-15",
      //   estimatedEndDate: "2024-11-20",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 100000,
      //   completionStatus: null
      // },
      // {
      //   id: "3c4d5e6f-3456-7890-1abc-d9e8f7b6c5a4",
      //   title: "Cloud Migration",
      //   description: "Migrate all on-prem services to AWS cloud infrastructure.",
      //   tasks: [],
      //   teams: ["cloud_migration_team"],
      //   projectManager: {
      //     id: "pm_mark_thompson",
      //     name: "Mark Thompson",
      //     username: "mark_thompson",
      //     emails: ["mark.thompson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-08-01",
      //   estimatedEndDate: "2025-02-15",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 200000,
      //   completionStatus: null
      // },
      // {
      //   id: "4d5e6f7g-4567-8901-2abc-d9e8f7c6b5d4",
      //   title: "E-commerce Platform Revamp",
      //   description: "Implement new features and improve scalability of the e-commerce platform.",
      //   tasks: [],
      //   teams: ["product_team"],
      //   projectManager: {
      //     id: "pm_james_hill",
      //     name: "James Hill",
      //     username: "james_hill",
      //     emails: ["james.hill@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-06-01",
      //   estimatedEndDate: "2024-12-30",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 180000,
      //   completionStatus: null
      // },
      // {
      //   id: "5e6f7g8h-5678-9012-3abc-d9e8f7c5b4a3",
      //   title: "Data Warehouse Optimization",
      //   description: "Optimize the data warehouse to improve query performance.",
      //   tasks: [],
      //   teams: ["data_team"],
      //   projectManager: {
      //     id: "pm_mark_thompson",
      //     name: "Mark Thompson",
      //     username: "mark_thompson",
      //     emails: ["mark.thompson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Project Manager"
      //   },
      //   startDate: "2024-04-20",
      //   estimatedEndDate: "2024-10-30",
      //   endDate: null,
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   budget: 120000,
      //   completionStatus: null
      // }
    ]
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload.projects
    },
    addProject: (state, action) => {
      state.projects = [...state.projects, action.payload]
    }
  }
})

export const {
  setProjects,
  addProject
} = projectsSlice.actions

export default projectsSlice.reducer