import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getTeamMatches, swipeAction } from "../../services/teamService.js";
import { SwipeCard } from "./SwipeCard.jsx";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export function TeamBuilder() {
  const { currentUser, logout } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [swipeError, setSwipeError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const offsetRef = useRef(0);

  const fetchMatches = async (isInitial = false) => {
    if (!currentUser?.uid || !hasMore) return;
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);
      
      const limit = 10;
      const data = await getTeamMatches(currentUser.uid, limit, offsetRef.current);
      
      if (data.length < limit) {
        setHasMore(false);
      }
      
      if (data.length > 0) {
        setMatches((prev) => {
          const newMatches = data.filter(d => !prev.some(p => p.user_id === d.user_id));
          return [...prev, ...newMatches];
        });
        offsetRef.current += limit;
      }
    } catch (err) {
      if (err.message === "Unauthorized" || err.status === 401) {
        logout();
        return;
      }
      if (isInitial) setError(err.message || "Failed to load recommendations");
      else setSwipeError("Failed to load more recommendations.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setMatches([]);
    setHasMore(true);
    offsetRef.current = 0;
    fetchMatches(true);
  }, [currentUser]);

  // Trigger fetch when running low on cards
  useEffect(() => {
    if (matches.length <= 3 && hasMore && !loading && !loadingMore) {
      fetchMatches(false);
    }
  }, [matches.length, hasMore, loading, loadingMore]);

  const handleSwipe = async (action, student) => {
    setSwipeError(null);
    try {
      await swipeAction(student.user_id, action);
      setMatches((prev) => prev.slice(1));
    } catch (err) {
      if (err.status === 409) {
        // Treat 409 Conflict as success (already swiped)
        setMatches((prev) => prev.slice(1));
      } else if (err.status === 401 || err.message === "Unauthorized") {
        logout();
      } else {
        setSwipeError(`Failed to ${action} ${student.name}. Please try again.`);
        throw err; // Re-throw to allow SwipeCard to snap back
      }
    }
  };

  const handleKeyDown = (e) => {
    if (matches.length === 0) return;
    const currentStudent = matches[0];
    if (e.key === "ArrowRight") {
      handleSwipe("interested", currentStudent).catch(() => {});
    } else if (e.key === "ArrowLeft") {
      handleSwipe("pass", currentStudent).catch(() => {});
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [matches, hasMore, loadingMore]);

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
          Find teammates who complement your skills, interests, and role.
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
            <h3 className="text-xl font-bold text-neutral-200">No more teammates to discover</h3>
            <p className="text-neutral-400">You have reviewed all current recommendations. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamBuilder;
