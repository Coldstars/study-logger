"use client";

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Auth started...", { email, isLogin });
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        console.log("Login attempt finished", { data, error });
        if (error) throw error;
        router.refresh();
        router.push("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        console.log("Signup attempt finished", { data, error });
        if (error) throw error;
        setMessage("注册成功！请检查邮箱进行验证。");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setMessage(error.message || "操作失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "欢迎回来" : "创建账户"}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="example@mail.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : isLogin ? (
              <LogIn className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {isLogin ? "登录" : "注册"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm text-center ${message.includes("成功") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-black transition"
          >
            {isLogin ? "没有账号？立即注册" : "已有账号？点击登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
