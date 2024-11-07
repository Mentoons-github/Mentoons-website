import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function WorkshopFeatureCard() {
  return (
    <Card className="w-full max-w-xl border-2 border-purple-300 rounded-3xl">
      <CardHeader className="bg-pink-300 rounded-t-3xl space-y-2 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-purple-900 hover:bg-pink-400/20"
        >
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-3xl font-medium text-center text-purple-900">
          Interviewing Skills
        </h2>
        <p className="text-center text-purple-900 text-lg pb-4">
          Prepare users for various interview formats and expectations
        </p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-medium text-purple-900 mb-2">
              Interview Etiquette:
            </h3>
            <p className="text-purple-900 text-lg">
              Guidance on professional demeanor and behavior
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-purple-900 mb-2">
              Scheduling the Interview:
            </h3>
            <p className="text-purple-900 text-lg">
              Tips for managing interview timings and confirmations.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-medium text-purple-900 mb-2">
              Face-to-Face and Video Interviewing:
            </h3>
            <p className="text-purple-900 text-lg">
              Best practices for in-person and virtual interviews.
            </p>
          </div>
        </div>

        <div className="bg-pink-200 rounded-xl p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-purple-900 text-lg">Name</label>
              <Input
                placeholder="Enter your Name"
                className="bg-pink-100 border-none placeholder:text-purple-900/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-purple-900 text-lg">Phone no</label>
              <Input
                placeholder="Enter your Phone number"
                className="bg-pink-100 border-none placeholder:text-purple-900/50"
              />
            </div>
            <Button className="w-32 mx-auto block bg-orange-400 hover:bg-orange-500 text-white rounded-full">
              Request Call
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2 text-center pb-6">
        <p className="text-purple-900 text-lg">
          Click &apos;Request Call&apos; to schedule your free 10-minute
          Complementary call
        </p>
        <p className="text-purple-900">
          <span className="font-semibold">*Available :</span> Monday To Friday,
          Business Hours : 10.00 Am To 6.00 Pm
        </p>
      </CardFooter>
    </Card>
  );
}
