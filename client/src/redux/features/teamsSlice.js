import { createSlice } from '@reduxjs/toolkit'

export const teamsSlice = createSlice({
  name: 'Teams',
  initialState: {
    teams: [
      {"id":"4e805278-2b69-4923-aa88-66ef30869597","name":"test_team","organization":"20f29413-66d0-4fe4-bcd7-a90313f3f44c","developers":[{"name":"Jane Smith","username":"Jane_Smith8792","emails":["jane.smith@example.com"],"role":"USER","projectRole":"DEVELOPER"},{"name":"Chris Brown","username":"Chris_Brown7542","emails":["chris.brown@example.com"],"role":"USER","projectRole":"DEVELOPER"}],"testers":[{"name":"Sarah Wilson","username":"Sarah_Wilson3123","emails":["sarah.wilson@example.com"],"role":"USER","projectRole":"QA"}],"teamLead":{"name":"Alice Brown","username":"Alice_Brown6565","emails":["alice.brown@example.com"],"role":"USER","projectRole":"TEAM_LEAD"}}
      // {
      //   id: "team_alpha",
      //   name: "Tech Innovations Team Alpha",
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   developers: [
      //     {
      //       id: "dev_john_smith",
      //       name: "John Smith",
      //       username: "john_smith",
      //       emails: ["john.smith@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Developer"
      //     },
      //     {
      //       id: "dev_emily_davis",
      //       name: "Emily Davis",
      //       username: "emily_davis",
      //       emails: ["emily.davis@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Developer"
      //     }
      //   ],
      //   testers: [
      //     {
      //       id: "qa_michael_brown",
      //       name: "Michael Brown",
      //       username: "michael_brown",
      //       emails: ["michael.brown@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "QA"
      //     }
      //   ],
      //   teamLead: {
      //     id: "lead_laura_lee",
      //     name: "Laura Lee",
      //     username: "laura_lee",
      //     emails: ["laura.lee@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Team Lead"
      //   }
      // },
      // {
      //   id: "design_team",
      //   name: "Design & Development Team",
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   developers: [
      //     {
      //       id: "dev_isabella_clark",
      //       name: "Isabella Clark",
      //       username: "isabella_clark",
      //       emails: ["isabella.clark@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Developer"
      //     }
      //   ],
      //   testers: [
      //     {
      //       id: "qa_lucas_evans",
      //       name: "Lucas Evans",
      //       username: "lucas_evans",
      //       emails: ["lucas.evans@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "QA"
      //     }
      //   ],
      //   teamLead: {
      //     id: "lead_charlotte_young",
      //     name: "Charlotte Young",
      //     username: "charlotte_young",
      //     emails: ["charlotte.young@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Team Lead"
      //   }
      // },
      // {
      //   id: "cloud_migration_team",
      //   name: "Project Management Team",
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   developers: [
      //     {
      //       id: "dev_david_harris",
      //       name: "David Harris",
      //       username: "david_harris",
      //       emails: ["david.harris@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Developer"
      //     }
      //   ],
      //   testers: [
      //     {
      //       id: "qa_olivia_carter",
      //       name: "Olivia Carter",
      //       username: "olivia_carter",
      //       emails: ["olivia.carter@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "QA"
      //     }
      //   ],
      //   teamLead: {
      //     id: "lead_james_hill",
      //     name: "James Hill",
      //     username: "james_hill",
      //     emails: ["james.hill@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Team Lead"
      //   }
      // },
      // {
      //   id: "product_team",
      //   name: "Product Development Team",
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   developers: [
      //     {
      //       id: "dev_sophia_martinez",
      //       name: "Sophia Martinez",
      //       username: "sophia_martinez",
      //       emails: ["sophia.martinez@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Designer"
      //     },
      //     {
      //       id: "dev_liam_ross",
      //       name: "Liam Ross",
      //       username: "liam_ross",
      //       emails: ["liam.ross@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Developer"
      //     }
      //   ],
      //   testers: [
      //     {
      //       id: "qa_henry_turner",
      //       name: "Henry Turner",
      //       username: "henry_turner",
      //       emails: ["henry.turner@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "QA"
      //     }
      //   ],
      //   teamLead: {
      //     id: "lead_mia_jackson",
      //     name: "Mia Jackson",
      //     username: "mia_jackson",
      //     emails: ["mia.jackson@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Team Lead"
      //   }
      // },
      // {
      //   id: "data_team",
      //   name: "Data Analytics Team",
      //   organizationId: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      //   developers: [
      //     {
      //       id: "dev_noah_garcia",
      //       name: "Noah Garcia",
      //       username: "noah_garcia",
      //       emails: ["noah.garcia@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "Data Scientist"
      //     }
      //   ],
      //   testers: [
      //     {
      //       id: "qa_emma_clark",
      //       name: "Emma Clark",
      //       username: "emma_clark",
      //       emails: ["emma.clark@techinnovations.com"],
      //       role: "USER",
      //       projectRole: "QA"
      //     }
      //   ],
      //   teamLead: {
      //     id: "lead_elijah_rodriguez",
      //     name: "Elijah Rodriguez",
      //     username: "elijah_rodriguez",
      //     emails: ["elijah.rodriguez@techinnovations.com"],
      //     role: "USER",
      //     projectRole: "Team Lead"
      //   }
      // }
    ]
    
  },
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload.teams
    },
    addTeam: (state, action) => {
      state.teams = [...state.teams, action.payload]
    }
  }
})

export const {
  setTeams,
  addTeam
} = teamsSlice.actions

export default teamsSlice.reducer