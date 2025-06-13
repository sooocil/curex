"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Download, Share, Trash } from "lucide-react";
import { useTestStore } from "@/stores/useTestStore";
import { Skeleton } from "@/components/ui/skeleton";

export function TestHistoryTable() {
  const { userId } = useParams<{ userId: string }>();
  const { filteredTests, fetchTests, isLoading, deleteTest } = useTestStore();

  useEffect(() => {
    if (userId) fetchTests(userId);
  }, [userId]);

  const getResultBadge = (result: string) => {
    const styleMap: Record<string, string> = {
      Normal: "bg-green-500 text-white",
      Low: "bg-yellow-500 text-white",
      High: "bg-orange-500 text-white",
      Abnormal: "bg-red-500 text-white",
    };
    return (
      <Badge className={styleMap[result] || "bg-gray-300"}>
        {result || "Unknown"}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Symptom Assessments</h2>
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
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-10 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!filteredTests || filteredTests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">No Tests Found</h2>
        <p className="text-gray-500 mb-4 text-base">
          Looks like you haven’t taken any symptom assessments yet.
        </p>
        <Button
          size="lg"
          onClick={() =>
            (window.location.href = `/Interview/${userId}/questions`)
          }
        >
          Take Your First Test
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Test History</h2>
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
          {filteredTests.map((test) => (
            <TableRow
              key={test.id}
              className="hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">{test.name || "Untitled"}</TableCell>
              <TableCell>{test.date || "N/A"}</TableCell>
              <TableCell className="hidden md:table-cell">{test.doctor || "N/A"}</TableCell>
              <TableCell>{getResultBadge(test.result)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 font-poppins">
                    <DropdownMenuItem asChild className="flex items-center hover:cursor-pointer ">
                      <Link href={`/dashboard/tests/${test.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center hover:cursor-pointer ">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center hover:cursor-pointer ">
                      <Share className="mr-2 h-4 w-4" />
                      Share with Doctor
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteTest(test.id, userId!)}
                      className="flex items-center hover:cursor-pointer "
                    >
                      <Trash className="mr-2 h-4 w-4 fill-current text-red-600" />
                      <span className="text-red-600">Delete Test</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
