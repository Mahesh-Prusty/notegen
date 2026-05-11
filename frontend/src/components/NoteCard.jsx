import { Link } from "react-router-dom";

function NoteCard({ note, topicId }) {
  return (
    <div className="p-5 bg-white shadow-md rounded-xl hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{note.title}</h2>

      <p className="text-gray-600 mt-2">
        {note.definitions?.[0]?.substring(0, 120)}...
      </p>

      <Link
        to={`/topics/${topicId}/notes/${note._id}`}
        className="text-blue-600 mt-3 inline-block hover:underline"
      >
        Read More →
      </Link>
    </div>
  );
}

export default NoteCard;