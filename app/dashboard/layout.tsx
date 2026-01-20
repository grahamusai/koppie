import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from './components/sidebar'
import ProtectedRoute from '@/components/protected-route'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Dashboard | Manage your invoices',
    description: 'Manage your invoices',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex bg-primary">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
                <div className="p-6 max-w-8xl mx-auto">
                    <main className="w-full bg-[#f3f7f6] rounded-lg p-6 min-h-[90vh]">
                        <ProtectedRoute>
                            {children}
                        </ProtectedRoute>
                    </main>
                </div>
            </div>
        </div>
    )
}