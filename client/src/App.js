import "./styles/app.scss"
import Toolbar from "./component/Toolbar";
import SettingBar from "./component/SettingBar";
import Canvas from "./component/Canvas";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/:id' element={<><Toolbar/><SettingBar/><Canvas/></>} />
          <Route path='/' element={<><Toolbar/><SettingBar/><Canvas/><Navigate to={`/f${(+new Date()).toString(16)}`} replace/></>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
