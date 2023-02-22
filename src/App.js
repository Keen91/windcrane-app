import { Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import Missing from './components/Missing';
import Dashboard from './components/Dashboard';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="signin" element={<SignIn />} />
        <Route path="unauthorized" element={<Unauthorized />} />

     {/* we want to protect these routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
