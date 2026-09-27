import { useState } from "react";
import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
import LoginPage from "./Login/LoginPage";
import LandingPage from "./Landing/LandingPage";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);

  if (!userData) {
    if (showAuth) {
      return <LoginPage onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onOpenAuth={() => setShowAuth(true)} />;
  }

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      <SideBar />
      <ChatArea />
      <Artifact />
    </div>
  );
}

export default Home;
