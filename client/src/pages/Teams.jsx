import React from 'react'
import { MdDelete } from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'

import TeamsList from '../components/common/TeamsList'

const Teams = () => {
  return (
    <section id="teams">
      <div className="heading">
        <h2 className="title h1">Teams</h2>
        <div className="cta">
          <button>
            <MdDelete />
            <p>Delete Team</p>
          </button>
          <button>
            <IoMdAdd />
            <p>Create Team</p>
          </button>
        </div>
      </div>
      <TeamsList />
    </section>
  )
}

export default Teams