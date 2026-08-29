import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Avatar from "../../components/Avatar.jsx";
import Button from "../../components/Button.jsx";
import { useAppState } from "../../context/AppState.jsx";

const MAX_MEMBERS = 6;

export default function CreateTeam() {
  const { team, removeTeamMember, selectedHackathon } = useAppState();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  const handleContinue = () => {
    setConfirmed(true);
    setTimeout(() => navigate("/validator"), 900);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10 lg:px-10">
      <header>
        <h1 className="font-display text-h1 text-neutral-0">Your Team</h1>
        {selectedHackathon && (
          <p className="text-body text-neutral-500">
            Building for <span className="text-gold">{selectedHackathon.name}</span>
          </p>
        )}
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-card border border-neutral-700 bg-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <Avatar name="You" />
            <div>
              <p className="text-small font-semibold text-neutral-0">You</p>
              <p className="text-caption text-neutral-500">Project Lead · Frontend</p>
            </div>
          </div>
        </div>

        {team.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-card border border-neutral-700 bg-neutral-800 p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar name={member.name} />
              <div>
                <p className="text-small font-semibold text-neutral-0">{member.name}</p>
                <p className="text-caption text-neutral-500">{member.role}</p>
              </div>
            </div>
            <button
              onClick={() => removeTeamMember(member.id)}
              aria-label={`Remove ${member.name}`}
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-700 hover:text-error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {team.length === 0 && (
          <p className="rounded-card border border-dashed border-neutral-700 p-4 text-center text-small text-neutral-500">
            No teammates added yet — head back to Student Teaming to find some.
          </p>
        )}
      </div>

      <p className="text-small text-neutral-500">
        {team.length + 1} / {MAX_MEMBERS} members
      </p>

      {confirmed ? (
        <p className="rounded-card border border-success/30 bg-success/10 p-4 text-center text-small font-semibold text-success">
          Team created successfully!
        </p>
      ) : (
        <Button variant="primary" onClick={handleContinue}>
          Continue to Idea Validator
        </Button>
      )}
    </div>
  );
}
