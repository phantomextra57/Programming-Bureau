import { User, Post, TeacherChannelPost } from "./types";

export const MOCK_USERS: User[] = [
  // Teachers
  {
    id: "teacher_1",
    name: "م. أحمد حسام",
    username: "ahmed_frontend",
    role: "teacher",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=ahmed",
    bio: "مطور واجهات أمامية خبير ومحاضر يوتيوب. شغوف بتبسيط مفاهيم React و Tailwind CSS للطلاب العرب.",
    skills: ["HTML", "CSS", "TypeScript", "React", "Next.js"],
    subscribersCount: 1420,
    subscribedTeachers: [],
    solvedErrorsCount: 45,
  },
  {
    id: "teacher_2",
    name: "د. سارة الرويلي",
    username: "Dr_Sara_Python",
    role: "teacher",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=sara",
    bio: "أستاذة جامعية ومطورة بايثون متخصصة في الذكاء الاصطناعي وبناء الأنظمة الخلفية عبر FastAPI و Django.",
    skills: ["Python", "FastAPI", "SQL", "Pandas", "PyTorch"],
    subscribersCount: 2150,
    subscribedTeachers: [],
    solvedErrorsCount: 62,
  },
  {
    id: "teacher_3",
    name: "م. طارق العتوم",
    username: "tariq_fullstack",
    role: "teacher",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=tariq",
    bio: "مهندس برمجيات يعشق Node.js وهندسة نظم الويب الموزعة. يشارك خبرته العملية مع جيل المستقبل.",
    skills: ["JavaScript", "Node.js", "Express", "PostgreSQL", "Docker"],
    subscribersCount: 890,
    subscribedTeachers: [],
    solvedErrorsCount: 29,
  },

  // Students
  {
    id: "student_1",
    name: "عمر خالد",
    username: "omar_dev",
    role: "student",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=omar",
    bio: "طالب هندسة حاسبات مبتدئ في عالم الويب. أطمح أن أكون مطور واجهات متكامل (Full-Stack).",
    skills: ["HTML", "CSS", "JavaScript"],
    subscribersCount: 0,
    subscribedTeachers: ["teacher_1", "teacher_3"],
    completedChallenges: 12,
  },
  {
    id: "student_2",
    name: "منى العتيبي",
    username: "mouna_coding",
    role: "student",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=mouna",
    bio: "طالبة علوم حاسب تدرس بايثون وعلم البيانات. أبحث دائماً عن حلول تزيد من كفاءة الأكواد.",
    skills: ["Python", "SQL"],
    subscribersCount: 0,
    subscribedTeachers: ["teacher_2"],
    completedChallenges: 8,
  },
  {
    id: "student_3",
    name: "يوسف الصقر",
    username: "youssef_web",
    role: "student",
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=youssef",
    bio: "مبرمج هاوٍ أصمم مواقع شخصية لزملائي وأرغب بتعلم تيكنولوجيا الهواتف قريباً.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    subscribersCount: 0,
    subscribedTeachers: ["teacher_1"],
    completedChallenges: 4,
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: "post_1",
    authorId: "student_1",
    authorName: "عمر خالد",
    authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=omar",
    authorRole: "student",
    content: "يا جماعة عندي مشكلة غريبة في React. الـ useEffect بتدخل في Loop لانهائي وبتعلق المتصفح عندي، اللوب بيستمر بالدوران وما عرفت وين المشكلة! هذا هو الكود المسبب للمشكلة، أحد يعرف يفيدنا ويعلمنا طريقة الحل؟ شكرًا لكم.",
    type: "error",
    language: "React",
    codeSnippet: {
      filename: "App.tsx",
      language: "javascript",
      code: `import React, { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // جلب البيانات وتحديث الحالة مباشرة
    fetch("https://api.github.com/users/octocat")
      .then(res => res.json())
      .then(result => {
        setData(result);
      });
  }); // <-- هنا الكود المريب

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">اسم المستخدم: {data.name}</h1>
    </div>
  );
}`
    },
    likes: ["student_2", "teacher_2"],
    isSolved: true,
    solvedByCommentId: "comment_1_1",
    createdAt: "2026-06-22T12:00:00Z",
    comments: [
      {
        id: "comment_1_1",
        postId: "post_1",
        authorId: "teacher_1",
        authorName: "م. أحمد حسام",
        authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=ahmed",
        authorRole: "teacher",
        content: "أهلاً بك يا عمر. المشكلة بسيطة جدًا ومشهورة: أنت لم تقم بتحديد 'مصفوفة التبعيات' (Dependency Array) في نهاية الدالة useEffect. بدون هذه المصفوفة، ستعمل الدالة عند كل إعادة رندر (Re-render). ولأنك تقوم بتغيير الـ state بداخلها عبر setData، فإنها تتسبب برندر جديد ثم تشتغل useEffect من جديد وهكذا دواليك. \n\nالحل هو إضافة مصفوفة فارغة `[]` كوسيط ثانٍ للدالة لتعمل مرة واحدة فقط عند تحميل المكون.",
        codeSnippet: {
          language: "javascript",
          code: `// تعديل الـ useEffect بالشكل التالي لتجنب اللوب اللانهائي:
useEffect(() => {
  fetch("https://api.github.com/users/octocat")
    .then(res => res.json())
    .then(result => {
      setData(result);
    });
}, []); // <-- المصفوفة الفارغة تمنع التكرار`
        },
        isSolution: true,
        likes: ["student_1", "student_2", "student_3"],
        createdAt: "2026-06-22T13:15:00Z"
      },
      {
        id: "comment_1_2",
        postId: "post_1",
        authorId: "student_3",
        authorName: "يوسف الصقر",
        authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=youssef",
        authorRole: "student",
        content: "شرح رائع جدًا يا باشمهندس أحمد! نفس الخطأ صار معي الأسبوع الماضي وجلست يومين أبحث عنه هههههه.",
        likes: ["teacher_1"],
        createdAt: "2026-06-22T14:02:00Z"
      }
    ]
  },
  {
    id: "post_2",
    authorId: "student_2",
    authorName: "منى العتيبي",
    authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=mouna",
    authorRole: "student",
    content: "السلام عليكم، بكتب كود بسيط في بايثون لترتيب الأرقام واستخراج العناصر، بس بيظهر لي خطأ IndexError: list index out of range. مع أني متأكدة من أن حجم المصفوفة صحيح، وين الخلل بالضبط؟",
    type: "error",
    language: "Python",
    codeSnippet: {
      filename: "process_scores.py",
      language: "python",
      code: `scores = [85, 92, 78, 90, 88]

# أريد طباعة النتيجة الأخيرة في القائمة
for i in range(1, len(scores) + 1):
    print(f"العنصر رقم {i}: {scores[i]}")`
    },
    likes: ["student_1"],
    isSolved: false,
    createdAt: "2026-06-22T15:30:00Z",
    comments: [
      {
        id: "comment_2_1",
        postId: "post_2",
        authorId: "teacher_2",
        authorName: "د. سارة الرويلي",
        authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=sara",
        authorRole: "teacher",
        content: "وعليكم السلام يا منى. المشكلة تكمن في قيم المقياس (indexes) لبرمجة القوائم في بايثون:\n1. القوائم تبدأ من الرمز الصفر `0` وتنتهي عند الرمز `len(scores) - 1`.\n2. التكرار الخاص بك يبدأ من `1` وحتى `len(scores)` (بسبب إضافة 1).\n3. عندما يحاول الكود قراءة `scores[len(scores)]` (أي scores[5])، لا يجد أي عنصر بهذا الرمز لأن آخر عنصر رمزه 4، فيظهر لك الخطأ.\n\nتعديل التكرار ليمشي تلقائياً من 0 لآخر عنصر سيحل المشكلة.",
        codeSnippet: {
          language: "python",
          code: `# الكود الصحيح:
scores = [85, 92, 78, 90, 88]

# نكرر بناء على طول المصفوفة بشكل مباشر (من 0 إلى 4)
for i in range(len(scores)):
    print(f"العنصر رقم {i + 1}: {scores[i]}")`
        },
        likes: ["student_2"],
        createdAt: "2026-06-22T16:10:00Z"
      }
    ]
  },
  {
    id: "post_3",
    authorId: "teacher_2",
    authorName: "د. سارة الرويلي",
    authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=sara",
    authorRole: "teacher",
    content: "نصيحة مهمة لجميع الطلاب: عند بناء واجهات تطبيقات برمجية خلفية (APIs) باستخدام FastAPI، احرص على استخدام Async بشكل صحيح. لا تستخدم async def إلا إذا كانت الدوال بداخلها تدعم العمل اللامتزامن (awaitable)، وإلا فاستخدم def العادية لأن النواة ستقوم بتشغيلها بتوزع مسارات المعالجة (ThreadPool).",
    type: "tutorial",
    language: "Python",
    likes: ["teacher_1", "student_1", "student_2"],
    comments: [
      {
        id: "comment_3_1",
        postId: "post_3",
        authorId: "student_2",
        authorName: "منى العتيبي",
        authorAvatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=mouna",
        authorRole: "student",
        content: "معلومة ذهبية وقيمة جدًا يا دكتورة. كنت دائمًا أضع async def على كل دالة بشكل عشوائي دون فهم!",
        likes: [],
        createdAt: "2026-06-22T17:45:00Z"
      }
    ],
    createdAt: "2026-06-22T10:15:00Z"
  }
];

export const MOCK_CHANNELS_POSTS: TeacherChannelPost[] = [
  {
    id: "chan_1",
    teacherId: "teacher_1",
    title: "مفهوم الـ Virtual DOM بطريقة واقعية",
    content: "أهلاً بطلابي الأعزاء ومتابعي قناتي الخاصة. اليوم أريد شرح الـ Virtual DOM بطريقة مبسطة. تخيل أنك تريد إعادة دهان جدار واحد فقط في غرفتك. هل ستقوم بهدم الغرفة بالكامل وإعادة بنائها؟! بالطبع لا.\n\nهذا هو بالضبط ما تفعله React بالـ Virtual DOM. تبحث عن التطابق (diffing) وتحدّث فقط العنصر الذي تغير فعلاً بدلاً من تحديث الصفحة كاملة (Real DOM) والذي يعتبر عملية ثقيلة ومحبطة لأداء الموقع.",
    codeSnippet: {
      language: "javascript",
      code: `// في React، التحديث موجه ومحدد
const element = <h1>أنا فقط سأتغير في شجرة الصفحة!</h1>;`
    },
    createdAt: "2026-06-22T09:00:00Z"
  },
  {
    id: "chan_2",
    teacherId: "teacher_2",
    title: "شرح التعامل مع مكتبات استدعاء الخرائط الجغرافية",
    content: "مرحباً طلاب الذكاء الجغرافي وبايثون. قمت برفع كود مصغر لقراءة الخرائط التفاعلية ورسم البيانات عليها باستخدام مكتبة Folium وسنتناقش فيها اليوم في الساعات المكتبية المخصصة للمشتركين فقط.",
    codeSnippet: {
      language: "python",
      code: `import folium

# ننشئ خريطة جغرافية ممركزة على الرياض
m = folium.Map(location=[24.7136, 46.6753], zoom_start=12)
m.save("riyadh_map.html")`
    },
    createdAt: "2026-06-21T18:30:00Z"
  }
];
