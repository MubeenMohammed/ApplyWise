import { GalleryVerticalEnd } from "lucide-react";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 bg-[#F4F4F5]">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
            <GalleryVerticalEnd className="size-4" />
          </div>
          ApplyWise
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
