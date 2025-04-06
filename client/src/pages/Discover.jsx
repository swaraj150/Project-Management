import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaLongArrowAltRight } from 'react-icons/fa'


import CreateOrganization from '../components/common/CreateOrganization'
import JoinOrganization from '../components/common/JoinOrganization'

const cards = [
  {
    h1: "Organizations",
    p: "Organizations are the foundation of our platform, providing a structured environment for teams to collaborate and achieve their goals. Our system follows a virtual hierarchy that mirrors real-world organizational structures.",
    ul: [
      "Centralized dashboard for managing all organizational activities and resources",
      "Customizable roles and permissions with proper project authorities",
      "Role-based access control for secure management (Product Owner, Project Manager, Team Lead, Developer, QA, Stakeholder)",
      "Cross-team collaboration features and communication channels",
      "Intelligent workload distribution based on team capacity",
      "Enterprise-grade security with role-based access control"
    ]
  },
  {
    h1: "Projects",
    p: "Projects are where ideas transform into reality. Our comprehensive project management system helps teams plan, execute, and monitor their initiatives effectively using modern Agile methodologies.",
    ul: [
      "Real-time project tracking and monitoring capabilities",
      "Function Point Analysis for project complexity estimation",
      "Budget calculation and resource allocation tools",
      "Customizable project templates for different methodologies (Agile, Waterfall)",
      "Risk assessment and mitigation planning features",
      "Comprehensive reporting tools for project analytics",
      "Integration with version control systems and CI/CD pipelines"
    ]
  },
  {
    h1: "Teams",
    p: "Teams are the heartbeat of successful organizations. Our platform enables seamless collaboration while intelligently managing workload distribution based on expertise and capacity.",
    ul: [
      "Smart team formation based on skill matching and workload analysis",
      "Expertise-based task allocation system",
      "Real-time collaboration tools for remote and hybrid teams",
      "Team performance metrics and productivity analysis",
      "Workload balancing using advanced algorithms",
      "Skills matrix and team member expertise tracking",
      "Resource optimization using genetic algorithms"
    ]
  },
  {
    h1: "Tasks",
    p: "Tasks are managed through an intelligent system that considers user expertise, current workload, and project priorities to ensure optimal allocation and completion.",
    ul: [
      "AI-powered task assignment based on user expertise",
      "Early risk detection and notification system",
      "Time tracking and effort estimation tools",
      "Custom task fields and categorization",
      "Automated task notifications and reminders",
      "Progress tracking with burndown charts",
      "Integration with popular development tools"
    ]
  }
]

const Discover = () => {
  const navigate = useNavigate()

  const { organization } = useSelector((state) => state.organization)

  const [organizationOption, setOrganizationOption] = useState(0)

  useEffect(() => {
    if (organization) navigate('/dashboard')
  }, [organization])

  return (
    <section id="discover">
      <div className="hero">
        <h1 className="h1">Transform How Your Teams Work</h1>
        <p className='description'>
          Discover our comprehensive project management platform that brings organizations, projects, teams, and tasks together using advanced AI and real-time analytics. Built for modern teams that value efficiency, collaboration, and data-driven decision-making.
        </p>
        <div className="cta">
          <button className={`paper pointer ${organizationOption === 0 ? 'dark-btn' : ''}`} onClick={() => setOrganizationOption(0)} >Join Organization</button>
          <button className={`paper pointer ${organizationOption === 1 ? 'dark-btn' : ''}`} onClick={() => setOrganizationOption(1)} >Create Organization</button>
        </div>
        {
          organizationOption === 0 ? <JoinOrganization /> : <CreateOrganization />
        }
      </div>
      <div className="cards">
        {
          cards.map((card, index) => (
            <div key={index} className="card paper" >
              <h1 className="h1">{card.h1}</h1>
              <p>{card.p}</p>
              <ul>
                {
                  card.ul.map((item, index) => (
                    <li key={index} >
                      <FaLongArrowAltRight />
                      <p>{item}</p>
                    </li>
                  ))
                }
              </ul>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default Discover