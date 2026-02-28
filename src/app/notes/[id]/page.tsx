import { createActionClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Trash2 } from "lucide-react";
import { deleteNote } from "@/app/actions";

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = createActionClient();
  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !note) {
    notFound();
  }

  const formattedDate = new Date(note.created_at).toLocaleString("zh-CN", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回列表</span>
        </Link>
      </header>

      <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {note.image_url && (
          <div className="relative aspect-video w-full border-b border-gray-50">
            <Image
              src={note.image_url}
              alt="Note image"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-6">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="p-2 bg-gray-50 rounded-full">
                <Calendar className="w-4 h-4" />
              </div>
              <span>{formattedDate}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {note.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full flex items-center gap-1.5"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-xl md:text-2xl font-light">
              {note.content}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
