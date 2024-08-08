import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Spinner from './components/Spinner';
import Register from "./pages/Register";
import Admin from "./pages/Admin"
import Profile from "./pages/Profile";
import ProtectedPage from './components/ProtectedPage';
import { useSelector } from 'react-redux';
function App() {
  const {loading} = useSelector(state => state.loaders);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedPage><Home /></ProtectedPage>} />
          <Route path='/profile' element={<ProtectedPage><Profile /></ProtectedPage>} />
          <Route path='/admin' element={<ProtectedPage><Admin /></ProtectedPage>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
