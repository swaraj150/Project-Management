import { createSlice } from '@reduxjs/toolkit'

export const organizationSlice = createSlice({
  name: 'Organization',
  initialState: {
    organization: {
      id: "a6afb4f2-ec3f-498f-bcdc-8d692bc3cc56",
      name: "Tech Innovations Inc.",
      teams: [
        "team_alpha",
        "design_team",
        "cloud_migration_team",
        "product_team",
        "data_team"
      ],
      projects: [
        "1a2b3c4d-1234-5678-9abc-d9e8f7a6b5c4",
        "2b3c4d5e-2345-6789-0abc-e7f8d6c5b4a3",
        "3c4d5e6f-3456-7890-1abc-d9e8f7b6c5a4",
        "4d5e6f7g-4567-8901-2abc-d9e8f7c6b5d4",
        "5e6f7g8h-5678-9012-3abc-d9e8f7c5b4a3"
      ],
      productOwner: {
        id: "product_owner_alice_johnson",
        name: "Alice Johnson",
        username: "alice_johnson",
        emails: ["alice.johnson@techinnovations.com"],
        role: "USER",
        projectRole: "Product Owner"
      },
      stakeholders: [
        {
          id: "stakeholder_david_green",
          name: "David Green",
          username: "david_green",
          emails: ["david.green@venturepartners.com"],
          role: "USER",
          projectRole: "Stakeholder"
        },
        {
          id: "stakeholder_jessica_wright",
          name: "Jessica Wright",
          username: "jessica_wright",
          emails: ["jessica.wright@venturepartners.com"],
          role: "USER",
          projectRole: "Stakeholder"
        },
        {
          id: "stakeholder_sarah_taylor",
          name: "Sarah Taylor",
          username: "sarah_taylor",
          emails: ["sarah.taylor@venturepartners.com"],
          role: "USER",
          projectRole: "Stakeholder"
        }
      ],
      members: [
        {
          id: "dev_john_smith",
          name: "John Smith",
          username: "john_smith",
          emails: ["john.smith@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "dev_emily_davis",
          name: "Emily Davis",
          username: "emily_davis",
          emails: ["emily.davis@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "qa_michael_brown",
          name: "Michael Brown",
          username: "michael_brown",
          emails: ["michael.brown@techinnovations.com"],
          role: "USER",
          projectRole: "QA"
        },
        {
          id: "dev_mark_thompson",
          name: "Mark Thompson",
          username: "mark_thompson",
          emails: ["mark.thompson@techinnovations.com"],
          role: "USER",
          projectRole: "Project Manager"
        },
        {
          id: "dev_david_harris",
          name: "David Harris",
          username: "david_harris",
          emails: ["david.harris@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "dev_olivia_carter",
          name: "Olivia Carter",
          username: "olivia_carter",
          emails: ["olivia.carter@techinnovations.com"],
          role: "USER",
          projectRole: "QA"
        },
        {
          id: "dev_ethan_cooper",
          name: "Ethan Cooper",
          username: "ethan_cooper",
          emails: ["ethan.cooper@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "dev_sophia_martinez",
          name: "Sophia Martinez",
          username: "sophia_martinez",
          emails: ["sophia.martinez@techinnovations.com"],
          role: "USER",
          projectRole: "Designer"
        },
        {
          id: "dev_mason_walker",
          name: "Mason Walker",
          username: "mason_walker",
          emails: ["mason.walker@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "dev_ava_phillips",
          name: "Ava Phillips",
          username: "ava_phillips",
          emails: ["ava.phillips@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "dev_isabella_clark",
          name: "Isabella Clark",
          username: "isabella_clark",
          emails: ["isabella.clark@techinnovations.com"],
          role: "USER",
          projectRole: "Developer"
        },
        {
          id: "pm_james_hill",
          name: "James Hill",
          username: "james_hill",
          emails: ["james.hill@techinnovations.com"],
          role: "USER",
          projectRole: "Project Manager"
        },
        {
          id: "team_lead_laura_lee",
          name: "Laura Lee",
          username: "laura_lee",
          emails: ["laura.lee@techinnovations.com"],
          role: "USER",
          projectRole: "Team Lead"
        },
        {
          id: "team_lead_charlotte_young",
          name: "Charlotte Young",
          username: "charlotte_young",
          emails: ["charlotte.young@techinnovations.com"],
          role: "USER",
          projectRole: "Team Lead"
        }
      ]
    },
    requests: [
      {
        id: "d4f70b8e-21d6-4f61-8a4c-42c7e8f8bb57",
        username: "john_doe_4578",
        name: "John Doe",
        projectRole: "Developer",
        emails: ["john.doe@example.com"]
      },
      {
        id: "b9d93dcb-14a5-4833-b7c7-e86b8e8f84c4",
        username: "jane_smith_9874",
        name: "Jane Smith",
        projectRole: "QA",
        emails: ["jane.smith@example.com"]
      },
      {
        id: "c64f1a17-b9e5-40a7-9d34-c041ff7f3015",
        username: "michael_jones_1234",
        name: "Michael Jones",
        projectRole: "Team Lead",
        emails: ["michael.jones@example.com"]
      },
      {
        id: "f77e7a8a-5df1-420b-9205-b3ebc7f7074f",
        username: "sarah_lee_5432",
        name: "Sarah Lee",
        projectRole: "Designer",
        emails: ["sarah.lee@example.com"]
      },
      {
        id: "b8cf9d67-f527-46b9-9cf6-13fbf74e21a3",
        username: "david_clark_9021",
        name: "David Clark",
        projectRole: "Project Manager",
        emails: ["david.clark@example.com"]
      },
      {
        id: "4c1961d4-5d9f-4b02-8888-31d3fd8c953b",
        username: "laura_wilson_7452",
        name: "Laura Wilson",
        projectRole: "Stakeholder",
        emails: ["laura.wilson@example.com"]
      },
      {
        id: "eda8f55a-3e15-41ec-b5c1-03baae8a6f1c",
        username: "emma_martinez_6378",
        name: "Emma Martinez",
        projectRole: "QA",
        emails: ["emma.martinez@example.com"]
      },
      {
        id: "93d7925f-c0b4-4e0a-a2b6-8c60ec76f832",
        username: "chris_watson_8264",
        name: "Chris Watson",
        projectRole: "Developer",
        emails: ["chris.watson@example.com"]
      },
      {
        id: "56a19a39-72b5-40e2-bb95-3cb4bc1780df",
        username: "amy_taylor_3517",
        name: "Amy Taylor",
        projectRole: "Project Manager",
        emails: ["amy.taylor@example.com"]
      },
      {
        id: "f8f74cd8-b43f-45fa-bfe7-576e434d89cf",
        username: "oliver_reed_6129",
        name: "Oliver Reed",
        projectRole: "Developer",
        emails: ["oliver.reed@example.com"]
      },
      {
        id: "8a934cc7-084b-4adf-993e-b5b467f9c347",
        username: "lucy_patel_3902",
        name: "Lucy Patel",
        projectRole: "Team Lead",
        emails: ["lucy.patel@example.com"]
      },
      {
        id: "1cbe4d33-1b8f-4d27-832e-df39b9d47453",
        username: "joshua_white_7483",
        name: "Joshua White",
        projectRole: "Designer",
        emails: ["joshua.white@example.com"]
      },
      {
        id: "3b07d670-58f2-4d0a-a85a-e2e07e9da732",
        username: "zoe_baker_2051",
        name: "Zoe Baker",
        projectRole: "Developer",
        emails: ["zoe.baker@example.com"]
      },
      {
        id: "69ebbd82-6fa0-4ab0-a16d-9269636475cb",
        username: "samuel_foster_1826",
        name: "Samuel Foster",
        projectRole: "QA",
        emails: ["samuel.foster@example.com"]
      },
      {
        id: "ddf5d7d8-f4d6-490f-8966-bf2fdf3c11e5",
        username: "mia_gomez_2490",
        name: "Mia Gomez",
        projectRole: "Stakeholder",
        emails: ["mia.gomez@example.com"]
      },
      {
        id: "bb3f3d83-b5de-4694-a18e-9f9402f98e20",
        username: "liam_parker_3469",
        name: "Liam Parker",
        projectRole: "Developer",
        emails: ["liam.parker@example.com"]
      },
      {
        id: "aa29f634-8f1f-44a9-9edb-50ff5f4d5d43",
        username: "emily_evans_7528",
        name: "Emily Evans",
        projectRole: "QA",
        emails: ["emily.evans@example.com"]
      },
      {
        id: "7c2a02ed-27fa-4de6-b9d9-38cfaed83b9b",
        username: "daniel_hall_4837",
        name: "Daniel Hall",
        projectRole: "Team Lead",
        emails: ["daniel.hall@example.com"]
      },
      {
        id: "1c43c8e9-18fc-4032-bf23-648d49e460a7",
        username: "ava_williams_6172",
        name: "Ava Williams",
        projectRole: "Designer",
        emails: ["ava.williams@example.com"]
      },
      {
        id: "49bdf999-76cb-4784-b7d2-8366348c1d34",
        username: "jack_turner_5298",
        name: "Jack Turner",
        projectRole: "Project Manager",
        emails: ["jack.turner@example.com"]
      }
    ]
  },
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload.organization
    },
    addMember: (state, action) => {
      state.organization.members = [...state.organization.members, action.payload]
    },
    setRequests: (state, action) => {
      state.requests = action.payload
    },
    removeRequest: (state, action) => {
      const { requestId } = action.payload
      state.requests = [...state.requests.filter((request) => request.id !== requestId)]
    }
  }
})

export const {
  setOrganization,
  addMember,
  changeMemberRole,
  setRequests,
  removeRequest
} = organizationSlice.actions

export default organizationSlice.reducer