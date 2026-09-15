import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  Clock,
  CheckCircle2,
  Hourglass,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackDialog } from "@/components/portal/TrackDialog";
import {
  categories,
  initialComplaints,
  statusStyles,
  type Complaint,
  type ComplaintStatus,
} from "@/components/portal/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Campus Voice Hub" },
      {
        name: "description",
        content:
          "Review every campus complaint in one place, filter by status or category and open any complaint for full details.",
      },
      { property: "og:title", content: "Admin Dashboard — Campus Voice Hub" },
      {
        property: "og:description",
        content: "All campus complaints in one dashboard, filterable by status and category.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

const statuses: (ComplaintStatus | "All")[] = [
  "All",
  "Submitted",
  "Under Review",
  "In Progress",
  "Pending",
  "Resolved",
];

function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ComplaintStatus | "All">("All");
  const [category, setCategory] = useState("All");
  const [tracked, setTracked] = useState<Complaint | null>(null);

  const complaints = initialComplaints;

  const stats = [
    { label: "Total", value: complaints.length, icon: ClipboardList },
    {
      label: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
      icon: Clock,
    },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
      icon: Hourglass,
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: CheckCircle2,
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return complaints.filter((c) => {
      if (status !== "All" && c.status !== status) return false;
      if (category !== "All" && c.category !== category) return false;
      if (!q) return true;
      return [c.id, c.subject, c.category, c.status].join(" ").toLowerCase().includes(q);
    });
  }, [complaints, query, status, category]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-5 md:px-8">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-extrabold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">All campus complaints in one place</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
            Switch role
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 md:px-8">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-border bg-card p-5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <s.icon className="size-[18px]" />
              </span>
              <p className="mt-3 font-display text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 md:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search complaints…"
                className="w-full rounded-full border border-border bg-muted/40 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary/50"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-border bg-muted/40 px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary/50"
            >
              <option value="All">All categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                  status === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted/40 text-muted-foreground hover:bg-accent",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-1 text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 pb-2">ID</th>
                  <th className="px-3 pb-2">Subject</th>
                  <th className="px-3 pb-2">Category</th>
                  <th className="px-3 pb-2">Urgency</th>
                  <th className="px-3 pb-2">Date</th>
                  <th className="px-3 pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setTracked(c)}
                    className="cursor-pointer bg-muted/35 transition-colors hover:bg-accent"
                  >
                    <td className="rounded-l-xl px-3 py-3 font-semibold text-muted-foreground">
                      {c.id}
                    </td>
                    <td className="px-3 py-3 font-semibold">{c.subject}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.category}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.urgency}</td>
                    <td className="px-3 py-3 text-muted-foreground">{c.date}</td>
                    <td className="rounded-r-xl px-3 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full border px-2.5 py-1 text-xs font-semibold",
                          statusStyles[c.status],
                        )}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                      No complaints match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <TrackDialog complaint={tracked} onOpenChange={(o) => !o && setTracked(null)} />
    </div>
  );
}
