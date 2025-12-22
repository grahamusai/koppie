'use client'

import { useAuth } from '@/lib/auth-context'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutList,
  FileChartColumnIncreasing,
  Users,
  Settings,
  FileText,
  Calendar,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Projects', href: '/dashboard/projects', icon: LayoutList },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Tasks', href: '/dashboard/tasks', icon: Calendar },
  { name: 'Reports', href: '/dashboard/reports', icon: FileChartColumnIncreasing },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center mt-16">
            <div className="flex items-center gap-x-3 ">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">John Doe</p>
                <p className="text-xs text-gray-400 truncate">john.doe@example.com</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                            ${isActive
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }
                          `}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/dashboard/help"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <HelpCircle className="h-6 w-6 shrink-0" />
                  Help & Support
                </Link>
                <Button
                  onClick={handleSignOut}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <LogOut className="h-6 w-6 shrink-0" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">John Doe</p>
                  <p className="text-xs text-gray-400 truncate">john.doe@example.com</p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
                <li className="mt-8 space-y-1">
                  <Link
                    href="/dashboard/help"
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <HelpCircle className="h-6 w-6 shrink-0" />
                    Help & Support
                  </Link>
                  <Button
                    href="/logout"
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <LogOut className="h-6 w-6 shrink-0" />
                    Sign out
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}