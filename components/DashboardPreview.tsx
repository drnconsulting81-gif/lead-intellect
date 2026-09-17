import {
  LayoutDashboard,
  Compass,
  Building2,
  Users,
  BrainCircuit,
  ListChecks,
  Send,
  GitBranch,
  Plug,
  Settings,
} from "lucide-react";
import Reveal from "./Reveal";

const sidebar = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Discover", icon: Compass },
  { label: "Accounts", icon: Building2 },
  { label: "Leads", icon: Users },
  { label: "Intelligence", icon: BrainCircuit },
  { label: "Lists", icon: ListChecks },
  { label: "Outreach", icon: Send },
  { label: "Pipeline", icon: GitBranch },
  { label: "Integrations", icon: Plug },
  { label: "Settings", icon: Settings },
];

const summary = [
  { label: "Total Accounts", value: "128" },
  { label: "Qualified Leads", value: "87" },
  { label: "Tier 1 Leads", value: "31" },
  { label: "Enriched Contacts", value: "94" },
  { label: "Meetings", value: "12" },
];

const leads = [
  {
    name: "Arjun Mehta",
    company: "MedCore Healthcare",
    title: "VP Business Development",
    score: 92,
    email: "Verified",
    signal: "Expansion",
    next: "Discovery Call",
  },
  {
    name: "Priya Rao",
    company: "Nova Facilities",
    title: "Head of Operations",
    score: 88,
    email: "Verified",
    signal: "Growth",
    next: "Research Account",
  },
  {
    name: "Rahul Sharma",
    company: "TechCore Systems",
    title: "VP Sales",
    score: 84,
    email: "Available",
    signal: "Hiring",
    next: "Review",
  },
];

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-surface border-y border-border">
      <div className="container-page">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
              Everything Your Sales Team Needs to Prioritize the Right Prospect
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 rounded-2xl border border-border bg-white overflow-hidden shadow-[0_24px_60px_-28px_rgba(11,18,32,0.2)]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-xs font-semibold text-text-muted">LEADINTELLECT DASHBOARD</span>
              <span className="text-[10px] font-semibold text-violet bg-violet/10 border border-violet/20 rounded-full px-2.5 py-1">
                Illustrative UI
              </span>
            </div>

            <div className="grid lg:grid-cols-[200px_1fr]">
              <div className="hidden lg:flex flex-col gap-1 p-4 border-r border-border bg-surface/60">
                {sidebar.map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium ${
                      s.active ? "bg-navy text-white" : "text-text-muted"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </div>
                ))}
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {summary.map((s) => (
                    <div key={s.label} className="rounded-xl bg-surface border border-border p-3.5">
                      <p className="text-xl font-extrabold text-navy leading-none">{s.value}</p>
                      <p className="mt-1.5 text-[11px] text-text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs font-bold text-text-muted tracking-wide">
                  TOP OPPORTUNITIES
                </p>

                <div className="mt-3 hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] text-text-muted border-b border-border">
                        <th className="py-2 pr-4 font-semibold">Name</th>
                        <th className="py-2 pr-4 font-semibold">Company</th>
                        <th className="py-2 pr-4 font-semibold">Title</th>
                        <th className="py-2 pr-4 font-semibold">ICP Score</th>
                        <th className="py-2 pr-4 font-semibold">Email</th>
                        <th className="py-2 pr-4 font-semibold">Signal</th>
                        <th className="py-2 pr-4 font-semibold">Next Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l) => (
                        <tr key={l.name} className="border-b border-border last:border-0">
                          <td className="py-3 pr-4 font-semibold text-navy">{l.name}</td>
                          <td className="py-3 pr-4 text-text-muted">{l.company}</td>
                          <td className="py-3 pr-4 text-text-muted">{l.title}</td>
                          <td className="py-3 pr-4 font-semibold text-navy">{l.score}</td>
                          <td className="py-3 pr-4 text-text-muted">{l.email}</td>
                          <td className="py-3 pr-4 text-text-muted">{l.signal}</td>
                          <td className="py-3 pr-4">
                            <span className="text-xs font-semibold text-teal-dark bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1">
                              {l.next}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex flex-col gap-3 md:hidden">
                  {leads.map((l) => (
                    <div key={l.name} className="rounded-lg border border-border p-3.5">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-navy text-sm">{l.name}</p>
                        <p className="font-semibold text-navy text-sm">{l.score}</p>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {l.title} &middot; {l.company}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                        <span>{l.email}</span>
                        <span className="font-semibold text-teal-dark">{l.next}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
