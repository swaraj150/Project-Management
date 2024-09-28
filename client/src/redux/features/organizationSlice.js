import { createSlice } from '@reduxjs/toolkit'

export const organizationSlice = createSlice({
  name: 'Organization',
  initialState: {
    organization: {
      name: 'test_org1',
      productOwner: {
        name: 'productowner',
        username: 'productowner_7014',
        email: 'productowner@example.com',
        role: 'USER',
        projectRole: 'PRODUCT_OWNER'
      },
      projectManager: {
        name: 'pm',
        username: 'pm_8464',
        email: 'pm@example.com',
        role: 'USER',
        projectRole: 'PROJECT_MANAGER'
      },
      stakeholders: [
        {
          name: 'stakeholder',
          username: 'stakeholder_7668',
          email: 'stakeholder@example.com',
          role: 'USER',
          projectRole: 'STAKEHOLDER'
        }
      ],
      members: [
        {
          name: 'productowner',
          username: 'productowner_7014',
          email: 'productowner@example.com',
          role: 'USER',
          projectRole: 'PRODUCT_OWNER'
        },
        {
          name: 'pm',
          username: 'pm_8464',
          email: 'pm@example.com',
          role: 'USER',
          projectRole: 'PROJECT_MANAGER'
        },
        {
          name: 'stakeholder',
          username: 'stakeholder_7668',
          email: 'stakeholder@example.com',
          role: 'USER',
          projectRole: 'STAKEHOLDER'
        },
        {
          name: 'dev2',
          username: 'dev2_8650',
          email: 'dev2@example.com',
          role: 'USER',
          projectRole: 'DEVELOPER'
        },
        {
          name: 'teamlead',
          username: 'teamlead_1445',
          email: 'teamlead@example.com',
          role: 'USER',
          projectRole: 'DEVELOPER'
        },
        {
          name: 'qa1',
          username: 'qa1_4025',
          email: 'qa1@example.com',
          role: 'USER',
          projectRole: 'QA'
        },
        {
          name: 'dev1',
          username: 'dev1_8170',
          email: 'dev1@example.com',
          role: 'USER',
          projectRole: 'DEVELOPER'
        }
      ],
      code: '017deeb'
    }
  },
  reducers: {
    setOrganization: (state, action) => {
      state.organization = action.payload
    }
  }
})

export const {
  setOrganization
} = organizationSlice.actions

export default organizationSlice.reducer