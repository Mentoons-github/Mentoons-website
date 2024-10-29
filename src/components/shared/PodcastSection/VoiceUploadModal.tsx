"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function VoiceSampleUpload() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className='w-full '>
        <Button className='w-full sm:w-auto bg-transparent text-2xl font-bold hover:bg-transparent  '>
          Upload Voice Sample
        </Button>
      </DialogTrigger>
      <DialogContent className='w-[95vw] max-w-[425px] sm:w-full z-[9999999] rounded-xl  '>
        <DialogHeader>
          <DialogTitle className='text-lg sm:text-xl md:text-2xl'>
            Upload Voice Sample
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
          <div className='space-y-2 '>
            <Label htmlFor='name' className='text-sm sm:text-base'>
              Your Name
            </Label>
            <Input
              id='name'
              placeholder='Enter your name'
              required
              className='w-full '
            />
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
            <div className='space-y-2'>
              <Label htmlFor='age' className='text-sm sm:text-base'>
                Gender
              </Label>
              <Input
                id='gender'
                type='text'
                placeholder='Gender'
                required
                className='w-full'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='age' className='text-sm sm:text-base'>
                Narrator's Age
              </Label>
              <Input
                id='age'
                type='number'
                placeholder='Enter your age'
                required
                className='w-full'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='voice-sample' className='text-sm sm:text-base'>
              Voice Sample
            </Label>
            <Input
              id='voice-sample'
              type='file'
              accept='audio/*'
              required
              className='w-full'
            />
          </div>
          <Button type='submit' className='w-full mt-6'>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
