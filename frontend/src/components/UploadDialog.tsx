import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      onOpenChange={setOpen}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#F4F4F5] text-black hover:bg-[#E2E8F0] cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>
            Please upload your resume in PDF format. The file size should not
            exceed 5MB.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="resume"
              className="text-right"
            >
              Upload Here
            </Label>
            <Input
              id="resume"
              className="col-span-3 border-gray-400"
              type="file"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-black text-white"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
