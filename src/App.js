import { Link, Route, Routes } from "react-router-dom";
import Home from "./Page/Home";
import style from "./App.module.css";
import BigFileUploader from "./components/BigFileUploader";
import FixedHeightVertualList from "./components/FixedHeightVertualList";

function App() {
  return (
    <div className={style.main}>
      <div className={style.navs}>
        <Link to="/">首页</Link>
        <Link to="/upload-big-file">大文件上传</Link>
        <Link to="/fixed-height-vertual-list">定高虚拟列表</Link>
      </div>
      <br />
      <hr />
      <br />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/upload-big-file" Component={BigFileUploader} index />
        <Route path="/fixed-height-vertual-list" Component={FixedHeightVertualList} index />
      </Routes>
    </div>
  );
}

export default App;
