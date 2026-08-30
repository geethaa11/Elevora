import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Trophy } from "lucide-react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Shared3CardCarousel } from "../../components/ui/Shared3CardCarousel.jsx";
import { MentorCard } from "../../components/domain/MentorCard.jsx";

const mockMentors = [
  {
    id: "mock-1",
    name: "Aarav Sharma",
    expertise: "AI & Machine Learning",
    bio: "Passionate about NLP and generative AI models. 4x SIH winner and eager to help student teams navigate machine learning pipelines.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    skills: ["Python", "PyTorch", "LLMs", "FastAPI"],
    kind: "free",
    hackathons: 6,
    availability: "Weekends Only",
  },
  {
    id: "mock-2",
    name: "Dr. Vikramaditya Sen",
    expertise: "AI System Architecture",
    bio: "Senior AI Architect with extensive experience mentoring top-tier hackathon winners and founders. Focused on scalable system design.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    skills: ["LLM Infrastructure", "Distributed Systems", "PyTorch"],
    kind: "paid",
    rating: 4.9,
    reviews: 38,
    hackathons: 12,
    availability: "Mon, Wed, Sat",
    sessionDurations: [
      { minutes: 30, price: 499 },
      { minutes: 60, price: 899 },
    ],
  },
  {
    id: "mock-3",
    name: "Ananya Roy",
    expertise: "Full Stack Development",
    bio: "Frontend enthusiast and full-stack builder. Love helping teams polish UI, connect APIs, and nail their live demo execution.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    kind: "free",
    hackathons: 4,
    availability: "Evenings & Weekends",
  },
  {
    id: "mock-4",
    name: "Meera Deshmukh",
    expertise: "Product Strategy & Demo Coaching",
    bio: "Former hackathon organizer and judge. Specializes in fine-tuning pitch narratives, crafting memorable demos, and judge Q&A.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
    skills: ["Pitch Deck Mastery", "Demo Flow", "Judge Q&A"],
    kind: "paid",
    rating: 4.8,
    reviews: 29,
    hackathons: 9,
    availability: "Tue, Thu, Sun",
    sessionDurations: [
      { minutes: 30, price: 399 },
      { minutes: 60, price: 749 },
    ],
  },
  {
    id: "mock-5",
    name: "Rohan Verma",
    expertise: "Pitching & UI/UX Design",
    bio: "Design lead and hackathon judge. I help teams convert complex technical ideas into clean, convincing pitch decks and slick prototypes.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    skills: ["Figma", "Pitch Deck Design", "Storytelling"],
    kind: "free",
    hackathons: 8,
    availability: "Flexible",
  },
];

export function MentorMarketplace() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 py-4">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-bold text-neutral-50">Mentor Marketplace</h1>
        <p className="text-sm text-neutral-400">
          Get guidance from people who have already built, won, and judged hackathons.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          to="/mentors/free"
          className="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-semantic-success/50 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <HeartHandshake className="h-9 w-9 text-semantic-success" strokeWidth={1.5} />
            <Badge variant="recommended">FREE VOLUNTEER</Badge>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-neutral-50">Free Volunteer Guidance</h2>
            <p className="mt-1.5 text-sm text-neutral-400">
              Get quick advice, technical unblocking, and general guidance from experienced volunteers.
            </p>
          </div>
          <span className="mt-auto text-sm font-semibold text-semantic-success">Find Volunteer Mentors →</span>
        </Link>

        <Link
          to="/mentors/paid"
          className="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <Trophy className="h-9 w-9 text-primary" strokeWidth={1.5} />
            <Badge variant="featured">PAID EXPERT</Badge>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-neutral-50">Paid Expert Session</h2>
            <p className="mt-1.5 text-sm text-neutral-400">
              Book focused 1:1 sessions (30/60m) for code review, pitch coaching, and judge Q&A prep.
            </p>
          </div>
          <span className="mt-auto text-sm font-semibold text-primary">Find Expert Mentors →</span>
        </Link>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-neutral-800">
        <Shared3CardCarousel
          title="Featured Mentor Recommendations"
          items={mockMentors}
          renderCard={(m) => <MentorCard mentor={m} kind={m.kind} />}
        />
      </div>
    </div>
  );
}

export default MentorMarketplace;


