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

export default function PodcastDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Listen to Preview</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thank You for Your Interest!</DialogTitle>
          <DialogDescription>
            We're excited to share our full audio content with you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for showing interest in our audio content. To listen to
            the full audio, please log in or create an account.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Logging in gives you access to our complete library of audio content
            and exclusive features.
          </p>
        </div>
        <DialogFooter>
          <Button className="w-full">Log In to Listen to Full Audio</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
