import { useState } from "react";
import { X, Upload, Image, Video, FileText, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDare } from "@/context/DareContext";

interface SubmitModalProps {
  open: boolean;
  onClose: () => void;
  roomName?: string;
  onSubmit?: (type: SubType, content: string) => void;
}

type SubType = "image" | "video" | "text" | "audio";

const types: { type: SubType; icon: React.ElementType; label: string }[] = [
  { type: "image", icon: Image, label: "Image" },
  { type: "video", icon: Video, label: "Video" },
  { type: "text", icon: FileText, label: "Text" },
  { type: "audio", icon: Mic, label: "Audio" },
];

const SubmitModal = ({ open, onClose, roomName, onSubmit }: SubmitModalProps) => {
  const [selected, setSelected] = useState<SubType>("text");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const { submitDare } = useDare();

  const handleSubmit = () => {
    if (!content && !preview) return;
    const submissionContent = selected === "text" ? content : preview || "Uploaded file";
    if (onSubmit) {
      onSubmit(selected, submissionContent);
    } else {
      submitDare(selected, submissionContent);
    }
    setContent("");
    setPreview(null);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Submit Your Dare{roomName ? ` • ${roomName}` : ""}</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              {types.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => { setSelected(type); setPreview(null); setContent(""); }}
                  className={`flex-1 flex flex-col items-center gap-1 rounded-lg border py-3 text-xs font-medium transition-all ${
                    selected === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {selected === "text" ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Share your experience..."
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
              />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-border bg-muted p-8 text-center">
                {preview ? (
                  <div className="space-y-3">
                    {selected === "image" && <img src={preview} alt="preview" className="mx-auto max-h-48 rounded-lg object-cover" />}
                    {selected === "video" && <p className="text-sm text-muted-foreground">🎥 Video selected</p>}
                    {selected === "audio" && <p className="text-sm text-muted-foreground">🎙️ Audio selected</p>}
                    <button onClick={() => setPreview(null)} className="text-xs text-destructive hover:underline">Remove</button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click or drag to upload</span>
                    <input type="file" className="hidden" onChange={handleFileChange} accept={selected === "image" ? "image/*" : selected === "video" ? "video/*" : "audio/*"} />
                  </label>
                )}
              </div>
            )}

            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span>⚡ Only ONE submission allowed per day</span>
                <span>🔒 No edits after submission</span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!content && !preview}
                className="w-full gradient-fire rounded-lg py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitModal;