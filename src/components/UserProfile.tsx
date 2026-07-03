import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Settings, 
  BookOpen, 
  Award, 
  Check, 
  Layers, 
  PlusCircle, 
  Users, 
  Sparkles,
  RefreshCw,
  LogOut,
  ChevronLeft,
  Trash2
} from "lucide-react";
import { User, UserRole } from "../types";

interface UserProfileProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  onCreateProfile: (name: string, username: string, role: UserRole, bio: string, skills: string[]) => void;
  onUpdateUserProfile?: (avatarUrl: string, bannerUrl: string) => Promise<void>;
  onResetDatabase?: () => Promise<void>;
}

const SKILL_OPTIONS = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Python", "FastAPI", "Node.js", "Express", "SQL", "Tailwind CSS", "Git"];

export default function UserProfile({
  currentUser,
  allUsers,
  onSwitchUser,
  onCreateProfile,
  onUpdateUserProfile,
  onResetDatabase
}: UserProfileProps) {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  
  // Registration States
  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regRole, setRegRole] = useState<UserRole>("student");
  const [regBio, setRegBio] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    if (isCreating && currentUser) {
      setRegName(currentUser.name || "");
      setRegUsername(currentUser.username || "");
      setRegRole(currentUser.role || "student");
      setRegBio(currentUser.bio || "");
      setSelectedSkills(currentUser.skills || []);
    }
  }, [isCreating, currentUser]);

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regBio.trim()) return;

    onCreateProfile(
      regName,
      regUsername,
      regRole,
      regBio,
      selectedSkills
    );

    // Reset Form
    setRegName("");
    setRegUsername("");
    setRegRole("student");
    setRegBio("");
    setSelectedSkills([]);
    setIsCreating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="user-profile">
      
      {/* Simulation Persona Control Center */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase">لوحة محاكاة الأعضاء</h3>
            </div>
            
            <button
              id="switch-to-create-btn"
              onClick={() => setIsCreating(!isCreating)}
              className="text-[10px] px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded transition-all"
            >
              {isCreating ? "عرض الحسابات" : "+ حساب جديد"}
            </button>
          </div>

          {!isCreating ? (
            <div className="flex flex-col gap-2">
              <p className="text-[11px] text-white/40 mb-2 leading-relaxed">
                اضغط على أي مستخدم أدناه لتقوم بتمثيله بالكامل في المنصة. يمكنك تجربة كتابة كود برأسه، والاشتراك بالمعلمين إذا كنت طالباً، أو الرد وحل مشاكل زملائك بالمنتدى:
              </p>

              {allUsers.map(u => {
                const isActive = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    id={`simulation-user-btn-${u.id}`}
                    onClick={() => onSwitchUser(u.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-right transition-all border ${
                      isActive 
                        ? "bg-white/5 border-blue-500/40 text-blue-400 font-semibold"
                        : "bg-black/40 border-white/5 text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-black/40" />
                      <div>
                        <span className="block text-xs font-bold text-white/90">{u.name}</span>
                        <span className="block text-[9px] text-white/30">@{u.username}</span>
                      </div>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded font-sans font-semibold ${
                      u.role === "teacher" 
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {u.role === "teacher" ? "معلم" : "طالب"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-2 border border-dashed border-white/10 rounded-xl bg-black/40 text-center">
              <Sparkles className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-white/40">تابع ملء استمارة تسجيل العضو بيمين الصفحة لتوليد شخصية المبرمج المخصصة!</p>
            </div>
          )}
        </div>

        {/* Admin/Developer Tools Center */}
        {onResetDatabase && (
          <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5 shadow-xl mt-4">
            <div className="flex items-center gap-2 mb-3 border-b border-red-500/10 pb-2">
              <Settings className="w-4 h-4 text-red-400 animate-spin" style={{ animationDuration: "6s" }} />
              <h3 className="text-xs font-bold text-red-400 uppercase">لوحة التحكم والمطور</h3>
            </div>
            <p className="text-[11px] text-white/50 mb-4 leading-relaxed">
              بصفتك مطور المنصة، يمكنك تصفير قاعدة بيانات Firestore بالكامل وحذف كافة الأعضاء والمشاركات لتهيئة المنصة ببيانات حقيقية جديدة:
            </p>
            <button
              id="admin-reset-db-btn"
              onClick={async () => {
                if (window.confirm("⚠️ هل أنت متأكد تماماً من رغبتك في حذف كافة بيانات المستخدمين، المنشورات، القنوات، والإشعارات؟ هذا الإجراء لا يمكن التراجع عنه وسيتم إعادة تعيين قاعدة البيانات كأنها جديدة!")) {
                  try {
                    await onResetDatabase();
                    alert("✅ تم تصفير وإعادة تهيئة قاعدة البيانات بنجاح!");
                  } catch (e: any) {
                    alert(`❌ فشل تصفير قاعدة البيانات: ${e.message || e}`);
                  }
                }
              }}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              تصفير وإعادة تعيين المنصة ⚡
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Showcase Or Form block */}
      <div className="lg:col-span-8">
        {isCreating ? (
          /* Create Profile Form */
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white mb-2">📝 تعديل الملف الشخصي وبيانات البرمجة الخاصة بك</h2>
            <p className="text-xs text-white/40 mb-5">احرص على ملء النبذة وتحديد التقنيات واللغات التي تتقنها لتسهيل تواصل المجتمع والمشرفين معك!</p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-white/40 mb-1">الاسم الكامل:</label>
                  <input
                    type="text"
                    id="register-name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none"
                    placeholder="مثال: م. فهد الشمري"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/40 mb-1">اسم المستخدم (المعرف الفريد):</label>
                  <input
                    type="text"
                    id="register-username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none"
                    placeholder="مثال: fahad_dev"
                  />
                </div>
              </div>

              {/* Role Selection Option is HERE (معلم أو طالب) */}
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1.5">اختر دور العضوية ومستوى الصلاحية:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="role-option-student"
                    onClick={() => setRegRole("student")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      regRole === "student"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        : "bg-black/40 border-white/10 text-white/60 hover:bg-neutral-900"
                    }`}
                  >
                    <span className="text-xl">💻</span>
                    <span className="text-xs font-bold block text-white/90">طالب مبرمج (Student)</span>
                    <span className="text-[10px] text-white/40 blocker">يمكنك الاشتراك بقنوات المعلمين، نشر شيفرات للأخطاء وحل المشاكل</span>
                  </button>

                  <button
                    type="button"
                    id="role-option-teacher"
                    onClick={() => setRegRole("teacher")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                      regRole === "teacher"
                        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                        : "bg-black/40 border-white/10 text-white/60 hover:bg-neutral-900"
                    }`}
                  >
                    <span className="text-xl">🎓</span>
                    <span className="text-xs font-bold block text-white/90">معلم مبرمج (Teacher)</span>
                    <span className="text-[10px] text-white/40 blocker">صلاحية بث المحاضرات والكود، تفضيل وحث الأجوبة السليمة بالأخطاء</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 mb-1">المكّون والنبذة التعريفية (Bio):</label>
                <textarea
                  id="register-bio"
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none leading-relaxed"
                  placeholder="حدثنا عن مجالك، لغاتك المحبوبة وتطلعاتك المهنية بالمنصة..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 mb-2">لغات البرمجة والمهارات المرافقة:</label>
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

              <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  id="btn-cancel-register"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-black/40 border border-white/10 text-white/60 rounded text-xs"
                >
                  إلغاء الاستمارة
                </button>
                <button
                  type="submit"
                  id="btn-submit-register"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded text-xs"
                >
                  حفظ وتعديل بيانات بروفايلك البرمجي ⚡
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Profile Details Card Layout */
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-44 h-44 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Profile Header Block */}
            <div className="flex flex-col md:flex-row items-center gap-5 pb-5 border-b border-white/10">
              <img 
                src={currentUser.avatarUrl} 
                alt="" 
                className="w-20 h-20 rounded-full border border-white/15 shadow-md bg-black/40" 
              />
              <div className="flex-1 text-center md:text-right w-full">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide font-sans ${
                      currentUser.role === "teacher" 
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {currentUser.role === "teacher" ? "معلم معتمد" : "عضو مبرمج طالب"}
                    </span>
                  </div>

                  <button 
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 text-xs transition-all duration-200"
                  >
                    <Settings className="w-3.5 h-3.5 text-blue-400" />
                    <span>تعديل بيانات بروفايلك</span>
                  </button>
                </div>
                <p className="text-xs text-white/30 font-mono mt-1.5">@{currentUser.username}</p>
                <p className="text-xs text-white/60 mt-2 max-w-xl font-sans leading-relaxed">
                  {currentUser.bio}
                </p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 pt-2">
              <div className="bg-black/40 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-white/40 text-[11px] block">
                    {currentUser.role === "teacher" ? "الطلبة المتابعون لك:" : "المعلمون المتابعون:"}
                  </span>
                  <span className="text-md font-bold text-white/95 mt-1 block">
                    {currentUser.role === "teacher" 
                      ? `${currentUser.subscribersCount} طالب برمجياً`
                      : `${currentUser.subscribedTeachers.length} معلم`}
                  </span>
                </div>
                <Users className="w-5 h-5 text-blue-500/70" />
              </div>

              <div className="bg-black/40 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-white/40 text-[11px] block">مستوى الإنجاز البرمجي:</span>
                  <span className="text-md font-bold text-white/95 mt-1 block">
                    {currentUser.role === "teacher" 
                      ? `${currentUser.solvedErrorsCount || 0} خطأ معالجاً`
                      : `${currentUser.completedChallenges || 0} تمرين مكتمل`}
                  </span>
                </div>
                <Award className="w-5 h-5 text-blue-500/70" />
              </div>
            </div>

            {/* Skills & badges showcase */}
            <div className="border-b border-white/5 pb-5 mb-5">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-wide mb-2.5">
                🏷️ حقيبة المهارات واللغات التقنية
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.skills.length === 0 ? (
                  <span className="text-xs text-white/30 italic">لا توجد مهارات مفضلة مدخلة بعد في البروفايل.</span>
                ) : (
                  currentUser.skills.map(skill => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 bg-[#1A1B1E] border border-white/10 text-white/80 rounded text-xs font-mono"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
