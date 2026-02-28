"use client";

import { Note } from "@/lib/types";
import NoteCard from "./NoteCard";
import { useState, useMemo } from "react";
import { Filter, XCircle } from "lucide-react";

export default function Timeline({ notes }: { notes: Note[] }) {
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    if (!filterTag) return notes;
    return notes.filter((note) => note.tags.includes(filterTag));
  }, [notes, filterTag]);

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-lg">还没有记录任何学习笔记哦</p>
        <p className="text-sm">点击上方区域开始吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <Filter className="w-4 h-4" />
          {filterTag ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              <span>正在筛选：{filterTag}</span>
              <button onClick={() => setFilterTag(null)} className="hover:text-blue-800 transition">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span>全部记录 ({notes.length})</span>
          )}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
          没有找到包含该标签的记录
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onTagClick={setFilterTag} />
          ))}
        </div>
      )}
    </div>
  );
}
