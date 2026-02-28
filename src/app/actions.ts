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

export async function createNoteFromUrl(url: string) {
  const supabase = createActionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  try {
    // 1. Fetch HTML content
    const res = await fetch(url);
    const html = await res.text();

    // 2. Parse basic info and image using cheerio
    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);
    
    // Try to find a representative image (og:image or first big image)
    let imageUrl = $('meta[property="og:image"]').attr("content") || 
                   $('meta[name="twitter:image"]').attr("content") ||
                   $('img').first().attr('src');
    
    // Normalize relative URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      const urlObj = new URL(url);
      imageUrl = new URL(imageUrl, urlObj.origin).toString();
    }

    // 3. AI Rewrite & Tagging
    const { summarizeAndRewrite } = await import("@/lib/openai");
    const { content, tags } = await summarizeAndRewrite($.text());

    // 4. Save to database
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      content: `${content}\n\n[原文链接](${url})`,
      image_url: imageUrl,
      tags,
    });

    if (error) throw error;
    revalidatePath("/");
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("无法抓取该网页内容，请检查链接是否有效。");
  }
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
