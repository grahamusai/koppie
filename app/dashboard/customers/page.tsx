// app/dashboard/customers/page.tsx
import { getCustomers } from "./actions"
import CustomersView from "./customer-view"

export default async function CustomersPage() {
    // 1. Fetch live datas
    const customers = await getCustomers()

    // 2. Pass to the client view
    return <CustomersView data={customers} />
}