import LoginPage from "./app/login/page";
import SignupPage from "./app/signup/page";
import DashboardPage from "./app/dashboard/page";
import { BrowserRouter as Router, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginPage />}
          />
        </Routes>
        <Routes>
          <Route
            path="/signup"
            element={<SignupPage />}
          />
        </Routes>
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
