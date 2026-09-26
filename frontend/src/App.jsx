import { useEffect, useState } from "react";
import Home from "./pages/Home";
import getCurrentUser from "./features/getCurrentUser";
import { useDispatch } from "react-redux";
import { setUserdata } from "./redux/userSlice";
import koggentLogo from "./assets/koggent-logo.png";

function App() {
  const dispatch = useDispatch();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser();
        dispatch(setUserdata(data));
      } finally {
        setIsAuthLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full bg-[#050507] flex items-center justify-center">
        <img
          src={koggentLogo}
          alt="Koggent Loading"
          className="w-10 h-10 object-contain animate-pulse select-none"
        />
      </div>
    );
  }

  return <Home />;
}

export default App;