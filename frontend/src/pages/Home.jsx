import { useEffect, useState } from "react";
import api from "../api/axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchTerm] = useState("");

  const [formData, setFormData] = useState({
    subjectId: "",
    topicId: "",
    classLevel: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Subjects
  useEffect(() => {
    api.get("/subjects").then((res) => {
      console.log("Subjects:", res.data);
      setSubjects(res.data);
    });
  }, []);

  // Fetch Topics
  useEffect(() => {
    if (!formData.subjectId) return;

    api
      .get(`/topics/subject/${formData.subjectId}`) // ✅ FIX: corrected route
      .then((res) => setTopics(res.data))
      .catch(() => setTopics([])); // ✅ FIX: prevent crash
  }, [formData.subjectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "subjectId") {
      setFormData({
        ...formData,
        subjectId: value,
        topicId: "",
      });
      setTopics([]); // ✅ FIX: clear old topics
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotes([]);

    try {
      const res = await api.post("/filter-notes", {
        subjectId: formData.subjectId, // ✅ FIX
        topicId: formData.topicId, // ✅ FIX
        classLevel: Number(formData.classLevel),
      });
      if (res.data.length === 0) {
        setError("No notes found.");
      } else {
        setNotes(res.data);
      }
    } catch (err) {
      setError("Something went wrong.", err); // ✅ FIX: remove extra arg
    }

    setLoading(false);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.definitions
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-100 to-blue-100 p-6">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          {" "}
          <h2 className="text-3xl font-bold text-center mb-6">
            Generate Notes{" "}
          </h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-4 gap-4">
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>

            <select
              name="topicId"
              value={formData.topicId}
              onChange={handleChange}
              className="border p-2 rounded"
              required
              disabled={!formData.subjectId}
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.title}
                </option>
              ))}
            </select>

            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Class</option>
              {[6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Generate
            </button>
          </form>
          {loading && (
            <div className="flex justify-center mt-6">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </div>
        {filteredNotes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-l-8 border-indigo-500"
          >
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">
              {note.title}
            </h3>

            <p className="mb-4 text-gray-700">
              <span className="font-semibold">Definition:</span>{" "}
              {note.definition}
            </p>

            {note.examples.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2">Examples</h4>
                <ul className="list-disc ml-6 space-y-1">
                  {note.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}

            {note.questions.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2">
                  Important Questions
                </h4>
                <div className="space-y-3">
                  {note.questions.map((q, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded">
                      <p className="font-medium">
                        Q{i + 1}. {q}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Home;
