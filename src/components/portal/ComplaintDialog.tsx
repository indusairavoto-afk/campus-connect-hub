import { useEffect, useState } from "react";
import { Paperclip } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "./data";

export type NewComplaint = {
  subject: string;
  category: string;
  urgency: string;
  description: string;
  anonymous: boolean;
  fileName?: string | undefined;
};

const urgencies = ["Low", "Medium", "High", "Critical"];

export function ComplaintDialog({
  open,
  onOpenChange,
  presetCategory,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  presetCategory?: string | undefined;
  onSubmit: (c: NewComplaint) => void;
}) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(presetCategory ?? "");
  const [urgency, setUrgency] = useState("Medium");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();

  useEffect(() => {
    if (open) setCategory(presetCategory ?? "");
  }, [open, presetCategory]);

  const valid = subject.trim().length > 2 && category && description.trim().length > 5;

  function handleSubmit() {
    if (!valid) return;
    onSubmit({ subject, category, urgency, description, anonymous, fileName });
    setSubject("");
    setDescription("");
    setUrgency("Medium");
    setAnonymous(false);
    setFileName(undefined);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Submit a new complaint</DialogTitle>
          <DialogDescription>
            Share the details so the administration can act quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Title</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Water cooler not working in Block B"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {urgencies.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, where and when..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment</Label>
            <label
              htmlFor="attachment"
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-input bg-muted/50 px-4 py-3 text-sm text-muted-foreground hover:border-primary/50"
            >
              <Paperclip className="size-4" />
              {fileName ?? "Attach a photo or document (optional)"}
            </label>
            <input
              id="attachment"
              type="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name)}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
            <span>
              <span className="block text-sm font-semibold">Submit anonymously</span>
              <span className="block text-xs text-muted-foreground">
                Your name will be hidden from staff
              </span>
            </span>
            <Switch checked={anonymous} onCheckedChange={setAnonymous} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!valid}>
            Submit complaint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
