"use client"

import React, { useState, useEffect } from 'react'
import { getProjects } from './actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Link from "next/link"

type Project = {
  id: string
  name: string
  description: string | null
  status: string
  priority: string
  startDate: string | null
  endDate: string | null
  budget: number | null
  customerName: string
  customerEmail: string
  createdDate: string
  updatedDate: string
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    // Filter by search term (name, customer name, or customer email)
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(project => project.priority === priorityFilter)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, statusFilter, priorityFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setPriorityFilter("all")
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button className='' asChild>
          <Link href="/dashboard/projects/new">New Project</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 bg-transparent border-0 shadow-none">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type='text' 
              placeholder="Search projects, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className=''>
                <SelectItem className='' value="all">All Status</SelectItem>
                <SelectItem className='' value="active">Active</SelectItem>
                <SelectItem className='' value="inactive">Inactive</SelectItem>
                <SelectItem className='' value="completed">Completed</SelectItem>
                <SelectItem className='' value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className=''>
                <SelectItem className='' value="all">All Priority</SelectItem>
                <SelectItem className='' value="low">Low</SelectItem>
                <SelectItem className='' value="medium">Medium</SelectItem>
                <SelectItem className='' value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Button className='' variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  {projects.length === 0 ? (
                    <>No projects found. <Link href="/dashboard/projects/new" className="text-primary hover:underline">Create your first project</Link></>
                  ) : (
                    "No projects match your filters"
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.customerName}</TableCell>
                  <TableCell>
                    <Badge className='' variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className='' variant={
                      project.priority === 'high' ? 'destructive' :
                        project.priority === 'medium' ? 'default' : 'secondary'
                    }>
                      {project.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.startDate || '-'}</TableCell>
                  <TableCell>{project.endDate || '-'}</TableCell>
                  <TableCell>
                    {project.budget ? `R${project.budget.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    <Button className='' variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Projects