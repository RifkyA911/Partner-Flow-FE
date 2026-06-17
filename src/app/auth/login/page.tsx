"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Mail, Lock, ArrowRight, User, Shield, Copy, Check } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const demoAccounts = [
  {
    id: "partner",
    email: "partner@example.com",
    password: "partner123",
    name: "Partner Demo",
    role: "partner",
    icon: User,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "admin",
    email: "admin@partnerflow.com",
    password: "admin123",
    name: "Admin Demo",
    role: "admin",
    icon: Shield,
    color: "from-purple-500 to-pink-500",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const [isDark, setIsDark] = useState(true);
  const [showDemo, setShowDemo] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const { data: session, status } = useSession();

  useEffect(() => {
    const showDemoParam = searchParams.get("showDemo");
    setShowDemo(showDemoParam === "true");
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        // Refresh session to ensure role is set
        await update();
        // Smooth redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", { callbackUrl: "/auth/onboarding" });
      if ((result as any)?.error) {
        setError("Google sign in failed");
      }
    } catch (err) {
      setError("An error occurred with Google sign in");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (account: typeof demoAccounts[0]) => {
    setForm({ email: account.email, password: account.password });
  };

  const copyCredentials = (account: typeof demoAccounts[0]) => {
    const text = `Email: ${account.email}\nPassword: ${account.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(account.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className={`min-h-screen mt-4 mb-16 flex items-center justify-center px-4 animate-fade-in ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="w-full max-w-md">
        {/* Back button */}
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className={`transition-all duration-300 ${isDark ? "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-105"}`}>
              <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Partner Flow</h1>
        </div>

        {/* Login Card */}
        <Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} backdrop-blur-xl rounded-xl transition-all duration-300 hover:shadow-lg`}>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>Sign In</h2>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>Access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-lg px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2.5 rounded-lg text-sm transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className={`text-center text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Or continue with
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="outline"
                className={`w-full gap-2 text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
              >
                <FcGoogle className="w-5 h-5" />
                Sign in with Google
              </Button>

              <div className={`text-center text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Don't have an account?{" "}
                <a href="/auth/register" className="text-blue-400 hover:text-blue-300">
                  Register
                </a>
              </div>
            </form>

            {/* Demo Accounts */}
            {showDemo && (
              <div className={`mt-6 pt-4 border-t ${isDark ? "border-white/10" : "border-gray-200"}`}>
                <p className={`text-xs mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Demo Accounts</p>
                <div className="space-y-2">
                  {demoAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`flex items-center gap-2 border rounded-lg p-2 hover:transition-all cursor-pointer ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-100"}`}
                      onClick={() => fillDemoCredentials(account)}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${account.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <account.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{account.name}</p>
                        <p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>{account.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 w-6 p-0 ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCredentials(account);
                        }}
                      >
                        {copiedId === account.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
