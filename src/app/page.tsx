import { createActionClient } from "@/lib/supabase/server";
import { getNotes } from "./actions";
import NoteForm from "@/components/NoteForm";
import Timeline from "@/components/Timeline";
import { LogOut, BookOpen } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const notes = await getNotes();

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">学习记录</h1>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
            title="登出"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </header>

      <NoteForm />
      
      <Timeline notes={notes || []} />
    </div>
  );
}
