import './App.scss';
import Game from './components/Game';
import Instructions from './components/Instructions'

import {
  HashRouter,
  Route,
  NavLink
} from "react-router-dom";


function App() {
  return (
    <HashRouter>


      <div className="App">
        <h1>Mastermind</h1>
        <div>
          <nav>
            <ul>
              <li><NavLink exact to="/" activeClassName="is-active">play</NavLink></li>
              <li><NavLink to="/help" activeClassName="is-active">instructions</NavLink></li>
            </ul>
          </nav>
        </div>

          <Route exact path="/">
            <Game rows={10} cols={4}></Game>
          </Route>
          <Route path="/help">
            <Instructions></Instructions>
          </Route>
      </div>
    </HashRouter>
  );
}

export default App;
