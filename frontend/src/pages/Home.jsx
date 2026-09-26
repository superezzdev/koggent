import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";
import LoginPage from "../components/LoginPage";

function Home() {
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return <LoginPage />;
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
