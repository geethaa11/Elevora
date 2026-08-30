import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Check, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SwipeCard({ student, onSwipe, isFront }) {
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = async (event, info) => {
    try {
      if (info.offset.x > 100) {
        await onSwipe("interested", student);
      } else if (info.offset.x < -100) {
        await onSwipe("pass", student);
      }
    } catch (e) {
      // Snap back if swipe failed
      x.set(0);
    }
  };

  const scorePercentage = student.match_score 
    ? Math.min(Math.round(student.match_score * 10), 100) // Rough conversion to %
    : null;

  return (
    <motion.div
      className="absolute top-0 w-full h-full"
      style={{ x, rotate, opacity: isFront ? opacity : 1 }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      animate={{
        scale: isFront ? 1 : 0.95,
        y: isFront ? 0 : 20,
        opacity: isFront ? 1 : 0.5,
        zIndex: isFront ? 10 : 0
      }}
      transition={{ duration: 0.3 }}
      exit={{ x: x.get() > 0 ? 300 : -300, opacity: 0 }}
    >
      <div className={`h-full w-full bg-neutral-900 border ${isFront ? 'border-primary/50 shadow-[0_0_30px_rgba(var(--color-primary),0.2)]' : 'border-neutral-800'} rounded-2xl p-6 flex flex-col items-center justify-between overflow-hidden select-none`}>
        <div className="w-full flex justify-between items-start">
          <div className="flex flex-col items-start gap-2">
            <h2 className="text-2xl font-bold text-neutral-50">{student.name}</h2>
            {scorePercentage !== null && (
              <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-semibold">
                {scorePercentage}% Match
              </span>
            )}
          </div>
          <div className="h-16 w-16 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700 shrink-0">
            <User className="text-neutral-400 w-8 h-8" />
          </div>
        </div>

        <div className="w-full space-y-4 my-6 flex-1 overflow-y-auto">
          {student.shared_skills?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Shared Skills</h3>
              <div className="flex flex-wrap gap-2">
                {student.shared_skills.map((skill, i) => (
                  <span key={i} className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-md text-sm border border-neutral-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {student.shared_interests?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-400 mb-2">Shared Interests</h3>
              <div className="flex flex-wrap gap-2">
                {student.shared_interests.map((interest, i) => (
                  <span key={i} className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-md text-sm border border-neutral-700">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(!student.shared_skills?.length && !student.shared_interests?.length) && (
            <p className="text-neutral-500 italic text-sm">Recommended based on complementary roles or hackathon interests.</p>
          )}
        </div>

        {isFront && (
          <div className="flex gap-4 w-full justify-center mt-4 shrink-0">
            <button 
              onClick={() => onSwipe("pass", student)}
              className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-neutral-700"
            >
              <X className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate(`/team-builder/${student.user_id}`)}
              className="h-14 px-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-neutral-700 transition-colors border border-neutral-700 font-medium"
            >
              View Profile
            </button>
            <button 
              onClick={() => onSwipe("interested", student)}
              className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors border border-primary/30"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
