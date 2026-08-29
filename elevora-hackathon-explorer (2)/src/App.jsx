import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppStateProvider } from "./context/AppState.jsx";
import Layout from "./components/Layout.jsx";

import Home from "./features/Home.jsx";
import HackathonExplorer from "./features/hackathons/HackathonExplorer.jsx";
import HackathonDetails from "./features/hackathons/HackathonDetails.jsx";
import TeamBuilder from "./features/teamBuilder/TeamBuilder.jsx";
import TeammateProfile from "./features/teamBuilder/TeammateProfile.jsx";
import CreateTeam from "./features/teamBuilder/CreateTeam.jsx";
import ValidatorInput from "./features/validator/ValidatorInput.jsx";
import ValidatorResult from "./features/validator/ValidatorResult.jsx";
import DemoCoachInput from "./features/demoCoach/DemoCoachInput.jsx";
import PitchAnalysisResult from "./features/demoCoach/PitchAnalysisResult.jsx";
import DetailedFeedback from "./features/demoCoach/DetailedFeedback.jsx";
import ImprovedPitch from "./features/demoCoach/ImprovedPitch.jsx";
import MockJudge from "./features/demoCoach/MockJudge.jsx";
import MentorMarketplace from "./features/mentors/MentorMarketplace.jsx";
import FreeMentors from "./features/mentors/FreeMentors.jsx";
import FreeMentorProfile from "./features/mentors/FreeMentorProfile.jsx";
import FreeGuidanceRequest from "./features/mentors/FreeGuidanceRequest.jsx";
import PaidMentors from "./features/mentors/PaidMentors.jsx";
import PaidMentorProfile from "./features/mentors/PaidMentorProfile.jsx";
import PaidBooking from "./features/mentors/PaidBooking.jsx";
import Placeholder from "./features/Placeholder.jsx";

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            <Route path="/hackathons" element={<HackathonExplorer />} />
            <Route path="/hackathons/:id" element={<HackathonDetails />} />

            <Route path="/team-builder" element={<TeamBuilder />} />
            <Route path="/team-builder/create" element={<CreateTeam />} />
            <Route path="/team-builder/:id" element={<TeammateProfile />} />

            <Route path="/validator" element={<ValidatorInput />} />
            <Route path="/validator/result" element={<ValidatorResult />} />

            <Route path="/demo-coach" element={<DemoCoachInput />} />
            <Route path="/demo-coach/result" element={<PitchAnalysisResult />} />
            <Route path="/demo-coach/feedback" element={<DetailedFeedback />} />
            <Route path="/demo-coach/improved-pitch" element={<ImprovedPitch />} />
            <Route path="/demo-coach/mock-judge" element={<MockJudge />} />

            <Route path="/mentors" element={<MentorMarketplace />} />
            <Route path="/mentors/free" element={<FreeMentors />} />
            <Route path="/mentors/free/:id" element={<FreeMentorProfile />} />
            <Route path="/mentors/free/:id/request" element={<FreeGuidanceRequest />} />
            <Route path="/mentors/paid" element={<PaidMentors />} />
            <Route path="/mentors/paid/:id" element={<PaidMentorProfile />} />
            <Route path="/mentors/paid/:id/book" element={<PaidBooking />} />

            <Route path="/profile" element={<Placeholder title="Profile" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="*" element={<Placeholder title="Page not found" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
