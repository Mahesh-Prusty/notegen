import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function NoteDetail() {
  const { topicId, id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    api
      .get(`/topics/${topicId}/notes/${id}`)
      .then((res) => setNote(res.data))
      .catch((err) => console.error(err));
  }, [topicId, id]);

  if (!note) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

      {/* Definitions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Definitions</h2>
        {note.definitions.map((d, i) => (
          <p key={i} className="text-gray-700">
            • {d}
          </p>
        ))}
      </div>

      {/* Examples */}
      {note.examples.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Examples</h2>
          <ul className="list-disc pl-6">
            {note.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions */}
      {note.questions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Questions</h2>
          <ul className="space-y-2">
            {note.questions.map((q, i) => (
              <li key={i} className="bg-gray-50 p-3 rounded">
                Q{i + 1}. {q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NoteDetail;