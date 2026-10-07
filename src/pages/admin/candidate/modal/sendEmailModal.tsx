import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  Paperclip,
  Send,
  Underline,
  X,
} from "lucide-react";

interface SendEmailModalProps {
  onClose: () => void;
  onSend: (data: {
    to: string;
    from: string;
    subject: string;
    body: string;
    attachments: File[];
  }) => void;
  defaultFrom?: string;
}

const SendEmailModal = ({
  onClose,
  onSend,
  defaultFrom = "",
}: SendEmailModalProps) => {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState(defaultFrom);
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSend = to.trim() !== "" && from.trim() !== "";

  const syncActiveFormats = () => {
    const next = new Set<string>();
    if (document.queryCommandState("bold")) next.add("bold");
    if (document.queryCommandState("italic")) next.add("italic");
    if (document.queryCommandState("underline")) next.add("underline");
    if (document.queryCommandState("insertUnorderedList")) next.add("list");
    setActiveFormats(next);
  };

  const applyFormat = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    syncActiveFormats();
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend({
      to,
      from,
      subject,
      body: editorRef.current?.innerHTML ?? "",
      attachments,
    });
  };

  const toolbarBtnClass = (key: string) =>
    `p-1.5 rounded-md transition-colors ${
      activeFormats.has(key)
        ? "bg-yellow-100 text-yellow-700"
        : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Send className="w-5 h-5 text-yellow-500" />
            <h1 className="text-lg font-semibold text-gray-900">Send Email</h1>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <hr className="w-full border-gray-200 mt-4" />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email-to"
              className="text-sm font-medium text-gray-700"
            >
              To
            </label>
            <input
              id="email-to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="p-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email-from"
              className="text-sm font-medium text-gray-700"
            >
              From
            </label>
            <input
              id="email-from"
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="you@example.com"
              className="p-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-3">
          <label
            htmlFor="email-subject"
            className="text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <input
            id="email-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="p-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          />
        </div>

        <div className="rounded-lg border border-gray-300 overflow-hidden mt-4 focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400">
          <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className={toolbarBtnClass("bold")}
              aria-label="Bold"
              aria-pressed={activeFormats.has("bold")}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className={toolbarBtnClass("italic")}
              aria-label="Italic"
              aria-pressed={activeFormats.has("italic")}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat("underline")}
              className={toolbarBtnClass("underline")}
              aria-label="Underline"
              aria-pressed={activeFormats.has("underline")}
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyFormat("insertUnorderedList")}
              className={toolbarBtnClass("list")}
              aria-label="Bullet list"
              aria-pressed={activeFormats.has("list")}
            >
              <List className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={handleAttachClick}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onKeyUp={syncActiveFormats}
            onMouseUp={syncActiveFormats}
            data-placeholder="Write your message..."
            className="w-full min-h-[180px] outline-none p-3 text-sm empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
          />

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border-t border-gray-200 bg-gray-50">
              {attachments.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded-full pl-3 pr-1 py-1 text-xs text-gray-700"
                >
                  <span className="max-w-[140px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="p-0.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md font-medium text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="px-5 py-2 rounded-md font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
