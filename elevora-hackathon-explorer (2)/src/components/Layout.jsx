import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Compass,
  Users,
  Sparkles,
  Mic2,
  HeartHandshake,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAppState } from "../context/AppState.jsx";

const NAV = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/hackathons", label: "Hackathon Explorer", icon: Compass },
  { to: "/team-builder", label: "Student Teaming", icon: Users },
  { to: "/validator", label: "AI Validator", icon: Sparkles },
  { to: "/demo-coach", label: "AI Demo Coach", icon: Mic2 },
  { to: "/mentors", label: "Mentor Marketplace", icon: HeartHandshake },
];

const NAV_FOOTER = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-control px-3.5 py-2.5 text-small font-sans transition-colors ${
          isActive ? "bg-gold/15 text-gold" : "text-neutral-200 hover:bg-neutral-800"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

export default function Layout() {
  const { team } = useAppState();

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-700 bg-surface p-4 lg:flex">
        <div className="mb-6 px-2">
          <span className="font-display text-h4 tracking-wide text-gold">ELEVORA</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-neutral-700 pt-3">
          {NAV_FOOTER.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <button className="flex items-center gap-3 rounded-control px-3.5 py-2.5 text-left text-small text-neutral-500 hover:bg-neutral-800 hover:text-error">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-neutral-700 bg-surface px-6 py-3.5 lg:px-10">
          <span className="text-caption text-neutral-500">
            Frontend B preview — sidebar/topbar are a stand-in for the shared shell
          </span>
          {team.length > 0 && (
            <span className="rounded-full bg-gold/15 px-3 py-1 text-caption font-semibold text-gold">
              Team: {team.length + 1}
            </span>
          )}
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
