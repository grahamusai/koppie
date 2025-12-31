import React from 'react'
import { getCustomers } from '../../customers/actions'
import NewProjectForm from '../components/NewProjectForm'

const NewProjectPage = async () => {
    const customers = await getCustomers()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">New Project</h1>
            <NewProjectForm customers={customers} />
        </div>
    )
}

export default NewProjectPage