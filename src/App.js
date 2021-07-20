
import './App.css';

import Shader1 from './components/Shader1.js'
import Video from './components/Video.js'

function App() {
  return (
    <div className="App">
      <div id="webgl-canvas">
      <Shader1/>
      <Video/>
      </div>
    </div>
  );
}

export default App;
