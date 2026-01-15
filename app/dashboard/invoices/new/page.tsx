import React from 'react'
import { getCustomers } from '../../customers/actions'
import { getProjects } from '../../projects/actions'
import NewInvoiceForm from '../components/NewInvoiceForm'

const NewInvoicePage = async () => {
    const [customers, projects] = await Promise.all([
        getCustomers(),
        getProjects()
    ])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">New Invoice</h1>
            <NewInvoiceForm customers={customers} projects={projects} />
        </div>
    )
}

export default NewInvoicePage