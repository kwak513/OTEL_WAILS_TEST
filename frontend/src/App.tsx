import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import SignozAPI from './pages/SignozAPI';
import Metrics from './pages/Metrics';
import Traces from './pages/Traces';
import Logs from './pages/Logs';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/api-key" replace />} />
                <Route path="api-key" element={<SignozAPI />} />
                <Route path="metrics" element={<Metrics />} />
                <Route path="traces" element={<Traces />} />
                <Route path="logs" element={<Logs />} />
            </Route>
        </Routes>
    );
}

export default App;