import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateTagsForContent = async (content: string) => {
  if (!content) return [];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个学习助手。请根据用户提供的学习记录内容，生成3-5个简洁的标签（tags）。只需返回一个 JSON 数组，例如：[\"标签1\", \"标签2\"]。",
        },
        {
          role: "user",
          content,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.tags || [];
  } catch (error) {
    console.error("OpenAI Tag Generation Error:", error);
    return ["学习"]; // Fallback tag
  }
};
