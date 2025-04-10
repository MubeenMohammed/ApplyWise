import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataTableCard from "./DataTableCard";
import sampleJobs from "../../data/sampleJobs";
import { Button } from "@/components/ui/button";
import { ChevronUpCircle, ChevronDownCircle, Download } from "lucide-react";
import CustomTableHeader from "./CustomTableHeader";

export default function JobTrackerTable() {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  return (
    <div className="p-6 space-y-6 w-9/12 mx-auto">
      <DataTableCard
        isLoading={false}
        error={null}
      />
      <CustomTableHeader />
      <Table>
        <TableHeader>
          <TableHead></TableHead>
          <TableHead className="font-bold text-lg text-black">
            Job Title
          </TableHead>
          <TableHead className="font-bold text-lg text-black">
            Company
          </TableHead>
          <TableHead className="font-bold text-lg text-black">Status</TableHead>
          <TableHead className="font-bold text-lg text-black">
            Date Applied
          </TableHead>
          <TableHead className="font-bold text-lg text-black">Resume</TableHead>
          <TableHead className="font-bold text-lg text-black">
            Cover Letter
          </TableHead>
        </TableHeader>
        <TableBody>
          {sampleJobs.map((job) => (
            <>
              <TableRow
                key={job.id}
                className="text-start"
              >
                <TableCell>
                  <Button
                    variant="outline"
                    className="p-2 cursor-pointer border-none bg-transparent"
                    onClick={() =>
                      setExpandedRows((prev) => ({
                        ...prev,
                        [job.id]: !prev[job.id],
                      }))
                    }
                  >
                    {expandedRows[job.id] ? (
                      <ChevronUpCircle className="h-7 w-7h-7" />
                    ) : (
                      <ChevronDownCircle className="h-7 w-7h-7" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-start">{job.jobTitle}</TableCell>
                <TableCell className="text-start">{job.company}</TableCell>
                <TableCell className="text-start">{job.status}</TableCell>
                <TableCell className="text-start">{job.dateApplied}</TableCell>
                <TableCell className="text-start">
                  <Button
                    variant={"outline"}
                    className="bg-[#F4F4F5] text-black hover:bg-[#E2E8F0] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Resume
                  </Button>
                </TableCell>
                <TableCell className="text-start">
                  <Button
                    variant={"outline"}
                    className="bg-[#F4F4F5] text-black hover:bg-[#E2E8F0] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Cover Letter
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows[job.id] && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-20"
                  >
                    <div className="flex flex-col space-y-4">
                      <div className="text-lg font-bold">Job Details</div>
                      <div className="text-md">
                        Job Description:{" "}
                        <a href={job.jobLink}> {job.jobLink}</a>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
