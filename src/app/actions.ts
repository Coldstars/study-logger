"use server";

import { createActionClient } from "@/lib/supabase/server";
import { generateTagsForContent } from "@/lib/openai";
import { revalidatePath } from "next/cache";

export async function addNote(formData: FormData) {
  const supabase = createActionClient();
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  let imageUrl = null;

  // 1. Upload image if exists
  if (image && image.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage
      .from("note-images")
      .upload(fileName, image);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from("note-images")
      .getPublicUrl(fileName);
    
    imageUrl = publicUrl;
  }

  // 2. Generate tags using OpenAI
  const tags = await generateTagsForContent(content);

  // 3. Save to database
  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    content,
    image_url: imageUrl,
    tags,
  });

  if (error) throw error;

  revalidatePath("/");
}

export async function deleteNote(id: string) {
  const supabase = createActionClient();
  const { error } = await supabase.from("notes").delete().match({ id });

  if (error) throw error;
  revalidatePath("/");
}

export async function getNotes() {
  const supabase = createActionClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
