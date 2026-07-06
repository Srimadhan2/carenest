function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function NoteBubble({ note }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="max-w-[80%] rounded-bubble rounded-br-md bg-bubble-sent px-4 py-3 text-white shadow-sm">
        <p className="whitespace-pre-wrap break-words text-body">{note.content}</p>
      </div>
      <span className="px-1 text-caption text-text-secondary">{formatTime(note.createdAt)}</span>
    </div>
  );
}
