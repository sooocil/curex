"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Share } from "lucide-react"

const testHistory = [
  {
    id: "test-1",
    name: "Complete Blood Count",
    date: "2023-04-15",
    doctor: "Dr. Sarah Johnson",
    result: "Normal",
  },
  {
    id: "test-2",
    name: "Lipid Panel",
    date: "2023-04-10",
    doctor: "Dr. Michael Chen",
    result: "Abnormal",
  },
  {
    id: "test-3",
    name: "Thyroid Function",
    date: "2023-03-28",
    doctor: "Dr. Emily Rodriguez",
    result: "Normal",
  },
  {
    id: "test-4",
    name: "Vitamin D",
    date: "2023-03-15",
    doctor: "Dr. James Wilson",
    result: "Low",
  },
  {
    id: "test-5",
    name: "Comprehensive Metabolic Panel",
    date: "2023-02-20",
    doctor: "Dr. Sarah Johnson",
    result: "Normal",
  },
  {
    id: "test-6",
    name: "Hemoglobin A1C",
    date: "2023-02-10",
    doctor: "Dr. Michael Chen",
    result: "High",
  },
  {
    id: "test-7",
    name: "Urinalysis",
    date: "2023-01-25",
    doctor: "Dr. Emily Rodriguez",
    result: "Normal",
  },
  {
    id: "test-8",
    name: "Liver Function",
    date: "2023-01-15",
    doctor: "Dr. James Wilson",
    result: "Normal",
  },
]

export function TestHistoryTable() {
  const [tests] = useState(testHistory)

  const getResultBadge = (result: string) => {
    switch (result) {
      case "Normal":
        return <Badge className="bg-green-500">Normal</Badge>
      case "Low":
        return <Badge className="bg-yellow-500">Low</Badge>
      case "High":
        return <Badge className="bg-orange-500">High</Badge>
      case "Abnormal":
        return <Badge className="bg-red-500">Abnormal</Badge>
      default:
        return <Badge>{result}</Badge>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="hidden md:table-cell">Doctor</TableHead>
            <TableHead>Result</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.name}</TableCell>
              <TableCell>{test.date}</TableCell>
              <TableCell className="hidden md:table-cell">{test.doctor}</TableCell>
              <TableCell>{getResultBadge(test.result)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/tests/${test.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share with Doctor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
