import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";

function NotesByTopic() {
  const { topicId } = useParams();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ start as true
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get(`/topics/${topicId}/notes`);
        setNotes(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load notes.");
      } finally {
        setLoading(false); // ✅ only update here
      }
    };

    fetchNotes();
  }, [topicId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notes</h1>

      {notes.length === 0 && (
        <p className="text-gray-500">No notes available.</p>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} topicId={topicId} />
        ))}
      </div>
    </div>
  );
}

export default NotesByTopic;