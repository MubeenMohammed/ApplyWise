import Header from "@/components/header";
import JobTrackerTable from "@/components/JobTrackerTable";

export default function dashboardPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-start my-24 mx-10">
        <JobTrackerTable />
      </div>
    </>
  );
}
