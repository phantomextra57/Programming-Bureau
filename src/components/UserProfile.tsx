import React, { useState, useEffect } from "react";
import {
  Settings,
  Award,
  Users,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { User, UserRole } from "../types";

interface UserProfileProps {
  currentUser: User;
  onCreateProfile: (name: string, username: string, role: UserRole, bio: string, skills: string[]) => void;
  onUpdateUserProfile?: (avatarUrl: string, bannerUrl: string) => Promise<void>;
}

const SKILL_OPTIONS = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Python", "FastAPI", "Node.js", "Express", "SQL", "Tailwind CSS", "Git"];

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

export default function UserProfile({
  currentUser,
  onCreateProfile,
  onUpdateUserProfile
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Edit form state
  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regRole, setRegRole] = useState<UserRole>("student");
  const [regBio, setRegBio] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [isSavingMedia, setIsSavingMedia] = useState<boolean>(false);

  useEffect(() => {
    if (isEditing && currentUser) {
      setRegName(currentUser.name || "");
      setRegUsername(currentUser.username || "");
      setRegRole(currentUser.role || "student");
      setRegBio(currentUser.bio || "");
      setSelectedSkills(currentUser.skills || []);
      setAvatarUrl(currentUser.avatarUrl || "");
      setBannerUrl(currentUser.bannerUrl || DEFAULT_BANNER);
    }
  }, [isEditing, currentUser]);

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regUsername.trim() || !regBio.trim()) return;

    onCreateProfile(regName, regUsername, regRole, regBio, selectedSkills);

    if (onUpdateUserProfile && (avatarUrl !== currentUser.avatarUrl || bannerUrl !== currentUser.bannerUrl)) {
      try {
        setIsSavingMedia(true);
        await onUpdateUserProfile(avatarUrl || currentUser.avatarUrl, bannerUrl || DEFAULT_BANNER);
      } finally {
        setIsSavingMedia(false);
      }
    }

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto" id="user-profile">
        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-2">📝 تعديل الملف الشخصي وبيانات البرمجة الخاصة بك</h2>
          <p className="text-xs text-white/40 mb-5">احرص على ملء النبذة وتحديد التقنيات واللغات التي تتقنها لتسهيل تواصل المجتمع والمشرفين معك!</p>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/40 mb-1">صورة الملف الشخصي (رابط):</label>
                <div className="flex items-center gap-3">
                  <img src={avatarUrl || currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full border border-white/10 bg-black/40 shrink-0" />
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/40 mb-1">صورة الغلاف / البانر (رابط):</label>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-white/10 bg-black/40 shrink-0 overflow-hidden flex items-center justify-center">
                    {bannerUrl ? (
                      <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full bg-[#1A1B1E] text-white rounded-lg p-2.5 text-xs border border-white/10 focus:border-blue-500/40 focus:outline-none font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

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

            {/* Role Selection */}
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
                  <span className="text-[10px] text-white/40">يمكنك الاشتراك بقنوات المعلمين، نشر شيفرات للأخطاء وحل المشاكل</span>
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
                  <span className="text-[10px] text-white/40">صلاحية بث المحاضرات والكود، تفضيل وحث الأجوبة السليمة بالأخطاء</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 mb-1">المكوّن والنبذة التعريفية (Bio):</label>
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
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-black/40 border border-white/10 text-white/60 rounded text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                id="btn-submit-register"
                disabled={isSavingMedia}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold rounded text-xs"
              >
                {isSavingMedia ? "جاري الحفظ..." : "حفظ بيانات البروفايل ⚡"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" id="user-profile">
      <div className="bg-[#151515] border border-white/10 rounded-2xl shadow-xl relative overflow-hidden">
        {/* Banner */}
        <div className="relative h-40 sm:h-48 w-full bg-black/40">
          <img
            src={currentUser.bannerUrl || DEFAULT_BANNER}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/10 to-transparent" />

          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-lg border border-white/15 text-xs transition-all duration-200"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span>تعديل بيانات بروفايلك</span>
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar overlapping the banner */}
          <div className="-mt-12 flex items-end gap-4">
            <img
              src={currentUser.avatarUrl}
              alt=""
              className="w-24 h-24 rounded-full border-4 border-[#151515] shadow-md bg-black/40"
            />
          </div>

          {/* Name & role */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide font-sans ${
              currentUser.role === "teacher"
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}>
              {currentUser.role === "teacher" ? "معلم معتمد" : "عضو مبرمج طالب"}
            </span>
          </div>
          <p className="text-xs text-white/30 font-mono mt-1">@{currentUser.username}</p>
          <p className="text-xs text-white/60 mt-2.5 max-w-xl font-sans leading-relaxed">
            {currentUser.bio}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
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

          {/* Skills */}
          <div className="border-t border-white/5 pt-5">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wide mb-2.5">
              🏷️ حقيبة المهارات واللغات التقنية
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.skills.length === 0 ? (
                <span className="text-xs text-white/30 italic flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  لا توجد مهارات مفضلة مدخلة بعد في البروفايل.
                </span>
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
      </div>
    </div>
  );
}
