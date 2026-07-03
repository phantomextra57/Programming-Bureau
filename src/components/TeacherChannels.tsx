import React, { useState, useEffect } from "react";
import { 
  Users, 
  Tv, 
  Sparkles, 
  Bookmark, 
  Send, 
  CheckCircle,
  AlertTriangle,
  Heart,
  FileCode,
  UserCheck,
  Megaphone,
  BellRing
} from "lucide-react";
import { User, TeacherChannelPost } from "../types";

interface TeacherChannelsProps {
  currentUser: User;
  teachers: User[];
  channelPosts: TeacherChannelPost[];
  onSubscribe: (teacherId: string) => void;
  onUnsubscribe: (teacherId: string) => void;
  onAddChannelPost: (title: string, content: string, code?: string, language?: string) => void;
}

export default function TeacherChannels({
  currentUser,
  teachers,
  channelPosts,
  onSubscribe,
  onUnsubscribe,
  onAddChannelPost
}: TeacherChannelsProps) {
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(teachers[0]?.id || null);

  useEffect(() => {
    if (!activeTeacherId && teachers.length > 0) {
      setActiveTeacherId(teachers[0].id);
    }
  }, [teachers, activeTeacherId]);
  
  // Teacher Channel Post Creator Box States
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newCode, setNewCode] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("javascript");
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);

  const handlePostToChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onAddChannelPost(
      newTitle,
      newContent,
      showCodeInput && newCode.trim() ? newCode : undefined,
      showCodeInput ? newLanguage : undefined
    );

    setNewTitle("");
    setNewContent("");
    setNewCode("");
    setShowCodeInput(false);
  };

  const activeTeacher = teachers.find(t => t.id === activeTeacherId);
  const isSubscribedToActive = activeTeacher 
    ? currentUser.subscribedTeachers.includes(activeTeacher.id) 
    : false;

  // Filter channel updates only for active teacher
  const activeTeacherUpdates = channelPosts.filter(p => p.teacherId === activeTeacherId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="teacher-channels">
      
      {/* Sidebar: Teachers List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">المعلمون المعتمدون بالمنصة</h3>
          </div>
          <p className="text-xs text-white/40 mb-4 leading-relaxed">
            تصفح القنوات الرسمية للمعلمين المشرفين، وتابع شروحاتهم التعليمية وأكوادهم البرمجية لرفع مستواك.
          </p>

          <div className="flex flex-col gap-2">
            {teachers.map(teacher => {
              const isSelected = teacher.id === activeTeacherId;
              const hasSubscribed = currentUser.subscribedTeachers.includes(teacher.id);

              return (
                <button
                  key={teacher.id}
                  id={`teacher-list-item-${teacher.id}`}
                  onClick={() => setActiveTeacherId(teacher.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-right transition-all ${
                    isSelected 
                      ? "bg-white/5 border-white/20 shadow-lg text-white font-semibold"
                      : "bg-black/40 border-white/5 hover:bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={teacher.avatarUrl} 
                      alt="" 
                      className="w-9 h-9 rounded-full bg-black/40 border border-white/10" 
                    />
                    <div>
                      <span className="block text-xs font-bold text-white/90">{teacher.name}</span>
                      <span className="block text-[10px] text-white/40">{teacher.skills.slice(0, 3).join(" • ")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-white/30">
                      {teacher.subscribersCount} مشترك
                    </span>
                    {currentUser.role === "student" && hasSubscribed && (
                      <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md border border-blue-500/20">
                        مشترك ✓
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informational rules card (Strict Subscription Policy Showcase) */}
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <BellRing className="w-4 h-4" />
            <h4 className="text-xs font-bold">قوانين المتابعة الأكاديمية</h4>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            الطلاب لهم الأحقية الكاملة والوحيدة للاشتراك في قنوات المعلمين للحفظ والمتابعة. نظام المنصة يمنع المعلمين من الاشتراك في قنوات زملائهم أو الطلاب لضخامة البيانات التعليمية وحفظ الخصوصية المهنية.
          </p>
          <div className="mt-3 bg-black/40 p-2.5 rounded-lg border border-white/10 text-[10px] text-white/40 font-sans">
            🚫 الدور الحالي المحفوظ لك: <span className="font-bold text-white/80">{currentUser.role === "teacher" ? "معلم (ليس له أحقية اشتراك)" : "طالب (يقدر يشترك)"}</span>
          </div>
        </div>
      </div>

      {/* Main Focus Panel: Active Teacher Channel Posts Feed */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="channel-posts-panel">
        
        {activeTeacher ? (
          <>
            {/* Teacher Details Banner */}
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-right">
                  <img 
                    src={activeTeacher.avatarUrl} 
                    alt={activeTeacher.name} 
                    className="w-16 h-16 rounded-full border-2 border-blue-500 bg-black/40" 
                  />
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-lg font-bold text-white">{activeTeacher.name}</h2>
                      <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2 py-0.5 rounded border border-blue-500/30">
                        معلم معتمد 🏆
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-1 max-w-sm">{activeTeacher.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                      {activeTeacher.skills.map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-black/40 text-white/50 rounded text-[9px] font-mono border border-white/5">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subscription Action Button based on context rules */}
                <div className="sm:text-left flex flex-col items-center sm:items-end gap-1.5">
                  <span className="text-xs text-white/40">{activeTeacher.subscribersCount} مشترك في المجرى</span>
                  
                  {currentUser.role === "student" ? (
                    isSubscribedToActive ? (
                      <button
                        onClick={() => onUnsubscribe(activeTeacher.id)}
                        id="btn-unsubscribe"
                        className="px-4 py-2 bg-rose-500/15 text-rose-400 hover:bg-rose-500 hover:text-slate-950 border border-rose-500/30 hover:border-rose-500 font-extrabold rounded-xl text-xs transition-all"
                      >
                        إلغاء الاشتراك بالقناة
                      </button>
                    ) : (
                      <button
                        onClick={() => onSubscribe(activeTeacher.id)}
                        id="btn-subscribe"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg"
                      >
                        الاشتراك ومتابعة القناة 🚀
                      </button>
                    )
                  ) : (
                    <div className="p-2 py-1.5 bg-[#0D0D0D] text-[10px] text-white/30 border border-white/10 rounded-lg text-center font-sans">
                      {currentUser.id === activeTeacher.id ? (
                        <span className="text-blue-400">هذه هي قناتك الخاصة! يمكنك إثراؤها 👇</span>
                      ) : (
                        "قفل الاشتراك (خاص بالمعلمين)"
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Post updates inside the channel (ONLY shown to teachers for their own channel, to fill material) */}
            {currentUser.role === "teacher" && currentUser.id === activeTeacher.id && (
              <div className="bg-[#0D0D0D]/90 border border-white/10 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xs font-bold text-white uppercase">بث محتوى مرئي أو موضوع تدريبي جديد</h3>
                </div>

                <form onSubmit={handlePostToChannel} className="flex flex-col gap-3">
                  <input
                    type="text"
                    id="channel-post-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#1A1B1E] text-white rounded-xl p-3 text-xs placeholder-white/20 outline-none border border-white/10 focus:border-blue-500/40"
                    placeholder="عنوان الدرس أو الشرح البرمجي..."
                    required
                  />

                  <textarea
                    id="channel-post-content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-[#1A1B1E] text-white rounded-xl p-3 text-xs placeholder-white/20 outline-none border border-white/10 focus:border-blue-500/40 min-h-[80px]"
                    placeholder="ادخل الأفكار، الخطوات الأكاديمية، أو المراجعات التمكينية..."
                    required
                  />

                  {/* Add code to exclusive article */}
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/10">
                    <button
                      type="button"
                      id="toggle-channel-code"
                      onClick={() => setShowCodeInput(!showCodeInput)}
                      className={`text-xs px-2.5 py-1 rounded font-bold transition-all ${
                        showCodeInput ? "bg-blue-500/20 text-blue-400" : "text-white/40 hover:text-white"
                      }`}
                    >
                      💡 ملحق كود برمجي كمرجع للمشتركين
                    </button>

                    {showCodeInput && (
                      <select
                        id="channel-code-lang"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        className="bg-[#1A1B1E] text-[10px] text-white/80 rounded border border-[#0D0D0D] px-2 py-0.5 focus:outline-none"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="react">React JSX</option>
                      </select>
                    )}
                  </div>

                  {showCodeInput && (
                    <textarea
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full bg-[#1A1B1E] text-blue-300 p-3 rounded-lg border border-white/10 font-mono text-[11px] h-24"
                      placeholder="// اكتب الكود السليم والمرتب هنا لطلبتك لنسخه..."
                      dir="ltr"
                    />
                  )}

                  <button
                    type="submit"
                    id="btn-add-channel-post"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded self-end transition-all flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3 h-3" />
                    <span>نشر التعميم لقناتك</span>
                  </button>
                </form>
              </div>
            )}

            {/* List of active teacher posts */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-blue-400" />
                <span>إصدارات القناة وبث الشروحات ({activeTeacherUpdates.length})</span>
              </h3>

              {/* Strict access check: if user is Student and they are NOT subscribed */}
              {currentUser.role === "student" && !isSubscribedToActive ? (
                <div 
                  id="lock-channel-screen"
                  className="bg-black/40 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-4 shadow-xl"
                >
                  <div className="p-4 bg-blue-500/5 rounded-full text-blue-400 border border-blue-500/10">
                    <BellRing className="w-8 h-8 animate-bounce" />
                  </div>
                  <h4 className="text-base font-bold text-white/95">هذه القناة مغلقة حالياً للمشاهدة</h4>
                  <p className="text-xs text-white/40 max-w-md mx-auto leading-relaxed">
                    محتويات هذه القناة مخصصة للطلاب المشتركين والمدعومين من المعلم {activeTeacher.name}. اضغط على زر <strong>"الاشتراك ومتابعة القناة"</strong> بالأعلى للاطلاع الفوري ومتابعة الأكواد المصاحبة والمشاريع!
                  </p>
                  <button
                    onClick={() => onSubscribe(activeTeacher.id)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs shadow-md transition-all"
                  >
                    أريد الاشتراك مجاناً الآن
                  </button>
                </div>
              ) : (
                /* Access granted to subscribed student, or to teachers themselves, etc. */
                activeTeacherUpdates.length === 0 ? (
                  <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-8 text-center text-white/40">
                    <Sparkles className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-xs font-bold">لم يقم المعلم بنشر أي مادة تعليمية بداخل مجرى القناة بعد.</p>
                  </div>
                ) : (
                  activeTeacherUpdates.map(pub => (
                    <div 
                      key={pub.id}
                      id={`channel-pub-${pub.id}`}
                      className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-3.5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-2">
                        <span className="text-sm font-bold text-white/95">{pub.title}</span>
                        <span className="text-[10px] text-white/30 font-mono">
                          {new Date(pub.createdAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                        {pub.content}
                      </p>

                      {pub.codeSnippet && (
                        <div className="bg-black/40 font-mono rounded-xl p-3.5 border border-white/10">
                          <div className="flex items-center justify-between mb-2 text-[10px] text-white/40">
                            <span>الرمز المصاحب للشرح:</span>
                            <span className="uppercase text-white/30">{pub.codeSnippet.language}</span>
                          </div>
                          <pre className="text-xs text-blue-300 overflow-x-auto leading-relaxed text-right" dir="ltr">
                            <code>{pub.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
          </>
        ) : (
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-10 text-center text-white/40">
            <h2 className="text-sm font-bold">لم يتم تسجيل أي معلمين في المنصة بعد.</h2>
          </div>
        )}
      </div>
    </div>
  );
}
