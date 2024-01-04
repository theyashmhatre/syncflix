import './App.css';
import NotFound from './components/Errors/NotFound';
import MainContent from './components/MainContent';
import Navbar from './components/Navbar';
import Create from './components/Party/Create';
import VideoPage from './components/Party/VideoPage';
import ProtectedRoute from './components/Routes/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { useAppStateContext } from './context/appstate';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";

function App() {

  const { isCreate, isJoin, isVideo } = useAppStateContext()

  return (
    <Router>
      <div className="App">
        <header>
          <Navbar />
        </header>
        {(isCreate || isJoin) && isVideo ? <Sidebar /> : <></>} 
        <Routes>
          <Route
            exact
            path="/"
            element={<MainContent />}
          ></Route>
          {/* <Route
            exact
            path="/party/:id"
            element={<VideoPage />}
          ></Route> */}
          {/* <ProtectedRoute element={<VideoPage />} path="/party/:id" exact /> */}
          <Route element={<ProtectedRoute />}>
            <Route path='/party/:id' element={<VideoPage />} />
          </Route>
          <Route
            exact
            path="/error"
            element={<NotFound />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
