import { useFormik } from 'formik'
import React from 'react'

const ProjectForm = () => {
  const projectForm = useFormik({
    initialValues: {
      title: '',
      description: '',
      estimatedEndDate: '',
      budget: ''
    },
    
  })

  return (
    <div className="project-form">
      hello
    </div>
  )
}

export default ProjectForm