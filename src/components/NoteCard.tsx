"use client";

import { Note } from "@/lib/types";
import { deleteNote } from "@/app/actions";
import { Trash2, Calendar, Tag, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function NoteCard({ note, onTagClick }: { note: Note; onTagClick?: (tag: string) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("确定要删除这条记录吗？")) return;
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("删除失败，请稍后重试。");
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(note.created_at).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md h-full flex flex-col ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="删除记录"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Link href={`/notes/${note.id}`} className="flex-grow group">
          <p className="text-gray-800 leading-relaxed text-lg mb-4 whitespace-pre-wrap group-hover:text-blue-600 transition-colors">
            {note.content}
          </p>

          {note.image_url && (
            <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-xl border border-gray-50">
              <Image
                src={note.image_url}
                alt="Note image"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}
        </Link>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 mt-auto border-t border-gray-50">
            {note.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-full hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
