import React, { useState } from "react";
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle, 
  AlertCircle, 
  Code, 
  Send, 
  Filter, 
  User as UserIcon, 
  Check, 
  BrainCircuit, 
  BookOpen,
  PlusCircle,
  FileCode,
  Sparkles
} from "lucide-react";
import { Post, Comment, User, UserRole } from "../types";

interface CommunityFeedProps {
  posts: Post[];
  currentUser: User;
  onAddPost: (post: Omit<Post, "id" | "authorId" | "authorName" | "authorAvatarUrl" | "authorRole" | "createdAt" | "likes" | "comments">) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string, code?: { code: string; language: string }) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onMarkSolution: (postId: string, commentId: string) => void;
  prepopulatedCode?: { code: string; language: string; filename: string } | null;
  onClearPrepopulatedCode?: () => void;
  onUpdateUserProfile?: (avatarUrl: string, bannerUrl: string) => Promise<void>;
}

const LAN_TAGS = ["HTML", "React", "Python", "JavaScript", "TypeScript", "Node.js", "CSS"];

const BANNER_PRESETS = [
  { name: "شفرة نيون", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" },
  { name: "تدرج كوني", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
  { name: "برمجية زرقاء", url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80" },
  { name: "سطر الأوامر", url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80" },
  { name: "غابة تقنية", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" }
];

const AVATAR_PRESETS = [
  { name: "أحمد", seed: "ahmed" },
  { name: "سارة", seed: "sara" },
  { name: "خالد", seed: "khalid" },
  { name: "نورة", seed: "noura" },
  { name: "عمر", seed: "omar" },
  { name: "منى", seed: "mouna" },
  { name: "يوسف", seed: "youssef" }
];

export default function CommunityFeed({
  posts,
  currentUser,
  onAddPost,
  onLikePost,
  onAddComment,
  onLikeComment,
  onMarkSolution,
  prepopulatedCode,
  onClearPrepopulatedCode,
  onUpdateUserProfile
}: CommunityFeedProps) {
  const [filterType, setFilterType] = useState<"all" | "error" | "general" | "tutorial">("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("كل اللغات");
  
  // Post Creator Form States
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [newPostType, setNewPostType] = useState<"general" | "error" | "tutorial">("general");
  const [newPostLang, setNewPostLang] = useState<string>("JavaScript");
  const [includeCode, setIncludeCode] = useState<boolean>(false);
  const [newPostCode, setNewPostCode] = useState<string>("");
  const [newPostCodeLang, setNewPostCodeLang] = useState<string>("javascript");
  const [newPostFilename, setNewPostFilename] = useState<string>("script.js");

  // Comment Form States (postId -> comment value)
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [showCommentFormCode, setShowCommentFormCode] = useState<Record<string, boolean>>({});
  const [commentCodeInput, setCommentCodeInput] = useState<Record<string, string>>({});

  // User Profile Customizer States
  const [showProfileEdit, setShowProfileEdit] = useState<boolean>(false);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>(currentUser.avatarUrl);
  const [editBannerUrl, setEditBannerUrl] = useState<string>(currentUser.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");

  React.useEffect(() => {
    if (currentUser) {
      setEditAvatarUrl(currentUser.avatarUrl);
      setEditBannerUrl(currentUser.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80");
    }
  }, [currentUser]);

  // Populate from IDE pre-selection
  React.useEffect(() => {
    if (prepopulatedCode) {
      setNewPostContent(prev => prev || `قمت بتخصيص كود برمجي وأواجه به بعض الصعوبات أو المشاكل. إليكم تفاصيل الكود لمساعدتي في حله:`);
      setNewPostType("error");
      setNewPostLang(prepopulatedCode.language === "react"? "React" : prepopulatedCode.language === "python" ? "Python" : "JavaScript");
      setIncludeCode(true);
      setNewPostCode(prepopulatedCode.code);
      setNewPostCodeLang(prepopulatedCode.language);
      setNewPostFilename(prepopulatedCode.filename);
      
      // Auto-scroll to form
      const el = document.getElementById("post-creator-box");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [prepopulatedCode]);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    onAddPost({
      content: newPostContent,
      type: newPostType,
      language: newPostLang,
      codeSnippet: includeCode ? {
        code: newPostCode,
        language: newPostCodeLang,
        filename: newPostFilename
      } : undefined
    });

    // Reset Form
    setNewPostContent("");
    setNewPostType("general");
    setIncludeCode(false);
    setNewPostCode("");
    if (onClearPrepopulatedCode) {
      onClearPrepopulatedCode();
    }
  };

  const handlePostComment = (postId: string) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;

    const hasCode = showCommentFormCode[postId];
    const code = hasCode ? {
      code: commentCodeInput[postId] || "",
      language: "javascript"
    } : undefined;

    onAddComment(postId, text, code);

    // Reset Comment Field
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    setCommentCodeInput(prev => ({ ...prev, [postId]: "" }));
    setShowCommentFormCode(prev => ({ ...prev, [postId]: false }));
  };

  const handleSaveProfileCustomization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUserProfile) {
      await onUpdateUserProfile(editAvatarUrl, editBannerUrl);
      setShowProfileEdit(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesType = filterType === "all" || post.type === filterType;
    const matchesLanguage = filterLanguage === "كل اللغات" || post.language?.toLowerCase() === filterLanguage.toLowerCase();
    return matchesType && matchesLanguage;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="community-feed">
      {/* Filters Sidebar */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        {/* Profile Card Summary */}
        <div className="bg-[#151515] border border-white/10 rounded-2xl shadow-xl text-center animate-fade-in relative overflow-hidden flex flex-col items-center pt-20 pb-5" id="profile-card-summary">
          {/* Cover/Banner Background */}
          <div 
            className="absolute top-0 inset-x-0 h-20 bg-[#1e293b] bg-cover bg-center border-b border-white/5"
            style={{ backgroundImage: `url(${currentUser.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"})` }}
          >
            {/* Dark tint overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Quick edit button inside banner */}
            <button
              onClick={() => setShowProfileEdit(!showProfileEdit)}
              className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 transition text-[10px] flex items-center gap-1.5 cursor-pointer z-20"
              title="تعديل المظهر"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>تعديل المظهر</span>
            </button>
          </div>

          <img 
            src={currentUser.avatarUrl} 
            alt={currentUser.name} 
            className="w-18 h-18 rounded-full border-4 border-[#151515] bg-[#101010] shadow-md hover:border-blue-500/80 transition-all duration-300 object-cover z-10 cursor-pointer mb-3"
            referrerPolicy="no-referrer"
            onClick={() => setShowProfileEdit(!showProfileEdit)}
          />

          <div className="px-5 w-full flex flex-col items-center z-10">
            <h3 className="text-lg font-bold text-white mb-0.5">{currentUser.name}</h3>
            <p className="text-xs text-white/40 mb-3 font-mono">@{currentUser.username}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-sans mb-4 bg-black/40 border border-white/10">
              {currentUser.role === "teacher" ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-purple-500 shadow-md"></span>
                  <span className="text-purple-400">حساب معلم 🎓</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-md"></span>
                  <span className="text-blue-400">حساب طالب مبرمج 💻</span>
                </>
              )}
            </div>

            {/* Editing Form Inline when active */}
            {showProfileEdit ? (
              <form onSubmit={handleSaveProfileCustomization} className="text-right w-full mt-2 p-3 border border-white/10 rounded-xl bg-black/60 animate-fade-in flex flex-col gap-3">
                <span className="text-[10px] font-extrabold text-[#38bdf8] block border-b border-white/5 pb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>تعديل المظهر والبانر</span>
                </span>

                {/* Avatar Word Seed Control */}
                <div>
                  <label className="block text-[9px] font-bold text-white/50 mb-1">رمز الصورة الشخصية:</label>
                  <div className="flex flex-col gap-1.5">
                    <input 
                      type="text" 
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="أدخل رابط صورة مباشر أو رمز فريد..." 
                      className="w-full bg-[#1A1B1E] text-white rounded-lg p-2 text-[10px] border border-white/10 focus:border-blue-500/40 focus:outline-none focus:ring-0 text-left font-mono"
                    />
                    
                    {/* Presets Grid */}
                    <div className="flex flex-wrap gap-1 justify-start">
                      {AVATAR_PRESETS.map(preset => (
                        <button
                          key={preset.seed}
                          type="button"
                          onClick={() => setEditAvatarUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${preset.seed}`)}
                          className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                            editAvatarUrl.includes(preset.seed)
                              ? "bg-blue-600 text-white border-blue-500 font-bold"
                              : "bg-black/35 text-white/70 border-white/5 hover:bg-white/5"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner Preset Control */}
                <div>
                  <label className="block text-[9px] font-bold text-white/50 mb-1">صورة البانر الخلفي:</label>
                  <div className="flex flex-col gap-1.5">
                    <input 
                      type="text" 
                      value={editBannerUrl}
                      onChange={(e) => setEditBannerUrl(e.target.value)}
                      placeholder="رابط صورة البانر الخلفي..." 
                      className="w-full bg-[#1A1B1E] text-white rounded-lg p-2 text-[10px] border border-white/10 focus:border-blue-500/40 focus:outline-none focus:ring-0 text-left font-mono"
                    />

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 gap-1">
                      {BANNER_PRESETS.map(preset => {
                        const isSelected = editBannerUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setEditBannerUrl(preset.url)}
                            className={`text-[9px] px-1.5 py-1 rounded border truncate transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-500 font-bold"
                                : "bg-black/35 text-white/70 border-white/5 hover:bg-white/5"
                            }`}
                          >
                            {preset.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="flex justify-end gap-1.5 border-t border-white/5 pt-2 mt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowProfileEdit(false)}
                    className="px-2 py-1 rounded bg-black/40 border border-white/10 text-white/60 hover:text-white text-[9px]"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[9px] shadow-lg"
                  >
                    حفظ ✓
                  </button>
                </div>
              </form>
            ) : null}

            <div className="grid grid-cols-2 gap-2 text-right border-t border-white/10 pt-3 text-xs w-full mt-2">
              <div>
                <span className="text-white/40 block">الدور المعتمد:</span>
                <span className="font-bold text-white/80">{currentUser.role === "teacher" ? "مدرب عام" : "متعلم شغوف"}</span>
              </div>
              <div>
                <span className="text-white/40 block">الاشتراكات:</span>
                <span className="font-bold text-white/80">
                  {currentUser.role === "teacher" 
                    ? `${currentUser.subscribersCount} طالب`
                    : `${currentUser.subscribedTeachers.length} معلمين`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters control */}
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>تصفية المنشورات</span>
          </div>

          {/* Type filters */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setFilterType("all")}
              className={`w-full text-right px-3 py-2 rounded-xl text-xs transition-colors ${
                filterType === "all" ? "bg-white/5 text-white font-bold border border-white/10" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              🔥 مجرى المحادثات بالكامل
            </button>
            <button
              onClick={() => setFilterType("error")}
              className={`w-full text-right px-3 py-2 rounded-xl text-xs transition-colors ${
                filterType === "error" ? "bg-red-500/10 text-red-400 font-bold border border-red-500/20" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              🛑 مشاكل وأخطاء برمجية (Errors)
            </button>
            <button
              onClick={() => setFilterType("general")}
              className={`w-full text-right px-3 py-2 rounded-xl text-xs transition-colors ${
                filterType === "general" ? "bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              💬 أسئلة ونقاشات عامة
            </button>
            <button
              onClick={() => setFilterType("tutorial")}
              className={`w-full text-right px-3 py-2 rounded-xl text-xs transition-colors ${
                filterType === "tutorial" ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              🎓 شروحات ودروس المعلمين
            </button>
          </div>

          <hr className="border-white/10" />

          {/* Languages filters */}
          <div>
            <span className="block text-xs font-bold text-white/40 mb-2">🏷️ لغات البرمجة المرافقة</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setFilterLanguage("كل اللغات")}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                  filterLanguage === "كل اللغات" ? "bg-white/10 text-white font-bold" : "bg-black/40 text-white/40 hover:text-white"
                }`}
              >
                الجميع
              </button>
              {LAN_TAGS.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilterLanguage(lang)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                    filterLanguage.toLowerCase() === lang.toLowerCase() ? "bg-white/10 text-blue-400 font-bold" : "bg-black/40 text-white/40 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Posts Feed */}
      <div className="lg:col-span-9 flex flex-col gap-6" id="primary-feed-col">
        {/* Post Creator Panel */}
        <div 
          id="post-creator-box"
          className="bg-[#151515] border border-white/10 rounded-2xl p-5 shadow-xl"
        >
          <form onSubmit={handleSubmitPost} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-black/40" />
              <div className="flex-1">
                <span className="block text-sm font-bold text-white">طرح موضوع أو مشكلة برمجية جديدة</span>
                <span className="block text-xs text-white/40">انشر كودك المصاب بالخطأ ليتعاون من هم في المنصة على حله!</span>
              </div>
            </div>

            <textarea
              id="post-textbox"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-[#0A0A0A] text-white/90 rounded-xl p-4 text-sm placeholder-white/30 outline-none border border-white/10 focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 min-h-[100px] leading-relaxed transition-all"
              placeholder={
                newPostType === "error" 
                  ? "ما هي رسالة الخطأ أو المشكلة البرمجية التي تظهر لك بالتحديد؟ اكتب شرحاً موجزاً..." 
                  : "شارك فكرة، درس مفيد، أو اطرح سؤالاً للمبرمجين هنا..."
              }
            />

            {/* Input Config Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3 rounded-xl border border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {/* Post Type Selector */}
                <select
                  id="select-post-type"
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value as any)}
                  className="bg-[#151515] border border-white/10 hover:border-white/20 text-[#E0E0E0] text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="general">💬 نقاش عام / سؤال</option>
                  <option value="error">🛑 مشكلة وأخطاء برمجية (مستعجل)</option>
                  {currentUser.role === "teacher" && (
                    <option value="tutorial">💡 درس / مادة تعليمية جديدة</option>
                  )}
                </select>

                {/* Scope filter tagging */}
                <select
                  id="select-post-lang"
                  value={newPostLang}
                  onChange={(e) => setNewPostLang(e.target.value)}
                  className="bg-[#151515] border border-white/10 hover:border-white/20 text-[#E0E0E0] text-xs rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  {LAN_TAGS.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Attach Code Toggle */}
              <button
                type="button"
                id="toggle-attach-code"
                onClick={() => setIncludeCode(!includeCode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  includeCode 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" 
                    : "bg-white/5 text-white/60 border border-white/10 hover:text-white"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>أرفق كود برمي خطي</span>
              </button>
            </div>

            {/* Hidden Code Input Section */}
            {includeCode && (
              <div id="attach-code-section" className="flex flex-col gap-2.5 bg-black/60 p-4 rounded-xl border border-white/10 antialiased">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white/80">أرفق الكود المصدر لمراجعته:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="attach-filename-input"
                      value={newPostFilename}
                      onChange={(e) => setNewPostFilename(e.target.value)}
                      className="bg-[#151515] border border-white/10 text-[11px] text-white/80 rounded px-2 py-0.5 w-[140px] font-mono text-center focus:outline-none"
                      placeholder="اسم الملف مثلاً main.py"
                    />
                    <select
                      id="attach-code-lang"
                      value={newPostCodeLang}
                      onChange={(e) => setNewPostCodeLang(e.target.value)}
                      className="bg-[#151515] border border-white/10 text-[10px] text-white/85 rounded px-2 py-0.5 focus:outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                    </select>
                  </div>
                </div>

                <textarea
                  id="attach-code-textarea"
                  value={newPostCode}
                  onChange={(e) => setNewPostCode(e.target.value)}
                  className="w-full bg-[#1A1B1E] text-white p-3 rounded-lg border border-white/10 font-mono text-xs focus:ring-1 focus:ring-blue-500/20 outline-none leading-relaxed h-[130px]"
                  placeholder={`// اكتب كودك البرمجي هنا... \n// أو قنوات IDE لتوليد كود تلقائياً ورابطه هنا`}
                  dir="ltr"
                />
              </div>
            )}

            <button
              type="submit"
              id="btn-submit-post"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all self-end shadow-lg shadow-blue-500/10 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>نشر الآن لمخطط المبرمجين</span>
            </button>
          </form>
        </div>

        {/* List of Posts */}
        <div className="flex flex-col gap-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold mb-1">لا توجد منشورات تطابق هذا التصفية حالياً</p>
              <p className="text-xs text-slate-500">كن أول من يشارك كوده البرمجي أو سؤاله بمطالعة لوحات المناقشة.</p>
            </div>
          ) : (
            filteredPosts.map(post => {
              const isLikedByMe = post.likes.includes(currentUser.id);
              
              return (
                <div 
                  key={post.id}
                  id={`post-card-${post.id}`}
                  className={`bg-slate-900 rounded-2xl border transition-all p-5 shadow-lg flex flex-col gap-4 ${
                    post.type === "error" 
                      ? post.isSolved 
                        ? "border-emerald-500/20 hover:border-emerald-500/30 shadow-emerald-950/5" 
                        : "border-rose-500/20 hover:border-rose-500/30 shadow-rose-950/5"
                      : "border-slate-800 hover:border-slate-800/80"
                  }`}
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <img src={post.authorAvatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-800" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-200">{post.authorName}</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-sans font-medium ${
                            post.authorRole === "teacher" 
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                              : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          }`}>
                            {post.authorRole === "teacher" ? "معلم 🎓" : "طالب 💻"}
                          </span>
                        </div>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {new Date(post.createdAt).toLocaleDateString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Category Action tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.language && (
                        <span className="px-2 py-1 bg-slate-950/80 border border-slate-800 text-slate-400 rounded-lg text-[10px] font-mono">
                          #{post.language}
                        </span>
                      )}

                      {post.type === "error" && (
                        post.isSolved ? (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-xl font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>تم الحل بنجاح ✅</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs rounded-xl font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span>طلب مساعدة عاجلة 🛑</span>
                          </span>
                        )
                      )}

                      {post.type === "tutorial" && (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs rounded-xl font-bold">
                          💡 مادة شرح
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Attached Code Box */}
                  {post.codeSnippet && (
                    <div className="bg-slate-950 font-mono rounded-xl p-4 border border-slate-800 relative group overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Code className="w-3.5 h-3.5" />
                          <span>{post.codeSnippet.filename || "snippet.py"}</span>
                        </div>
                        <span className="text-[10px] uppercase text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/80">
                          {post.codeSnippet.language}
                        </span>
                      </div>
                      <pre className="text-xs text-sky-400 overflow-x-auto leading-relaxed text-right scrollbar-thin" dir="ltr">
                        <code>{post.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Solved Answer Banner Highlight on top if solved */}
                  {post.type === "error" && post.isSolved && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-emerald-400 mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold font-sans"> الحل المعتمد والمثَبَّت من السائل والمجتمع:</span>
                      </div>
                      {post.comments.find(c => c.id === post.solvedByCommentId) ? (
                        <div className="text-slate-300 text-xs leading-relaxed">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-slate-200">
                              تم الحل بواسطة: {post.comments.find(c => c.id === post.solvedByCommentId)?.authorName}
                            </span>
                          </div>
                          <p>{post.comments.find(c => c.id === post.solvedByCommentId)?.content}</p>
                          {post.comments.find(c => c.id === post.solvedByCommentId)?.codeSnippet && (
                            <pre className="mt-3 p-3 bg-slate-950 text-emerald-300 rounded border border-emerald-950 font-mono text-[11px] overflow-x-auto" dir="ltr">
                              <code>{post.comments.find(c => c.id === post.solvedByCommentId)?.codeSnippet?.code}</code>
                            </pre>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">تم تثبيت حل هذه الثغرة من قبل المطور العام.</p>
                      )}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex items-center gap-4 border-y border-slate-800 py-2.5">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                        isLikedByMe ? "text-blue-400 scale-[1.02]" : "text-white/40 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes.length} إعجاب</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-white/40 font-bold">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} تعليقات وحلول</span>
                    </div>
                  </div>

                  {/* Comments Thread Section */}
                  <div className="flex flex-col gap-3">
                    {post.comments.map(comment => {
                      const isCommentLiked = comment.likes.includes(currentUser.id);
                      return (
                        <div 
                          key={comment.id}
                          className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
                            comment.isSolution 
                              ? "bg-emerald-950/10 border-emerald-500/40" 
                              : comment.authorRole === "teacher"
                                ? "bg-purple-950/10 border-purple-500/20"
                                : "bg-black/40 border-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={comment.authorAvatarUrl} alt="" className="w-7 h-7 rounded-full bg-black/40" />
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">
                                  {comment.authorName}
                                  {comment.authorRole === "teacher" && (
                                    <span className="mr-1.5 text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-sans border border-purple-500/30">
                                      برتبة معلم 🎓
                                    </span>
                                  )}
                                </span>
                                <span className="text-[9px] text-white/40">
                                  {new Date(comment.createdAt).toLocaleDateString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>

                            {/* Solution marking tool (Only if I am OP and this is error post and not solved yet) */}
                            {post.type === "error" && !post.isSolved && post.authorId === currentUser.id && (
                              <button
                                onClick={() => onMarkSolution(post.id, comment.id)}
                                id={`mark-solution-btn-${comment.id}`}
                                className="flex items-center gap-1.5 px-2 py-1 bg-emerald-600/10 hover:bg-emerald-600 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-500 text-[10px] text-emerald-400 rounded-lg font-bold transition-all"
                              >
                                <Check className="w-3 h-3" />
                                <span>قبول كحل معتمد</span>
                              </button>
                            )}

                            {comment.isSolution && (
                              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] rounded-lg font-extrabold shadow shadow-emerald-500/20">
                                <Check className="w-3 h-3" />
                                <span>صاحب الحل الأكيد</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-white/80 leading-relaxed font-sans mt-1">
                            {comment.content}
                          </p>

                          {comment.codeSnippet && (
                            <pre className="mt-2 p-3 bg-black/60 text-blue-300 rounded border border-white/5 font-mono text-[11px] overflow-x-auto leading-relaxed" dir="ltr">
                              <code>{comment.codeSnippet.code}</code>
                            </pre>
                          )}

                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => onLikeComment(post.id, comment.id)}
                              className={`flex items-center gap-1 text-[10px] font-bold ${
                                isCommentLiked ? "text-blue-400" : "text-white/40 hover:text-white"
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{comment.likes.length} مفيد</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Comment input form */}
                  <div className="flex flex-col gap-2 mt-2 bg-black/40 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-black/40" />
                      <input
                        id={`comment-box-${post.id}`}
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handlePostComment(post.id);
                          }
                        }}
                        className="flex-1 bg-[#0A0A0A] text-white/95 rounded-lg px-3 py-2 text-xs placeholder-white/30 border border-white/10 focus:outline-none focus:border-blue-500/50"
                        placeholder="اكتب حلاً أو رداً مفيداً (اضغط Enter للإرسال)..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowCommentFormCode({ ...showCommentFormCode, [post.id]: !showCommentFormCode[post.id] })}
                        className={`p-2 rounded-lg text-xs transition-all ${
                          showCommentFormCode[post.id] ? "bg-blue-500/20 text-blue-400" : "bg-[#151515] text-white/40 hover:text-white"
                        }`}
                        title="إرفق كود مراجع للحل"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handlePostComment(post.id)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                        title="إرسال"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {showCommentFormCode[post.id] && (
                      <div className="mt-2 flex flex-col gap-1.5 animate-fadeIn">
                        <span className="text-[10px] font-bold text-white/40">إرفق الكود المقترح مع إجابتك:</span>
                        <textarea
                          value={commentCodeInput[post.id] || ""}
                          onChange={(e) => setCommentCodeInput({ ...commentCodeInput, [post.id]: e.target.value })}
                          className="w-full bg-[#1A1B1E] text-blue-300 text-xs font-mono p-2.5 rounded-lg border border-white/10 outline-none focus:border-blue-500/45 h-20"
                          placeholder="// اكتب الكود البرمجي المقترح هنا..."
                          dir="ltr"
                        />
                      </div>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
