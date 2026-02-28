# 学习记录网站 | Study Logger

使用 Next.js 14 + Supabase + OpenAI 构建的现代学习记录网站。

## 功能特点

- 🔐 **用户系统**：Supabase Auth 邮箱注册/登录。
- 📝 **记录功能**：支持文字和图片上传。
- 🏷️ **自动标签**：AI 自动分析文字内容并生成标签。
- 📱 **响应式**：移动端优先，现代化极简 UI。
- 🔍 **便携搜索**：支持点击标签筛选笔记。

## 本地运行步骤

1. **克隆项目并安装依赖**

   ```bash
   cd study-logger
   npm install
   ```

2. **配置环境变量**
   在根目录创建 `.env.local` 文件，填入以下内容：

   ```env
   NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
   OPENAI_API_KEY=你的OpenAI API Key
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## Supabase 配置步骤

### 1. 创建数据库表

在 Supabase SQL Editor 中运行以下 SQL：

```sql
-- 创建 notes 表
create table notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  content text not null,
  image_url text,
  tags text[] default array[]::text[],
  created_at timestamp with time zone default now()
);

-- 启用 RLS (Row Level Security)
alter table notes enable row level security;

-- 创建策略：用户只能看到自己的数据
create policy "Individuals can view their own notes." on notes
for select using (auth.uid() = user_id);

create policy "Individuals can create their own notes." on notes
for insert with check (auth.uid() = user_id);

create policy "Individuals can delete their own notes." on notes
for delete using (auth.uid() = user_id);
```

### 2. 创建存储桶 (Storage)

- 在 Supabase Dashboard 进入 **Storage**。
- 创建一个名为 `note-images` 的新存储桶。
- 将其设置为 **Public**。
- 设置 RLS 策略，允许认证用户进行 `Insert` 和 `Select`。

## Vercel 部署步骤

1. 将代码推送到 GitHub/GitLab。
2. 在 Vercel 导入该项目。
3. 在 Vercel Dashboard 填入 `.env.local` 中的环境变量。
4. 点击 **Deploy**。
