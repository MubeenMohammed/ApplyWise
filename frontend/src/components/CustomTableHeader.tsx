import { UploadDialog } from "./UploadDialog";

export default function CustomTableHeader() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <div className="flex-1 mx-10"></div>
        <UploadDialog />
      </div>
    </>
  );
}
