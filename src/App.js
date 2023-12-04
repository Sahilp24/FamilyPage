//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Recipe from './components/Recipe';
import Travel from './components/Travel';
import Home from './components/Home';


function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/recipe" element={<Recipe />} />
        </Routes>
      </div>
    </Router>
    </div>
  );

  /*
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  */
}

export default App;
