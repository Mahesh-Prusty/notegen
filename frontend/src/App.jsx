import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotesByTopic from "./pages/NotesByTopic";
import NoteDetail from "./pages/NoteDetail";
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topics/:topicId" element={<NotesByTopic />} />
        <Route path="/topics/:topicId/notes/:id" element={<NoteDetail />} />
      </Routes>
    </Router>
  );
}

export default App;