import React, { useState } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  db,
  setDoc,
  doc,
  getDoc
} from "../firebase";
import { User, UserRole } from "../types";
import { 
  Code2, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Briefcase, 
  Sparkles,
  ChevronRight,
  Info,
  AlertCircle
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "HTML/CSS", "React", "Node.js", "Express", "Tailwind CSS", "Algorithms", "Database"
];

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper toggle skill
  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Create or retrieve user profile in Firestore
  const syncUserProfile = async (uid: string, defaultName: string, defaultEmail: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User already has profile in DB
        onAuthSuccess(userDocSnap.data() as User);
      } else {
        // Create new profile
        const newUsername = username || defaultEmail.split("@")[0] || `user_${uid.slice(0, 5)}`;
        const newProfile: User = {
          id: uid,
          name: name || defaultName || "عضو مبرمج جديد",
          username: newUsername,
          role: role,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newUsername)}`,
          bio: bio || "شغوف بالبرمجة والتعلم التفاعلي.",
          skills: selectedSkills,
          subscribersCount: 0,
          subscribedTeachers: [],
          completedChallenges: role === "student" ? 0 : undefined,
          solvedErrorsCount: role === "teacher" ? 0 : undefined
        };

        try {
          await setDoc(userDocRef, newProfile);
        } catch (setErr) {
          console.warn("Could not set user document (offline/permission):", setErr);
        }
        onAuthSuccess(newProfile);
      }
    } catch (err: any) {
      console.warn("Offline or failed sync, generating offline/local profile instead:", err);
      const newUsername = username || defaultEmail.split("@")[0] || `user_${uid.slice(0, 5)}`;
      const offlineProfile: User = {
        id: uid,
        name: name || defaultName || "مستخدم دون اتصال",
        username: newUsername,
        role: role,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newUsername)}`,
        bio: bio || "شغوف بالبرمجة والتعلم التفاعلي. بروفايل محلي مؤقت.",
        skills: selectedSkills.length > 0 ? selectedSkills : ["JavaScript", "TypeScript"],
        subscribersCount: 0,
        subscribedTeachers: [],
        completedChallenges: role === "student" ? 0 : undefined,
        solvedErrorsCount: role === "teacher" ? 0 : undefined
      };
      onAuthSuccess(offlineProfile);
    }
  };

  // Google OAuth Login
  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await syncUserProfile(user.uid, user.displayName || "", user.email || "");
    } catch (err: any) {
      console.error("Google Auth Error", err);
      if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
        setError("تم حظر النافذة المنبثقة من المتصفح. يرجى فتح التطبيق في نافذة مستقلة عبر النقر على زر 'فتح في نافذة جديدة' أعلى اليمين ثم تجربة تسجيل الدخول بجوجل.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("خطأ (نطاق غير مصرح به): النطاقات المضافة حديثاً في Firebase قد تستغرق من 5 إلى 10 دقائق لتتفعل بالكامل على خوادم جوجل. يرجى الانتظار قليلاً ثم تحديث الصفحة بالكامل (Ctrl + F5) أو تجربة فتح الموقع في نافذة تصفح خفي (Incognito) لتجاوز التخزين المؤقت للمتصفح.");
      } else {
        setError(`فشل تسجيل الدخول بجوجل: ${err.message || 'يرجى تجربة التسجيل بالبريد الإرشادي أدناه'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Email/Password submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const result = await signInWithEmailAndPassword(auth, email, password);
        await syncUserProfile(result.user.uid, "", result.user.email || "");
      } else {
        // Sign up validating inputs
        if (!name.trim()) throw new Error("يرجى كتابة الاسم الكامل.");
        if (!username.trim()) throw new Error("يرجى كتابة اسم مستخدم فريد.");

        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Save metadata and trigger sync
        await syncUserProfile(result.user.uid, name, result.user.email || "");
      }
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = err.message;
      if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "هذا البريد الإلكتروني مسجل بالفعل بالمنصة.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "كلمة المرور ضعيفة جداً، يرجى إدخال 6 خانات على الأقل.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "صيغة البريد الإلكتروني المدخلة غير صحيحة.";
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        friendlyMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col justify-center items-center p-4 selection:bg-blue-500/30 font-sans" dir="rtl">
      
      {/* Brand Badge */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="p-3.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl shadow-blue-500/10 text-white border border-white/20 animate-pulse">
          <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">رابطة المبرمجين والتعليم</h1>
        <p className="text-sm text-white/50 max-w-sm">منصة تفاعلية آمنة للتواصل التعليمي البرمجي وبناء الكود حياً للأفذاذ</p>
      </div>

      {/* Main card */}
      <div className="w-full max-w-xl bg-[#0D0D0D] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
        
        {/* Switch tab */}
        <div className="flex border-b border-white/10 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              isLogin ? "border-blue-500 text-white" : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            تسجيل دخول
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              !isLogin ? "border-blue-500 text-white" : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="mb-5 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl p-3.5 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google sign in widget */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-white hover:bg-white/95 text-neutral-900 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-3 shadow-md mb-6 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>تسجيل الدخول الفوري بحساب Google</span>
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative px-3 bg-[#0D0D0D] text-[10px] text-white/30 uppercase font-mono">أو التسجيل العادي</span>
        </div>

        {/* Standard Email logic */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Profile fields ONLY on Signup */}
          {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/5 pb-4 mb-2">
              <div>
                <label className="block text-xs text-white/40 mb-1 font-bold">الاسم الكامل:</label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-3 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 pr-10 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none"
                    placeholder="م. أحمد الرويلي"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1 font-bold">اسم المستخدم (Username):</label>
                <div className="relative">
                  <span className="absolute right-3 top-2.5 text-xs text-white/30">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 pr-8 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none"
                    placeholder="ahmed_dev"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-xs text-white/40 mb-1 font-bold">البريد الإلكتروني:</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 pr-10 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none"
                placeholder="developer@example.com"
                dir="ltr"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs text-white/40 mb-1 font-bold">كلمة المرور:</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 pr-10 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {/* Setup Bio and Role on Signup */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 font-bold">اختر نوع العضوية:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      role === "student"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-black/40 border-white/10 text-white/60 hover:bg-neutral-900"
                    }`}
                  >
                    <span className="text-xl">💻</span>
                    <span className="text-xs font-bold block text-white/90">طالب مبرمج</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      role === "teacher"
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                        : "bg-black/40 border-white/10 text-white/60 hover:bg-neutral-900"
                    }`}
                  >
                    <span className="text-xl">🎓</span>
                    <span className="text-xs font-bold block text-white/90">معلم مبرمج</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1 font-bold">نبذة تعريفية (Bio):</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none leading-relaxed"
                  placeholder="لغاتك البرمجية المفضلة ونشاطك المهني..."
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-2 font-bold">اختر حقيبتك التقنية:</label>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_OPTIONS.map(skill => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleToggleSkill(skill)}
                        className={`text-[10px] px-2.5 py-1 rounded border font-mono transition-all ${
                          isSelected 
                            ? "bg-blue-600 text-white font-extrabold border-blue-500" 
                            : "bg-black/40 border-white/5 text-white/60"
                        }`}
                      >
                        {skill} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Form button submission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold rounded-lg text-sm transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <span>تسجيل الدخول الآمن 🚀</span>
            ) : (
              <span>تأكيد العضوية وبناء البروفايل ⚡</span>
            )}
          </button>
        </form>
      </div>

      {/* Frame details helper */}
      <div className="mt-6 flex items-center gap-2 text-white/30 text-[11px] font-sans max-w-sm text-center">
        <Info className="w-4 h-4 text-blue-500/40 shrink-0" />
        <span>إذا واجهتك مشاكل في مصادقة Google ضمن إطار التطبيق التفاعلي، يمكنك إنشاء حساب بريد إلكتروني فوري لتجربة الفضاء بكافة مزايا الـ Backend.</span>
      </div>

    </div>
  );
}
