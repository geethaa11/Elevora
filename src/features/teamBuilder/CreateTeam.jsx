import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Avatar } from "../../components/domain/Avatar.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useAppState } from "../../context/AppStateContext.jsx";

const MAX_MEMBERS = 6;

export function CreateTeam() {
  const { team, removeTeamMember, selectedHackathon } = useAppState();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  const handleContinue = () => {
    setConfirmed(true);
    setTimeout(() => navigate("/validator"), 800);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-4">
      <header>
        <h1 className="font-display text-3xl font-bold text-neutral-50">Your Team</h1>
        {selectedHackathon && (
          <p className="text-sm text-neutral-400 mt-1">
            Building for <span className="text-primary font-semibold">{selectedHackathon.name}</span>
          </p>
        )}
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl border border-neutral-700 bg-surface p-4">
          <div className="flex items-center gap-3">
            <Avatar name="You" />
            <div>
              <p className="text-sm font-semibold text-neutral-50">You</p>
              <p className="text-xs text-neutral-400">Project Lead · Frontend</p>
            </div>
          </div>
        </div>

        {team.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-xl border border-neutral-700 bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar name={member.name} />
              <div>
                <p className="text-sm font-semibold text-neutral-50">{member.name}</p>
                <p className="text-xs text-neutral-400">{member.role}</p>
              </div>
            </div>
            <button
              onClick={() => removeTeamMember(member.id)}
              aria-label={`Remove ${member.name}`}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-semantic-danger transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {team.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-700 p-4 text-center text-sm text-neutral-400">
            No teammates added yet — head back to Student Teaming to find some.
          </p>
        )}
      </div>

      <p className="text-sm text-neutral-400">
        {team.length + 1} / {MAX_MEMBERS} members
      </p>

      {confirmed ? (
        <div className="rounded-xl border border-semantic-success/30 bg-semantic-success/10 p-4 text-center text-sm font-semibold text-semantic-success">
          Team created successfully! Redirecting to Idea Validator...
        </div>
      ) : (
        <Button variant="primary" onClick={handleContinue} className="w-full">
          Continue to Idea Validator
        </Button>
      )}
    </div>
  );
}

export default CreateTeam;
