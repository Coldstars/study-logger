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

export const summarizeAndRewrite = async (htmlContent: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // Use larger context for full page content
      messages: [
        {
          role: "system",
          content: "你是一个知识整理专家。请阅读提供的网页 HTML 内容，提取核心知识点，并以第一人称的“学习笔记”风格重新改写（洗稿）。要求：语气自然、重点突出、包含核心图片描述（如果有）。输出格式为 JSON：{\"content\": \"改写后的内容\", \"tags\": [\"标签1\", \"标签2\"]}",
        },
        {
          role: "user",
          content: htmlContent.substring(0, 12000), // Limit length for safety
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      content: result.content || "内容解析失败",
      tags: result.tags || ["自动抓取"],
    };
  } catch (error) {
    console.error("OpenAI Rewrite Error:", error);
    return {
      content: "由于技术原因，无法解析并改写此内容。",
      tags: ["错误"],
    };
  }
};
