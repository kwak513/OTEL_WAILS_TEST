import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import Metrics from './pages/Metrics';
import Traces from './pages/Traces';
import Logs from './pages/Logs';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="metrics" element={<Metrics />} />
                <Route path="traces" element={<Traces />} />
                <Route path="logs" element={<Logs />} />
            </Route>
        </Routes>
    );
}

export default App;