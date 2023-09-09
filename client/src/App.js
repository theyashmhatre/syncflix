import './App.css';
import MainContent from './components/MainContent';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="App">
      <header>
        <Navbar />
      </header>
      <MainContent />
      <Sidebar />
    </div>
  );
}

export default App;
