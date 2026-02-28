"use client";

import { useState, useRef } from "react";
import { addNote, createNoteFromUrl } from "@/app/actions";
import { ImageIcon, Send, X, Link as LinkIcon, Edit3, Loader2 } from "lucide-react";

export default function NoteForm() {
  const [mode, setMode] = useState<"text" | "url">("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
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
    setLoading(true);

    try {
      if (mode === "url") {
        if (!url.trim()) return;
        await createNoteFromUrl(url);
        setUrl("");
        setMode("text");
      } else {
        if (!content.trim()) return;
        const formData = new FormData();
        formData.append("content", content);
        if (image) formData.append("image", image);
        await addNote(formData);
        setContent("");
        removeImage();
      }
    } catch (error: any) {
      console.error("Failed to add note:", error);
      alert(error.message || "发布失败，请检查网络或配置。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 sticky top-4 z-20 transition-all focus-within:shadow-md max-w-3xl mx-auto w-full group">
      <div className="flex gap-4 mb-4 p-1 bg-gray-50 rounded-xl w-fit">
        <button
          onClick={() => setMode("text")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            mode === "text" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          文字记录
        </button>
        <button
          onClick={() => setMode("url")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            mode === "url" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          网页抓取
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "text" ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="今天学到了什么..."
              className="w-full min-h-[120px] p-2 border-none focus:ring-0 outline-none text-gray-800 text-lg md:text-xl resize-none font-light"
              disabled={loading}
            />

            {preview && (
              <div className="relative inline-block group/img">
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-2xl border border-gray-100 shadow-sm" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg opacity-0 group-hover/img:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="粘贴网页链接 (如: 微信文章、知乎、博客...)"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg transition-all"
              disabled={loading}
              required
            />
            <p className="mt-3 text-sm text-gray-400 px-1">
              AI 将自动提取内容、提取图片并进行改写整理。
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex gap-1">
            {mode === "text" && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                  title="上传图片"
                >
                  <ImageIcon className="w-6 h-6" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (mode === "text" ? !content.trim() : !url.trim())}
            className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 transition-all flex items-center gap-2 font-semibold shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {mode === "url" ? "开始抓取" : "发布记录"}
          </button>
        </div>
      </form>
    </div>
  );
}
