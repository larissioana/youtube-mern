import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { useState, useEffect, lazy, Suspense } from "react";

const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/login/Login'));
const SignUp = lazy(() => import('./pages/signUp/SignUp'));
const Channels = lazy(() => import('./pages/channels/Channels'));
const NoSubscriptions = lazy(() => import('./pages/noSubscribtions/NoSubscriptions'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const Upload = lazy(() => import('./components/upload/Upload'));
const Videos = lazy(() => import('./pages/videos/Videos'));
const UserDetails = lazy(() => import('./pages/user/UserDetails'));
const FeedSubscriptions = lazy(() => import('./pages/feedSubscriptions/FeedSubscriptions'));
const Search = lazy(() => import('./pages/search/Search'));

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (

    <BrowserRouter>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Suspense fallback={<div className="loading-bar"></div>}>
        <div style={{
          opacity: isSidebarOpen ? "0.3" : "1",
        }}>
          <Routes>
            <Route path="/">
              <Route index element={<Home type="random" />} />
              <Route path="trends" element={<Home type="trends" />} />
              <Route path="music" element={<Home type="music" />} />
              <Route path="sports" element={<Home type="sports" />} />
              <Route path="science" element={<Home type="science" />} />
              <Route path="movies" element={<Home type="movies" />} />
              <Route path="coding" element={<Home type="coding" />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="feed/subscriptions" element={<FeedSubscriptions isSidebarOpen={isSidebarOpen} />} />
              <Route path="/subscriptions" element={<NoSubscriptions />} />
              <Route path="channels" element={<Channels />} />
              <Route path="profile" element={<Profile />} />
              <Route path="upload" element={<Upload />} />
              <Route path="search" element={<Search />} />
              <Route path="video">
                <Route path=":id" element={<Videos />} />
              </Route>
              <Route path="user">
                <Route path=":id" element={<UserDetails />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  )
}

export default App;
