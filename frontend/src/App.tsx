import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Metrics from './pages/Metrics';
import Traces from './pages/Traces';
import Logs from './pages/Logs';
import UserCRUD from './pages/UserCRUD';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route path="/traces" element={<Traces />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/usercrud" element={<UserCRUD />} />
        </Routes>
    );
}

export default App;