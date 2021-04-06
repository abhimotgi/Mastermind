import './App.scss';
import Game from './Game';

function App() {
  return (
    <div className="App">
      <h1>MASTERMIND</h1>
      <Game rows={10} cols={4}></Game>
    </div>
  );
}

export default App;
