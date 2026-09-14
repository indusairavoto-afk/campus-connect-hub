import { Bell, Search, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notifications } from "./data";

export function TopBar({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
      <label className="relative flex h-11 flex-1 items-center rounded-xl border border-border bg-card px-4 md:max-w-xl">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search complaints, keywords..."
          className="h-full flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span className="hidden rounded-md border border-border bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground sm:block">
          Ctrl + K
        </span>
      </label>

      <div className="ml-auto flex items-center gap-3">
        <Popover>
          <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent">
            <Bell className="size-[18px]" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <p className="border-b border-border px-4 py-3 text-sm font-bold">Notifications</p>
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.title} className="px-4 py-3">
                  <p className="text-sm font-medium leading-snug text-foreground">{n.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
            RS
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold text-foreground">Rahul Sharma</span>
            <span className="block text-xs text-muted-foreground">B.Tech - Computer Science</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
