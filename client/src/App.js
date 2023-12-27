import './App.css';
import MainContent from './components/MainContent';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useAppStateContext } from './context/appstate';

function App() {

  const {isCreate, isJoin, isVideo} = useAppStateContext()

  return (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <MainContent />
      {(isCreate || isJoin) && isVideo ? <Sidebar /> : <></>}
    </div>
  );
}

export default App;
