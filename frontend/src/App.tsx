import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'

import AdminDB from './pages/AdminDB';
import PetList from './pages/PetList';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import ContactForm from './pages/ContactForm';
import ApplicationPage from './pages/ApplicationPage';
import Login from './pages/Login';
import Scheduler from './pages/Scheduler';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/db" element={<AdminDB />} />
        <Route path="/pets" element={<PetList />} />
        <Route path="/appointments" element={<Scheduler />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/application" element={<ApplicationPage />} />
      </Routes>
    </Router>
  );
}

export default App
