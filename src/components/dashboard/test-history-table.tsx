"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Download, Share, Trash } from "lucide-react";
import { useTestStore } from "@/stores/useTestStore";
import { Skeleton } from "@/components/ui/skeleton";
import TestWithDoctor from "./testWithDoctor";

export function TestHistoryTable() {
  const { userId } = useParams<{ userId: string }>();
  const { filteredTests, fetchTests, isLoading, deleteTest } = useTestStore();

  const [modalState, setModalState] = useState({
    isOpen: false,
    testId: "",
    userId: "",
  });

  useEffect(() => {
    if (userId) fetchTests(userId);
  }, [userId]);

  const openShareModal = (testId: string) => {
    setModalState({ isOpen: true, testId, userId: userId! });
  };

  const closeShareModal = () => {
    setModalState({ isOpen: false, testId: "", userId: "" });
  };

  const getResultBadge = (result: string) => {
    const styleMap: Record<string, string> = {
      Normal: "bg-green-500 text-white",
      Low: "bg-yellow-500 text-white",
      High: "bg-orange-500 text-white",
      Abnormal: "bg-red-500 text-white",
    };
    return <Badge className={styleMap[result] || "bg-gray-300"}>{result || "Unknown"}</Badge>;
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
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!filteredTests?.length) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">No Tests Found</h2>
        <p className="text-gray-500 mb-4 text-base">Looks like you haven’t taken any symptom assessments yet.</p>
        <Button size="lg" onClick={() => (window.location.href = `/Interview/${userId}/questions`)}>
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
            <TableRow key={test.id} className="hover:bg-muted/50 transition-colors">
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
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/tests/${test.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center" onClick={() => openShareModal(test.id)}>
                      <Share className="mr-2 h-4 w-4" /> Share with Doctor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteTest(test.id, userId!)} className="flex items-center">
                      <Trash className="mr-2 h-4 w-4 text-red-600" />
                      <span className="text-red-600">Delete Test</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TestWithDoctor
        isOpen={modalState.isOpen}
        onClose={closeShareModal}
        testId={modalState.testId}
        userId={modalState.userId}
      />
    </div>
  );
}
