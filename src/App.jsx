import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Borrow from "./pages/Borrow";
import AdminBorrow from "./pages/AdminBorrow";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → redirect to /borrow */}
        <Route path="/" element={<Navigate to="/borrow" />} />

        {/* Student route */}
        <Route path="/borrow" element={<Borrow />} />

        {/* Admin route */}
        <Route path="/admin/borrows" element={<AdminBorrow />} />
      </Routes>
    </Router>
  );
}

export default App;
