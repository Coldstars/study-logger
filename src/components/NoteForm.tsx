"use client";

import { useState, useRef } from "react";
import { addNote } from "@/app/actions";
import { ImageIcon, Send, X } from "lucide-react";

export default function NoteForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await addNote(formData);
      setContent("");
      removeImage();
    } catch (error) {
      console.error("Failed to add note:", error);
      alert("发布失败，请检查网络或配置。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 sticky top-4 z-10 transition-all focus-within:shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天学到了什么..."
          className="w-full min-h-[80px] p-2 border-none focus:ring-0 outline-none text-gray-800 text-lg resize-none"
          disabled={loading}
        />

        {preview && (
          <div className="relative inline-block group">
            <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-100" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-sm opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
              title="上传图片"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition flex items-center gap-2 font-medium"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            记录
          </button>
        </div>
      </form>
    </div>
  );
}
