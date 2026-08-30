import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getTeamMatches, swipeAction } from "../../services/teamService.js";
import { SwipeCard } from "./SwipeCard.jsx";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function TeamBuilder() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swipeError, setSwipeError] = useState(null);

  useEffect(() => {
    async function fetchMatches() {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        const data = await getTeamMatches(currentUser.uid);
        setMatches(data);
      } catch (err) {
        setError(err.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [currentUser]);

  const handleSwipe = async (action, student) => {
    setSwipeError(null);
    try {
      await swipeAction(student.user_id, action);
      // On success, pop the card
      setMatches((prev) => prev.slice(1));
    } catch (err) {
      // Do not remove the card, show error
      setSwipeError(`Failed to ${action} ${student.name}. Please try again.`);
    }
  };

  const handleKeyDown = (e) => {
    if (matches.length === 0) return;
    const currentStudent = matches[0];
    if (e.key === "ArrowRight") {
      handleSwipe("interested", currentStudent);
    } else if (e.key === "ArrowLeft") {
      handleSwipe("pass", currentStudent);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [matches]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-8 py-12 items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-neutral-400">Finding best matches for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-8 py-12 items-center justify-center min-h-[60vh]">
        <p className="text-red-400">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neutral-800 rounded-md text-neutral-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8 py-4 h-[calc(100vh-8rem)] relative">
      <header className="flex flex-col gap-1 text-center shrink-0">
        <h1 className="font-display text-3xl font-bold text-neutral-50">Find Your Teammates</h1>
        <p className="text-sm text-neutral-400">
          Swipe right if you're interested, left to pass.
        </p>
      </header>

      {swipeError && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 text-red-300 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all">
          {swipeError}
        </div>
      )}

      <div className="relative flex-1 w-full flex justify-center items-center">
        {matches.length > 0 ? (
          <AnimatePresence>
            {matches.map((student, index) => {
              if (index > 1) return null; // Only render top 2 cards
              return (
                <SwipeCard
                  key={student.user_id}
                  student={student}
                  isFront={index === 0}
                  onSwipe={handleSwipe}
                />
              );
            }).reverse()}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center bg-neutral-900 border border-neutral-800 rounded-2xl w-full">
            <h3 className="text-xl font-bold text-neutral-200">No more recommendations</h3>
            <p className="text-neutral-400">We've shown you all available students right now. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamBuilder;
