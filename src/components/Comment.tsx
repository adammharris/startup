interface CommentProps {
  username: string;
  id: number;
  text: string;
  date: string;
}

const Comment: React.FC<CommentProps> = ({ username, date, text }) => {
  return (
    <div className="border-bottom p-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <strong>{username}</strong>
        <small className="text-muted">#{date}</small>
      </div>
      <p className="mb-1 text-break">{text}</p>
    </div>
  );
}

export default Comment;
