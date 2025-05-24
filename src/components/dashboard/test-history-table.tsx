"use client"

import Link from "next/link"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Download, Share } from "lucide-react"
import { useTestStore } from "@/stores/testStore"

export function TestHistoryTable() {
  const tests = useTestStore((state) => state.tests)

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

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 mb-4 text-lg">No tests you have done till now.</p>
        <Link href="/Interview/questions">
          <Button>Take Test</Button>
        </Link>
      </div>
    )
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
