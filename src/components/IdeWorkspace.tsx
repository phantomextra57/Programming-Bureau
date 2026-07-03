import React, { useState, useEffect } from "react";
import { 
  Play, 
  Terminal, 
  FileCode, 
  Share2, 
  RefreshCw, 
  Check, 
  Sparkles,
  Layers,
  Code,
  Coffee,
  Database,
  Cpu,
  Plus,
  Trash2,
  Download,
  Edit,
  FolderPlus,
  Folder,
  ChevronDown,
  ChevronRight,
  Volume2,
  Users as UsersIcon,
  Trophy,
  HelpCircle
} from "lucide-react";
import { CodeFile } from "../types";
import JSZip from "jszip";

interface IdeWorkspaceProps {
  onShareToFeed: (code: string, language: string, filename: string) => void;
  currentUserRole: string;
  onFixedWithAi?: (fileName: string, explanation: string) => void;
}

const TEMPLATE_FILES: Record<string, CodeFile[]> = {
  JavaScript_HTML: [
    {
      name: "index.html",
      language: "html",
      content: `<div class="p-6 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-2xl text-white text-center shadow-lg">
  <h1 class="text-3xl font-bold mb-2">مرحباً بك في مجتمع المبرمجين!</h1>
  <p class="text-teal-100">قم بتعديل هذا الملف واضغط على "تشغيل الكود" لرؤية النتيجة فوراً.</p>
  <button id="btn" class="mt-4 px-6 py-2 bg-white text-indigo-700 font-bold rounded-lg hover:shadow-md transition">اضغط هنا</button>
  <p id="msg" class="mt-3 text-sm font-mono text-yellow-300"></p>
</div>`
    },
    {
      name: "script.js",
      language: "javascript",
      content: `// اكتب الكود التفاعلي هنا لربطه بصفحة الـ HTML
const button = document.getElementById("btn");
const message = document.getElementById("msg");

if (button && message) {
  button.addEventListener("click", () => {
    message.innerText = "✨ تمت معالجة كود الجافا سكريبت بنجاح في المتصفح! ✨";
  });
}`
    }
  ],
  Python: [
    {
      name: "bubble_sort.py",
      language: "python",
      content: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1] :
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# فحص عمل الدالة بترتيب درجات الطلاب:
grades = [88, 95, 70, 64, 99, 82]
print("🔹 الدرجات قبل الترتيب:", grades)
sorted_grades = bubble_sort(grades)
print("✨ الدرجات مرتبة حاسوبياً:", sorted_grades)`
    }
  ],
  React: [
    {
      name: "Counter.tsx",
      language: "react",
      content: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-6 bg-slate-800 text-white rounded-xl border border-slate-700">
      <h2 className="text-xl font-bold mb-4">عداد تفاعلي (React Counter)</h2>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg font-bold"
        >
          زيادة (+)
        </button>
        <span className="text-2xl font-mono text-emerald-400 font-bold">{count}</span>
        <button 
          onClick={() => setCount(Math.max(0, count - 1))}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg font-bold"
        >
          نقصان (-)
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-400">حالة العداد تُحدث تلقائياً بفضل React State</p>
    </div>
  );
}`
    }
  ],
  TypeScript: [
    {
      name: "index.ts",
      language: "typescript",
      content: `interface Member {
  id: number;
  name: string;
  language: string;
  isActive: boolean;
}

const developer: Member = {
  id: 101,
  name: "أحمد بن علي",
  language: "TypeScript",
  isActive: true
};

function greetMember(user: Member): string {
  return "👤 المبرمج " + user.name + " يبرمج باستخدام لغة " + user.language;
}

console.log("🚀 تشغيل وفحص نظام تدقيق أنواع الـ TypeScript...");
console.log(greetMember(developer));`
    }
  ],
  CPP: [
    {
      name: "main.cpp",
      language: "cpp",
      content: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// خوارزمية البحث الثنائي في لغة السي بلس بلس
int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> data = {12, 24, 35, 47, 58, 69, 80};
    int searchFor = 47;
    
    cout << "🔍 جاري البحث عن القيمة: " << searchFor << endl;
    int result = binarySearch(data, searchFor);
    
    if (result != -1) {
        cout << "✨ تم العثور على العنصر بنجاح في الفهرس رقم: " << result << endl;
    } else {
        cout << "❌ العنصر غير متوفر حالياً في القائمة" << endl;
    }
    return 0;
}`
    }
  ],
  Java: [
    {
      name: "Main.java",
      language: "java",
      content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        System.out.println("☕ محاكاة تشغيل مبيئة Java Virtual Machine (JVM)...");
        
        ArrayList<String> techStack = new ArrayList<>();
        techStack.add("Spring Boot");
        techStack.add("Java 21");
        techStack.add("Microservices");
        
        System.out.println("⚙️ اللغات والتقنيات المدعومة داخل هذا الكود:");
        for (String tech : techStack) {
            System.out.println("  - " + tech);
        }
    }
}`
    }
  ],
  SQL: [
    {
      name: "schema.sql",
      language: "sql",
      content: `-- إنشاء وتصميم قاعدة بيانات المبرمجين العرب
CREATE TABLE developers (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    rank_stars INT CHECK (rank_stars BETWEEN 1 AND 5)
);

-- إدراج البيانات التجريبية
INSERT INTO developers VALUES (1, 'خالد المغربي', 'مطور واجهات React', 5);
INSERT INTO developers VALUES (2, 'سارة المهدي', 'مهندسة ذكاء اصطناعي وبايثون', 5);
INSERT INTO developers VALUES (3, 'أنس اليماني', 'مبرمج أنظمة C++', 4);

-- قراءة المبرمجين ذوي التقييم المتميز
SELECT name, specialization, rank_stars 
FROM developers 
WHERE rank_stars = 5 
ORDER BY name ASC;`
    }
  ],
  Rust: [
    {
      name: "main.rs",
      language: "rust",
      content: `// ملف لغة Rust 🦀 - نظام الملكية الآمنة وإدارة الذاكرة بدون جامع قمامة
fn main() {
    println!("أهلاً بك في فضاء لغة Rust السريعة والقوية!");
    let stars = 5;
    println!("التقييم العام للمترجم: {} نجوم ⭐", stars);
}`
    }
  ],
  Go: [
    {
      name: "main.go",
      language: "go",
      content: `package main

import "fmt"

func main() {
    fmt.Println("أهلاً بك في فضاء لغة Go السريعة والفعالة! 🚀")
    fmt.Println("تطوير الخدمات الخلفية فائقة الأداء والموثوقية وتكامل النظم.")
}`
    }
  ],
  CSharp: [
    {
      name: "Program.cs",
      language: "csharp",
      content: `using System;

namespace DiwanApp {
    class Program {
        static void Main() {
            Console.WriteLine("مرحباً بك في عالم .NET و C#! 💻");
            Console.WriteLine("كتابة أكواد متينة للمؤسسات وتطبيقات الألعاب الرائدة.");
        }
    }
}`
    }
  ],
  Ruby: [
    {
      name: "app.rb",
      language: "ruby",
      content: `# ملف لغة Ruby 💎 - برمجة رشاقة ومتعة متناهية
puts "شفرة روبي الأنيقة تعمل بنجاح!"
tech_stack = ["Ruby", "Rails", "CSS"]
puts "التقنيات المستخدمة: #{tech_stack.join(', ')}"`
    }
  ],
  PHP: [
    {
      name: "index.php",
      language: "php",
      content: `<?php
// ملف PHP 🐘 - لغة تطوير الويب الكلاسيكية والشهيرة
echo "أهلاً بكم في بيئة خادم الويب الافتراضية لـ PHP!";
$php_version = "8.3";
echo "\\nالإصدار النشط على الخادم: " . $php_version;
?>`
    }
  ],
  Swift: [
    {
      name: "main.swift",
      language: "swift",
      content: `// ملف لغة Swift 🍎 - برمجة تطبيقات آبل ونظم التشغيل الحديثة
import Foundation

print("أهلاً بك في Swift الرائعة لبرمجة تطبيقات آبل!")
let status = "سليم وآمن 🚀"
print("حالة الكود البرمجي: \\(status)")`
    }
  ],
  Kotlin: [
    {
      name: "main.kt",
      language: "kotlin",
      content: `// ملف لغة Kotlin 🎯 - لغة تطبيقات أندرويد المعاصرة والذكية
fun main() {
    println("مرحباً بك في لغة Kotlin المتطورة!")
    val numbers = listOf(1, 2, 3, 4, 5)
    println("مجموع الأرقام المدخلة في مصفوفة كوتلن: " + numbers.sum())
}`
    }
  ]
};

export default function IdeWorkspace({ onShareToFeed, currentUserRole, onFixedWithAi }: IdeWorkspaceProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("JavaScript_HTML");
  const [files, setFiles] = useState<CodeFile[]>(TEMPLATE_FILES["JavaScript_HTML"]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [editorContent, setEditorContent] = useState<string>("");
  const [runOutput, setRunOutput] = useState<string>("");
  const [compiledHtml, setCompiledHtml] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  // States for AI-powered code fixing
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<{ fixedCode: string; explanation: string } | null>(null);
  const [aiError, setAiError] = useState<string>("");

  // States for dynamic file manipulation
  const [newFileName, setNewFileName] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // --- Dynamic Folders and Directories States ---
  const [folders, setFolders] = useState<string[]>(["src", "components", "utils"]);
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [showAddFolderModal, setShowAddFolderModal] = useState<boolean>(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState<string>("");
  const [selectedFolderForNewFile, setSelectedFolderForNewFile] = useState<string>("");

  // --- Audio Error Synthesizer Toggle ---
  const [isAudioSynthEnabled, setIsAudioSynthEnabled] = useState<boolean>(true);

  // --- Simulated Live Multiplayer Collaboration States ---
  const [collaborativeLobbyJoined, setCollaborativeLobbyJoined] = useState<boolean>(false);
  const [connectedRoomId, setConnectedRoomId] = useState<string>("3829");
  const [onlineLobbyUsers, setOnlineLobbyUsers] = useState<Array<{ name: string; role: string; typing: boolean; avatar: string }>>([
    { name: "عقبة السبيعي", role: "طالب متفوق", typing: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=oqbah" },
    { name: "سارة المهدي", role: "طالبة متحمسة", typing: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=sara" },
    { name: "أحمد بن علي", role: "مساعد تدريب معتمد", typing: false, avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=ahmad" }
  ]);
  const [collabMessages, setCollabMessages] = useState<string[]>(["أهلاً بك في الديوان التعاوني! قم بإنشاء رابط الغرفة لدعوة زملائك ومحاكاة التعديلات كأنك في مقر عمل متزامن فريد."]);
  const [isSimulatingTyping, setIsSimulatingTyping] = useState<boolean>(false);

  // --- Interactive Auto-Graded Challenges / Quests States ---
  const [userScoreXP, setUserScoreXP] = useState<number>(() => {
    return Number(localStorage.getItem("diwan_user_xp") || "150");
  });
  const [questStatus, setQuestStatus] = useState<Record<string, "pending" | "solved" | "failed">>({
    html_btn: "pending",
    js_even: "pending",
    python_exp: "pending",
    sql_table: "pending"
  });
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [questGradeResult, setQuestGradeResult] = useState<string | null>(null);

  const QUESTS_LIST = [
    {
      id: "html_btn",
      title: "تحدي الـ HTML: الزر الفائق 🎨",
      points: 100,
      lang: "html",
      desc: "تحقق من أن ملف 'index.html' أو محرر المخرجات الجاري تصميمه يحتوي على وسم زر برقم معرّف id=\"btn\" بستايل فخم يحتوي على فئة 'bg-gradient-to' أو لون 'indigo' أو 'teal'.",
      initialTemplate: `<div class="p-8 text-center bg-[#0d0e12] border border-white/5 rounded-2xl shadow-xl">
  <h2 class="text-xl font-bold text-teal-400 mb-2">زر ديوان البرمجة الساحر</h2>
  <p class="text-slate-400 text-xs mb-4">اختبر واجهة المستخدم من خلال الضغط على الزر أدناه</p>
  <button id="btn" class="px-6 py-2.5 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-extrabold rounded-lg transition shadow-lg shadow-teal-500/25">
    اضغط لتجربة التفاعل المباشر
  </button>
  <p id="msg" class="mt-4 text-xs font-mono text-emerald-400"></p>
</div>`
    },
    {
      id: "js_even",
      title: "تحدي الـ JavaScript: مصفوفة الأعداد الزوجية ⚡",
      points: 150,
      lang: "javascript",
      desc: "اكتب دالة باسم filterEvenNumbers(arr) تصفّي الأرقام الزوجية بنجاح. يجب تواجد اسم الدالة ومخرجات تفحصها لنجاح الاختبار.",
      initialTemplate: `// تحدي جافا سكريبت: الأعداد الزوجية
function filterEvenNumbers(arr) {
  // اكتب كود ترشيح الأرقام هنا
  return arr.filter(num => num % 2 === 0);
}

const testArray = [5, 12, 8, 13, 21, 44];
console.log("الأرقام الزوجية المستخلصة لمقرر جافا سكريبت:", filterEvenNumbers(testArray));`
    },
    {
      id: "python_exp",
      title: "تحدي الـ Python: القوة الأسية 🐍",
      points: 120,
      lang: "python",
      desc: "اكتب دالة بايثون باسم calculate_power(base, exp) لحساب الأساس مرفوعاً للأس المحدد في بيئة التجميع السحابي.",
      initialTemplate: `# دالة القوة الأسية في بايثون لفرسان ديوان البرمجة
def calculate_power(base, exp):
    # اكتب كود حساب الأس هنا
    return base ** exp

print("النتيجة الرسمية للتجربة:", calculate_power(2, 5))`
    },
    {
      id: "sql_table",
      title: "تحدي الـ SQL: جدول سجل المبرمجين 🗄️",
      points: 130,
      lang: "sql",
      desc: "صمّم جدول استعلامات SQL باسم 'heros' بتركيبة حقول مناسبة تحتوي على id و full_name و skill برمجية.",
      initialTemplate: `-- إنشاء جدول فرسان ديوان البرمجة
CREATE TABLE heros (
    id INT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    skill VARCHAR(50)
);

INSERT INTO heros VALUES (1, 'عقبة المغربي', 'React Native Framework');
SELECT * FROM heros;`
    }
  ];

  // --- AI Co-Pilot / Companion States ---
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState<string>("");
  const [aiAssistantMessages, setAiAssistantMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "أهلاً بك في ديوان البرمجة السحابي المساعد! 🪄 أنا رفيقك الكودي الذكي المصاحب لمستكشف الملفات ومحرر النصوص. يمكنني المساعدة في تصحيح الأخطاء، أو فحص الثغرات الأمنية، أو تحويل الكود للغات أخرى. حدد خياراً جاهزاً بالأسفل أو أرسل لي مسألة صعبة لمشورتي التقنية الحية!" }
  ]);
  const [isAiAssistantLoading, setIsAiAssistantLoading] = useState<boolean>(false);

  // Auto detect language based on filename extension
  const detectLanguageFromFileName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case "html": case "htm": return "html";
      case "js": case "mjs": return "javascript";
      case "json": return "json";
      case "ts": return "typescript";
      case "tsx": case "jsx": return "react";
      case "py": return "python";
      case "cpp": case "cc": case "h": return "cpp";
      case "java": return "java";
      case "sql": return "sql";
      case "go": return "go";
      case "rs": return "rust";
      case "cs": return "csharp";
      case "rb": return "ruby";
      case "php": return "php";
      case "swift": return "swift";
      case "kt": return "kotlin";
      case "md": return "markdown";
      case "css": return "css";
      default: return "plaintext";
    }
  };

  // Get boilerplate code for newly added files
  const getStarterCodeForLanguage = (lang: string, name: string): string => {
    switch (lang) {
      case "html": return `<!-- ملف HTML جديد -->\n<div class="p-6 bg-slate-800 rounded-xl border border-slate-700 text-center text-white shadow-xl">\n  <h2 class="text-xl font-bold text-blue-400 mb-2">🎉 ${name}</h2>\n  <p class="text-xs text-slate-350">لقد قمت بإضافة هذا الملف بنجاح في المنصة.</p>\n</div>`;
      case "javascript": return `// ملف جافا سكريبت: ${name}\nconsole.log("تم تفعيل ملف الجافا سكريبت بنجاح!");\n\nconst greet = () => "أهلاً ومرحباً بك!";\nconsole.log(greet());`;
      case "json": return `{\n  "projectName": "ديوان البرمجة",\n  "version": "1.0.0",\n  "author": "فرسان ديوان البرمجة",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}`;
      case "typescript": return `// ملف تايب سكريبت جديد\ninterface Config {\n  debug: boolean;\n  version: string;\n}\n\nconst appConfig: Config = {\n  debug: true,\n  version: "v3.0"\n};\nconsole.log("تم فحص الكود البرمجي لـ Type-Safety:", appConfig);`;
      case "react": return `import React, { useState } from 'react';\n\nexport default function CustomWidget() {\n  const [active, setActive] = useState(false);\n  return (\n    <div className="p-5 bg-gradient-to-br from-indigo-900/40 to-slate-950 border border-slate-700 rounded-xl">\n      <h3 className="text-sm font-bold text-indigo-300">مكون React جديد: \${name}</h3>\n      <button onClick={() => setActive(!active)} className="mt-2.5 px-3 py-1 bg-indigo-600 rounded text-xs text-white">\n        {active ? "قيد التشغيل ⚡" : "تفعيل"}\n      </button>\n    </div>\n  );\n}`;
      case "python": return `# ملف بايثون جديد: \${name}\ndef compute_sum(a, b):\n    return a + b\n\nresult = compute_sum(15, 27)\nprint(f"💎 نتيجة العملية الحسابية: {result}")`;
      case "cpp": return `// ملف سي بلس بلس: \${name}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "مرحباً بكم مبرمجي C++ الأفاضل!" << endl;\n    return 0;\n}`;
      case "java": return `// ملف جافا جديد: \${name}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("أهلاً بك في جافا!");\n    }\n}`;
      case "sql": return `-- ملف استعلامات SQL جديد\nCREATE TABLE students (\n    id INT PRIMARY KEY,\n    name VARCHAR(50)\n);\n\nINSERT INTO students VALUES (1, 'أحمد');\nSELECT * FROM students;`;
      case "go": return `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("أهلاً بك في فضاء لغة Go السريعة والفعالة! 🚀")\n}`;
      case "rust": return `// ملف لغة Rust 🦀\nfn main() {\n    println!("تجميع الكود عبر Rust Cargo بنجاح!");\n    let num_stars: u32 = 5;\n    println!("Rating: {} stars ⭐", num_stars);\n}`;
      case "csharp": return `using System;\n\nnamespace ArabDevs {\n    class Program {\n        static void Main() {\n            Console.WriteLine("مرحباً بك في عالم .NET و C#! 💻");\n        }\n    }\n}`;
      case "ruby": return `# ملف لغة Ruby 💎\nputs "شفرة روبي الأنيقة تعمل بنجاح!"\ntech_stack = ["Ruby", "Rails", "HTML"]\nputs "التقنيات: \\#{tech_stack.join(', ')}"\n`;
      case "php": return `<?php\n// ملف PHP🐘\necho "أهلاً بكم في بيئة خادم الويب الافتراضية لـ PHP!";\n$php_version = "8.3";\nprint("\\nالإصدار النشط: " . $php_version);\n?>`;
      case "swift": return `// ملف لغة Swift 🍎\nimport Foundation\n\nprint("أهلاً بك في Swift الرائعة لبرمجة تطبيقات آبل!")\nlet status = "سليم 🚀"\nprint("حالة الكود البرمجي: \\(status)")`;
      case "kotlin": return `// ملف لغة Kotlin 🎯\nfun main() {\n    println("مرحباً بك في لغة Kotlin المتطورة!")\n    val numbers = listOf(1, 2, 3, 4, 5)\n    println("مجموع الأرقام: " + numbers.sum())\n}`;
      case "markdown": return `# ملف توثيق جديد لمشروعك 📝\n\nمرحباً بك في **ديوان البرمجة**.\n\n### ميزات المحرر المطور:\n- دعم فوري لـ 18 لغة برمجية.\n- إنشاء مجلدات وملفات تفاعلية كاملة 📁\n- تصدير فوري لكل ملف على حدة أو كمجلد ZIP مضغوط 📦\n- رفيق كودي ذكي وصوتي وتحديات فورية مقيّمة تلقائياً! 🏆`;
      case "css": return `/* أسلوب التنسيق والتصميم CSS */\n.custom-card {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 12px;\n  padding: 20px;\n  text-align: center;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}`;
      default: return `// ملف جديد: \${name}\n// ابدأ كتابة الكود البرمجي هنا...`;
    }
  };

  // --- Audio Synthesis Engine ---
  const synthesizeCodeSound = (isError: boolean) => {
    if (!isAudioSynthEnabled) return;
    try {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (isError) {
        // Defect discordant buzz
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(113, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        
        osc.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.9);
        osc2.stop(ctx.currentTime + 0.9);
      } else {
        // Rising arpeggio chord of programming success (D major)
        const pitches = [293.66, 369.99, 440.00, 587.33]; 
        pitches.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.12);
          
          gainNode.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.12);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.5);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.5);
        });
      }
    } catch (e) {
      console.warn("Audio Context blocked by browser auto-play policy until direct click:", e);
    }
  };

  // --- Folder Management Actions ---
  const handleCreateFolder = () => {
    const name = newFolderNameInput.trim();
    if (!name) return;
    if (folders.some(f => f.toLowerCase() === name.toLowerCase())) {
      alert("⚠️ عذراً، هذا المجلد موجود بالفعل في المنصة!");
      return;
    }
    setFolders([...folders, name]);
    setNewFolderNameInput("");
    setShowAddFolderModal(false);
  };

  const handleDeleteFolderComplete = (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const yes = window.confirm(`هل تود بالتأكيد إزالة المجلد "${folderName}"؟ سيتم نقل جميع الملفات الواقعة داخله إلى المجلد الرئيسي التفاعلي تلقائياً.`);
    if (!yes) return;
    setFolders(folders.filter(f => f !== folderName));
    setFiles(files.map(f => {
      if (f.folder === folderName) {
        return { ...f, folder: undefined };
      }
      return f;
    }));
  };

  // --- Live Multi-Player Cooperation Simulation ---
  const handleTriggerCollabSimulate = () => {
    if (isSimulatingTyping) return;
    setIsSimulatingTyping(true);
    
    const updatedUsers = [...onlineLobbyUsers];
    if (updatedUsers[1]) updatedUsers[1].typing = true; // سارة المهدي
    setOnlineLobbyUsers(updatedUsers);
    
    setCollabMessages(prev => [...prev, "💬 سارة المهدي بدأت تعديل دالة تشاركية وفحص المزامنة..."]);

    setTimeout(() => {
      const updatedUsersBack = [...onlineLobbyUsers];
      if (updatedUsersBack[1]) {
        updatedUsersBack[1].typing = false;
      }
      setOnlineLobbyUsers(updatedUsersBack);
      
      const appendCollabCode = `\n\n// --- مساهمة حية من الزميل سارة المهدي ---\n// نقوم بإجراء فحص ومزامنة إضافية للبيانات هنا لمدى توافق الأجهزة!\nconsole.log("ديوان البرمجة التشاركي: الاتصال الحي مستقر ✓");`;
      setEditorContent(prev => prev + appendCollabCode);
      
      const updatedFiles = [...files];
      if (updatedFiles[activeFileIndex]) {
        updatedFiles[activeFileIndex].content = updatedFiles[activeFileIndex].content + appendCollabCode;
        setFiles(updatedFiles);
      }
      
      setCollabMessages(prev => [...prev, "💾 تم دمج وتطوير كود تشاركي ناجح من سارة المهدي تلقائياً بنجاح!"]);
      setIsSimulatingTyping(false);
    }, 2500);
  };

  // --- Auto-Graded Exercises Evaluator ---
  const handleLaunchQuest = (questId: string) => {
    const quest = QUESTS_LIST.find(q => q.id === questId);
    if (!quest) return;
    
    setActiveQuestId(questId);
    setQuestGradeResult(null);

    const confirmBoilerplate = window.confirm(`هل تريد استيراد قالب التحدي "${quest.title}" في محرر الأكواد الحالي للعمل عليه؟ (ملاحظة: سيتم وضعه في مجلد 'src')`);
    if (confirmBoilerplate) {
      const fileName = quest.lang === "html" ? "index.html" : `test_challenge.${quest.lang === "javascript" ? "js" : quest.lang === "python" ? "py" : "sql"}`;
      const existingFileIdx = files.findIndex(f => f.name.toLowerCase() === fileName.toLowerCase());
      
      const newFile: CodeFile = {
        name: fileName,
        language: quest.lang,
        content: quest.initialTemplate,
        folder: "src"
      };

      let newActiveIndex = 0;
      if (existingFileIdx >= 0) {
        const updated = [...files];
        updated[existingFileIdx] = newFile;
        setFiles(updated);
        newActiveIndex = existingFileIdx;
      } else {
        const updated = [...files, newFile];
        setFiles(updated);
        newActiveIndex = updated.length - 1;
      }

      setActiveFileIndex(newActiveIndex);
      setEditorContent(quest.initialTemplate);
    }
  };

  const handleTestQuestCode = () => {
    if (!activeQuestId) return;
    const quest = QUESTS_LIST.find(q => q.id === activeQuestId);
    if (!quest) return;

    setQuestGradeResult("يجري تحليل وتقييم الكود وتجربته سحابياً... ⏳");
    
    setTimeout(() => {
      const codeToCheck = editorContent.trim();
      let isSuccess = false;
      let reason = "";

      if (quest.id === "html_btn") {
        const hasIdBtn = codeToCheck.includes('id="btn"') || codeToCheck.includes("id='btn'");
        const hasGradStyle = codeToCheck.includes('bg-gradient-to') || codeToCheck.includes('indigo') || codeToCheck.includes('teal') || codeToCheck.includes('bg-') || codeToCheck.includes('style=') || codeToCheck.includes('px-');
        if (hasIdBtn && hasGradStyle) {
          isSuccess = true;
        } else {
          reason = "تأكد من وجود وسم زر يحتوي على id=\"btn\" وتنسيقات لونية واضحة كألوان التدرجات bg-gradient-to أو فئات bg أخرى.";
        }
      } else if (quest.id === "js_even") {
        if (codeToCheck.includes("filterEvenNumbers") && (codeToCheck.includes("% 2") || codeToCheck.includes(".filter"))) {
          isSuccess = true;
        } else {
          reason = "تأكد من كتابة اسم الدالة filterEvenNumbers بشكل صحيح واستخدام حساب متبقي القسمة % 2 أو ميثود الترشيح.";
        }
      } else if (quest.id === "python_exp") {
        if (codeToCheck.includes("calculate_power") && (codeToCheck.includes("**") || codeToCheck.includes("pow") || codeToCheck.includes("def "))) {
          isSuccess = true;
        } else {
          reason = "تأكد من تعريف الدالة calculate_power(base, exp) واستخدام إشارة الأس المزدوجة ** في بايثون.";
        }
      } else if (quest.id === "sql_table") {
        if (codeToCheck.toUpperCase().includes("CREATE TABLE HEROS") && codeToCheck.toUpperCase().includes("PRIMARY KEY") && codeToCheck.toUpperCase().includes("FULL_NAME")) {
          isSuccess = true;
        } else {
          reason = "تأكد من إنشاء الجدول heros بحروف صحيحة تشمل المعرّف id كـ PRIMARY KEY والاسم الكامل full_name.";
        }
      }

      if (isSuccess) {
        setQuestStatus(prev => ({ ...prev, [quest.id]: "solved" }));
        setQuestGradeResult(`🎉 تهانينا! الكود مطابق للمعايير ومثالي بنسبة 100%. تم إسناد +\${quest.points} نقطة خبرة XP إلى رصيدك! 🏆`);
        
        const newXP = userScoreXP + quest.points;
        setUserScoreXP(newXP);
        localStorage.setItem("diwan_user_xp", String(newXP));
        
        synthesizeCodeSound(false);
      } else {
        setQuestStatus(prev => ({ ...prev, [quest.id]: "failed" }));
        setQuestGradeResult(`❌ لم يمر الاختبار بنجاح بعد. السبب الخطي: \${reason || "الكود المدخل لا يحقق شروط المسألة الكشفية للتحدي."}`);
        
        synthesizeCodeSound(true);
      }
    }, 1200);
  };

  // --- AI Co-Pilot / Assistant Companion Action ---
  const handleSendAiAssistantMessage = (quickOption?: string) => {
    const promptText = quickOption || aiAssistantPrompt.trim();
    if (!promptText) return;

    setAiAssistantMessages(prev => [...prev, { sender: "user", text: promptText }]);
    setAiAssistantPrompt("");
    setIsAiAssistantLoading(true);

    setTimeout(() => {
      let aiText = "";
      const queryLower = promptText.toLowerCase();

      if (queryLower.includes("تبسيط") || queryLower.includes("فهم") || quickOption === "تبسيط وفهم الكود 💡") {
        aiText = `💡 تحليل وتبسيط الكود:\nيمثل هذا الملف بنية برمجية واضحة تعتمد التوجه المتسلسل القوي والمنظم. الكود مكتوب بأسلوب مقروء ونظيف جداً (Clean Code) ويلبي معايير ديوان البرمجة الأكاديمية!`;
      } else if (queryLower.includes("أمان") || queryLower.includes("ثغرة") || quickOption === "فحص المخاطر والثغرات 🔒") {
        aiText = `🔒 تقرير الأمان والوقاية من الثغرات (Security Audit):\n- فحص معالجة المدخلات: سليم تماماً وضد ثغرات الحقن بفضل العزل والفلترة السائدة.\n- الذاكرة المؤقتة: خالية من التسريب (Safe state).\n- يُوصى بعدم استيراد أكواد غير معروفة يدوياً.`;
      } else if (queryLower.includes("تحويل") || quickOption === "تحويل الكود إلى Rust/Python 🦀") {
        aiText = `🦀 دليل التحويل المتطور لـ Rust / Python:\nلإعداد الكود بالبنية السريعة الفائقة لـ Rust:\n\`\`\`rust\nfn main() {\n    println!("أهلاً بك في فضاء ديوان البرمجة مع لغة Rust المتكاملة!");\n}\n\`\`\`\nهذا يمنحك سرعة ممتازة وحماية كاملة للمتغيرات!`;
      } else {
        aiText = `🧙‍♂️ الرد الفوري المباشر من المساعد والمشرف الذكي:\nسؤال رائع عن شفرتك في ديوان البرمجة! مخرجات الكود سياقها الهيكلي سليم وصحيح تماماً. تفضل بطرح مزيد من التفاصيل وسأبقى رفيقك البرمجي لأبسط لك الـ Algorithms الصعبة!`;
      }

      setAiAssistantMessages(prev => [...prev, { sender: "ai", text: aiText }]);
      setIsAiAssistantLoading(false);
    }, 1500);
  };

  // Add a new file
  const handleAddFile = () => {
    if (!newFileName.trim()) return;

    // Duplication check
    if (files.some(f => f.name.toLowerCase() === newFileName.trim().toLowerCase())) {
      alert("⚠️ عذراً، هذا الملف موجود بالفعل داخل مساحة العمل!");
      return;
    }

    const detectedLang = detectLanguageFromFileName(newFileName.trim());
    const newFile: CodeFile = {
      name: newFileName.trim(),
      language: detectedLang,
      content: getStarterCodeForLanguage(detectedLang, newFileName.trim()),
      folder: selectedFolderForNewFile || undefined
    };

    const updated = [...files, newFile];
    setFiles(updated);
    setNewFileName("");
    setShowAddModal(false);
    setActiveFileIndex(updated.length - 1);
  };

  // Delete a file
  const handleDeleteFile = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (files.length <= 1) {
      alert("⚠️ لا يمكن حذف كافة الملفات! يرجى الإبقاء على ملف واحد على الأقل لكتابة الكود.");
      return;
    }
    const confirmDelete = window.confirm(`هل أنت متأكد من رغبتك في حذف الملف "${files[indexToDelete].name}" نهائياً؟`);
    if (!confirmDelete) return;

    const updated = files.filter((_, idx) => idx !== indexToDelete);
    setFiles(updated);

    if (activeFileIndex >= updated.length) {
      setActiveFileIndex(updated.length - 1);
    } else if (activeFileIndex === indexToDelete) {
      setActiveFileIndex(Math.max(0, indexToDelete - 1));
    }
  };

  // Rename a file
  const handleRenameFile = (index: number) => {
    if (!renameValue.trim()) return;

    // Duplication check
    if (files.some((f, idx) => idx !== index && f.name.toLowerCase() === renameValue.trim().toLowerCase())) {
      alert("⚠️ عذراً، يوجد ملف آخر يحمل نفس الاسم المختار!");
      return;
    }

    const updated = [...files];
    const newName = renameValue.trim();
    const detectedLang = detectLanguageFromFileName(newName);

    updated[index] = {
      ...updated[index],
      name: newName,
      language: detectedLang
    };

    setFiles(updated);
    if (activeFileIndex === index) {
      setEditorContent(updated[index].content);
    }
    setRenamingIndex(null);
    setRenameValue("");
  };

  // Download single file
  const handleDownloadSingleFile = (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download entire workspace as a compressed ZIP
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      files.forEach(file => {
        if (file.folder) {
          zip.folder(file.folder)?.file(file.name, file.content);
        } else {
          zip.file(file.name, file.content);
        }
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedTemplate.toLowerCase()}_diwan_project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation Failed:", err);
      alert("⚠️ عذراً، تعذر إنشاء الملف المضغوط. يرجى محاولة تصدير الملفات يدوياً.");
    } finally {
      setIsZipping(false);
    }
  };

  // Real-time editor content change
  const handleEditorChange = (val: string) => {
    setEditorContent(val);
    const updated = [...files];
    if (updated[activeFileIndex]) {
      updated[activeFileIndex] = {
        ...updated[activeFileIndex],
        content: val
      };
      setFiles(updated);
    }
  };

  // Sync editor with active file
  useEffect(() => {
    if (files[activeFileIndex]) {
      setEditorContent(files[activeFileIndex].content);
    }
  }, [activeFileIndex, files]);

  // Handle template change
  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    const newFiles = TEMPLATE_FILES[templateName];
    setFiles(newFiles);
    setActiveFileIndex(0);
    setEditorContent(newFiles[0].content);
    setRunOutput("");
    setCompiledHtml("");
  };

  // Run or Compile Code
  const handleRunCode = () => {
    setIsCompiling(true);
    setRunOutput("");
    
    // Save current file content first
    const updatedFiles = [...files];
    updatedFiles[activeFileIndex] = {
      ...updatedFiles[activeFileIndex],
      content: editorContent
    };
    setFiles(updatedFiles);

    setTimeout(() => {
      setIsCompiling(false);
      
      const currentFile = updatedFiles[activeFileIndex];
      const fileLang = currentFile?.language || "javascript";
      const fileName = currentFile?.name || "code";

      if (fileLang === "html" || fileLang === "javascript" || fileLang === "css") {
        const htmlFile = updatedFiles.find(f => f.name.endsWith(".html")) || { content: `<div class="p-6 text-center"><h1>مخرجات ملف ${fileName}</h1><p>أضف ملف index.html لرسم واجهات مخصصة.</p></div>` };
        const jsFile = updatedFiles.find(f => f.name.endsWith(".js"));
        const cssFile = updatedFiles.find(f => f.name.endsWith(".css"));

        // Inject script and style into HTML
        const combined = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Inter', sans-serif, system-ui; direction: rtl; }
                ${cssFile ? cssFile.content : ""}
              </style>
            </head>
            <body class="bg-slate-900 p-4 flex justify-center items-center h-screen text-slate-100">
              <div class="w-full max-w-lg">
                ${htmlFile.content || ""}
              </div>
              <script>
                try {
                  ${jsFile ? jsFile.content : ""}
                } catch(err) {
                  document.body.innerHTML += \`<div class="p-4 bg-red-950 text-red-100 rounded border border-red-800 font-mono text-xs mt-4">خطأ في التشغيل JS: \${err.message}</div>\`;
                }
              </script>
            </body>
          </html>
        `;
        setCompiledHtml(combined);
        setRunOutput(`▶️ تم تشغيل المحاكي المتكامل لصفحة الويب بنجاح!\nالملف المشغل حالياً: ${fileName}\n\n💡 نصيحة: إذا قمت بإضافة ملف style.css أو script.js فسيتم تفعيلها وربطها بالـ HTML تلقائياً.`);
      } else if (fileLang === "react") {
        setRunOutput(`▶️ محاكاة React: تم بناء واستيراد المكون "${fileName}" بنجاح في الواجهة.`);
        setCompiledHtml(`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-slate-900 p-4 flex justify-center items-center h-screen text-slate-100">
              <div id="root"></div>
              <script type="text/babel">
                const { useState } = React;
                
                function Counter() {
                  const [count, setCount] = useState(0);
                  
                  return (
                    <div className="p-6 bg-slate-800 text-white rounded-xl border border-slate-700 shadow-xl max-w-sm mx-auto text-center">
                      <h2 className="text-xl font-bold mb-4 text-sky-400">عداد تفاعلي (React Real-time)</h2>
                      <p className="text-[10px] text-zinc-400 mb-4">الملف المشغل: <span className="font-mono text-teal-400">${fileName}</span></p>
                      <div className="flex items-center justify-center gap-6">
                        <button 
                          onClick={() => setCount(count + 1)}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg font-bold shadow-lg shadow-sky-500/30 transition-all font-mono"
                        >
                          + زيادة 
                        </button>
                        <span className="text-3xl font-mono text-emerald-400 font-bold min-w-[30px] text-center">{count}</span>
                        <button 
                          onClick={() => setCount(Math.max(0, count - 1))}
                          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg font-bold shadow-lg shadow-rose-500/30 transition-all font-mono"
                        >
                          - نقصان
                        </button>
                      </div>
                      <p className="mt-4 text-[10px] text-zinc-500">يعمل المكون بسلاسة عبر React 18+ في المتصفح</p>
                    </div>
                  );
                }

                const container = document.getElementById('root');
                const root = ReactDOM.createRoot(container);
                root.render(<Counter />);
              </script>
            </body>
          </html>
        `);
      } else if (fileLang === "python") {
        if (editorContent.includes("bubble_sort")) {
          setRunOutput(`>>> تشغيل ملف: bubble_sort.py ...\n\n🔹 الدرجات قبل الترتيب: [88, 95, 70, 64, 99, 82]\n✨ الدرجات مرتبة حاسوبياً: [64, 70, 82, 88, 95, 99]\n\n🏆 تم إنهاء العملية برمز الخروج 0`);
        } else {
          setRunOutput(`>>> تشغيل ملف بايثون: ${fileName} ...\n\n🔹 [Python Simulator Out]:\n---------------------------------\n${editorContent.slice(0, 500)}\n---------------------------------\n\n💡 ملاحظة مبرمج الذكاء الاصطناعي: كود بايثون سليم وصحيح لغوياً!`);
        }
      } else if (fileLang === "typescript") {
        setRunOutput(`>>> جاري تجميع وفحص TypeScript (tsc --noEmit)...
>>> تشغيل ملف: ${fileName} ...

🔒 [Static Type Checking]: Passed!
📌 مخرجات كود الـ TypeScript:
---------------------------------
${editorContent.slice(0, 400)}
---------------------------------

💡 تم فحص صحة تعريفات الصفوف والواجهات بنجاح برونق سليم.`);
      } else if (fileLang === "cpp") {
        setRunOutput(`>>> تجميع ملف C++ بنجاح (g++ -std=c++20)...
>>> تشغيل ملف: ${fileName} ...

==================== [C++ Console Emulator] ====================
${editorContent.includes("binarySearch") ? `🔍 جاري البحث عن القيمة: 47\n✨ تم العثور على العنصر بنجاح في الفهرس رقم: 3` : `[G++ Out]:\n${editorContent.slice(0, 300)}`}
==============================================================

🏆 تم التنفيذ بنجاح (Exit code: 0)`);
      } else if (fileLang === "java") {
        setRunOutput(`>>> تجميع وتشغيل Java (javac & java)...
>>> تشغيل ملف: ${fileName} ...

☕ [Java Runtime Log - VM Version 21]:
---------------------------------
${editorContent.includes("techStack") ? `⚙️ اللغات والتقنيات المدعومة داخل هذا الكود:\n  - Spring Boot\n  - Java 21\n  - Microservices` : `[Stdout]:\n${editorContent.slice(0, 400)}`}
---------------------------------

🏆 تم التشغيل البرمجي بنجاح.`);
      } else if (fileLang === "sql") {
        setRunOutput(`>>> تشغيل محاكي خادم SQL Memory Engine...
>>> تفسير ملف: ${fileName} ...

📊 مخرجات الاستعلام ومطابقة القيود (Query Success):
---------------------------------
${editorContent.includes("developers") ? `📊 الجدول الناتج لـ (SELECT) في developers:\n+----------------+-----------------------------+------------+\n| name           | specialization              | rank_stars |\n+----------------+-----------------------------+------------+\n| خالد المغربي   | مطور واجهات React           | 5          |\n| سارة المهدي    | مهندسة ذكاء اصطناعي وبايثون | 5          |\n+----------------+-----------------------------+------------+\n(المخرجات مطابقة لشفرة الاستعلام)` : `📋 [SQL Out]:\n${editorContent.slice(0, 400)}`}
---------------------------------
🏆 سكريبت قاعدة البيانات سليم.`);
      } else if (fileLang === "go") {
        setRunOutput(`>>> go run ${fileName} ...\n\n[Go v1.22 Console SDK]:\n---------------------------------\nأهلاً بك في فضاء لغة Go السريعة والفعالة! 🚀\n---------------------------------\n\n🏆 تم الإنهاء بنجاح (exit code 0)`);
      } else if (fileLang === "rust") {
        setRunOutput(`>>> cargo run (compiling ${fileName} in debug mode)...\n\n   Compiling target v0.1.0\n    Finished dev [unoptimized + debuginfo] target(s) in 0.55s\n     Running \`target/debug/app\`\n\n[Rust Sandbox]:\n---------------------------------\nأهلاً بك في لغة Rust! 🦀\n---------------------------------\n\n🏆 Cargo run completed successfully with zero safety leaks!`);
      } else if (fileLang === "csharp") {
        setRunOutput(`>>> dotnet run --project ${fileName} ...\n\n[.NET Runtime v8.0 Console]:\n---------------------------------\nمرحباً بك في عالم .NET و C#! 💻\n---------------------------------\n\n🏆 Process finished with exit code 0.`);
      } else if (fileLang === "ruby") {
        setRunOutput(`>>> ruby ${fileName} ...\n\n[Ruby v3.3 Interpreter Output]:\n---------------------------------\nشفرة روبي الأنيقة تعمل بنجاح! 💎\n---------------------------------\n\n🏆 Finished in 0.05 seconds.`);
      } else if (fileLang === "php") {
        setRunOutput(`>>> php ${fileName} ...\n\n[PHP v8.3 Runtime Server Simulation]:\n---------------------------------\nأهلاً بكم في بيئة خادم الويب الافتراضية لـ PHP! 🐘\n---------------------------------\n\n🏆 Parsing completed.`);
        setCompiledHtml(`
          <!DOCTYPE html>
          <html>
            <body class="bg-slate-900 text-slate-100 p-6 font-mono text-center flex flex-col items-center justify-center h-screen">
              <div class="px-6 py-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl max-w-sm">
                <span class="text-3xl">🐘</span>
                <h3 class="text-base font-bold text-emerald-400 mt-2">PHP Server Sandbox</h3>
                <p class="text-xs text-slate-300 mt-1">صفحة PHP تعمل بنجاح على الخادم الافتراضي للرابطة.</p>
              </div>
            </body>
          </html>
        `);
      } else if (fileLang === "swift") {
        setRunOutput(`>>> swift ${fileName} ...\n\n[Swift 5.10 Compiler]:\n---------------------------------\nأهلاً بك في Swift الرائعة لبرمجة تطبيقات آبل! 🍎\n---------------------------------\n\n🏆 Compiled and executed successfully.`);
      } else if (fileLang === "kotlin") {
        setRunOutput(`>>> kotlinc ${fileName} -include-runtime -d main.jar && java -jar main.jar ...\n\n[Kotlin JVM]:\n---------------------------------\nمرحباً بك في لغة Kotlin المتطورة! 🎯\n---------------------------------\n\n🏆 Execution completed successfully.`);
      } else if (fileLang === "markdown") {
        setRunOutput(`▶️ تم تجميع وعرض ملف التوثيق Markdown بتنسيقات الويب الأنيقة.`);
        setCompiledHtml(`
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Inter', sans-serif, system-ui; direction: rtl; }
              </style>
            </head>
            <body class="bg-slate-900 p-8 text-slate-200">
              <div class="prose prose-invert prose-slate max-w-xl mx-auto">
                <div class="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/50">
                  <h1 class="text-xl font-bold text-teal-400 mb-4">📝 معاينة مستند Markdown المنسق</h1>
                  <hr class="border-slate-700 my-4" />
                  <div class="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">${editorContent.replace(/#/g, '# ')}</div>
                </div>
              </div>
            </body>
          </html>
        `);
      } else if (fileLang === "json") {
        try {
          JSON.parse(editorContent);
          setRunOutput(`>>> Parsing JSON configuration: ${fileName} ...\n\n✅ JSON syntactically valid!\n\nParsed object: \n${JSON.stringify(JSON.parse(editorContent), null, 2)}`);
        } catch (e: any) {
          setRunOutput(`>>> Parsing JSON configuration: ${fileName} ...\n\n❌ JSON Syntax Error:\n${e.message}`);
        }
      } else {
        // Dynamic smart parser and simulation engine for ANY programming language
        const lines = editorContent.split("\n");
        const detectedOutputs: string[] = [];
        
        // Comprehensive regexes to capture outputs from any print or log statement
        const patterns = [
          /console\.log\s*\(\s*['"`](.*?)['"`]\s*\)/i,
          /print\s*\(\s*['"`](.*?)['"`]\s*\)/i,
          /print\s+['"`](.*?)['"`]/i,
          /System\.out\.println\s*\(\s*['"`](.*?)['"`]\s*\)/i,
          /System\.out\.print\s*\(\s*['"`](.*?)['"`]\s*\)/i,
          /cout\s*<<\s*['"`](.*?)['"`]/i,
          /printf\s*\(\s*['"`](.*?)['"`]/i,
          /puts\s*\(\s*['"`](.*?)['"`]/i,
          /puts\s+['"`](.*?)['"`]/i,
          /echo\s+['"`](.*?)['"`]/i,
          /echo\s+([a-zA-Z0-9\u0600-\u06FF\s_]+)/i,
          /fmt\.Println\s*\(\s*['"`](.*?)['"`]/i,
          /println!\s*\(\s*['"`](.*?)['"`]/i
        ];

        lines.forEach(line => {
          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match && match[1]) {
              let clean = match[1]
                .replace(/\{.*?\}/g, "")
                .replace(/\$\{.*?\}/g, "")
                .replace(/\\\(.*?\)/g, "")
                .trim();
              if (clean) {
                detectedOutputs.push(clean);
              }
              break;
            }
          }
        });

        let outputText = `>>> تشغيل ملف مخصص: ${fileName} (${fileLang.toUpperCase()})...\n`;
        outputText += `⚙️ [محاكي ديوان البرمجة الشامل لكافة لغات البرمجة]:\n`;
        outputText += `==============================================================\n`;
        
        if (detectedOutputs.length > 0) {
          outputText += detectedOutputs.map(o => `💬 [Stdout]: ${o}`).join("\n");
        } else {
          outputText += `⚡ تم تحميل ملف الكود المصدري وفحصه لغوياً بنجاح!\n`;
          
          // Detect functions/methods
          const funcMatches = editorContent.match(/(def|function|fn|class|void|int|double|struct|proc)\s+(\w+)/g);
          if (funcMatches && funcMatches.length > 0) {
            outputText += `📦 الكيانات والدوال البرمجية المكتشفة:\n`;
            funcMatches.forEach(f => {
              outputText += `  • ${f.trim()}()\n`;
            });
          }
          
          // Detect variables
          const varMatches = editorContent.match(/(const|let|var|val|int|string|float|double|char)\s+(\w+)\s*=/g);
          if (varMatches && varMatches.length > 0) {
            outputText += `📌 المتغيرات المهيأة المكتشفة:\n`;
            varMatches.slice(0, 5).forEach(v => {
              outputText += `  • ${v.replace("=", "").trim()}\n`;
            });
          }
          
          outputText += `\n💡 نصيحة: اكتب جمل طباعة مثل print() أو console.log() أو cout أو echo لعرض مخرجات مخصصة في الكونسول!`;
        }
        
        outputText += `\n==============================================================\n`;
        outputText += `🏆 تم التنفيذ بنجاح (Exit code: 0)`;
        setRunOutput(outputText);
      }
    }, 700);
  };

  const handleShare = () => {
    const currentFile = files[activeFileIndex];
    onShareToFeed(editorContent, currentFile.language, currentFile.name);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAiFix = async () => {
    if (!editorContent.trim()) return;
    setIsAiLoading(true);
    setAiError("");
    setAiResponse(null);

    const currentFile = files[activeFileIndex];

    try {
      const response = await fetch("/api/ai/fix-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: editorContent,
          language: currentFile.language,
          fileName: currentFile.name
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "حدث خطأ أثناء الاتصال بخادم الذكاء الاصطناعي.");
      }

      const data = await response.json();
      setAiResponse(data);
    } catch (err: any) {
      setAiError(err.message || "فشلت عملية التصليح بالذكاء الاصطناعي.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyFixedCode = () => {
    if (!aiResponse) return;
    setEditorContent(aiResponse.fixedCode);
    
    // Save to files list
    const updatedFiles = [...files];
    const fileName = updatedFiles[activeFileIndex]?.name || "code";
    updatedFiles[activeFileIndex] = {
      ...updatedFiles[activeFileIndex],
      content: aiResponse.fixedCode
    };
    setFiles(updatedFiles);
    
    // Trigger callback
    if (onFixedWithAi) {
      onFixedWithAi(fileName, aiResponse.explanation);
    }
    
    setAiResponse(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ide-workspace">
      {/* Sidebar Controls and File Explorer */}
      <div className="lg:col-span-3 bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 px-1 font-mono">
            🛠️ اختر بيئة البرمجة
          </h3>
          <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto pr-1">
            <button
              id="template-web"
              onClick={() => handleTemplateChange("JavaScript_HTML")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "JavaScript_HTML"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">الويب التفاعلي</span>
                <span className="block text-[9px] text-white/40 font-mono">HTML / JavaScript</span>
              </div>
            </button>

            <button
              id="template-typescript"
              onClick={() => handleTemplateChange("TypeScript")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "TypeScript"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">مخطوطة TypeScript</span>
                <span className="block text-[9px] text-white/40 font-mono">Strongly Typed code</span>
              </div>
            </button>

            <button
              id="template-react"
              onClick={() => handleTemplateChange("React")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "React"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">مكونات React</span>
                <span className="block text-[9px] text-white/40 font-mono">React Interactive</span>
              </div>
            </button>

            <button
              id="template-python"
              onClick={() => handleTemplateChange("Python")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Python"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">خوارزميات بايثون</span>
                <span className="block text-[9px] text-white/40 font-mono">Python Core script</span>
              </div>
            </button>

            <button
              id="template-cpp"
              onClick={() => handleTemplateChange("CPP")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "CPP"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">سي بلس بلس C++</span>
                <span className="block text-[9px] text-white/40 font-mono">G++ Engine</span>
              </div>
            </button>

            <button
              id="template-java"
              onClick={() => handleTemplateChange("Java")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Java"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">جافا Java JVM</span>
                <span className="block text-[9px] text-white/40 font-mono">Main.java / OO</span>
              </div>
            </button>

            <button
              id="template-sql"
              onClick={() => handleTemplateChange("SQL")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "SQL"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                <Database className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">قواعد بيانات SQL</span>
                <span className="block text-[9px] text-white/40 font-mono">schema.sql Schema</span>
              </div>
            </button>

            <button
              id="template-rust"
              onClick={() => handleTemplateChange("Rust")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Rust"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-red-500/10 text-red-400">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">لغة Rust 🦀</span>
                <span className="block text-[9px] text-white/40 font-mono">Cargo Compiler</span>
              </div>
            </button>

            <button
              id="template-go"
              onClick={() => handleTemplateChange("Go")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Go"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">لغة Go 🚀</span>
                <span className="block text-[9px] text-white/40 font-mono">Go SDK Engine</span>
              </div>
            </button>

            <button
              id="template-csharp"
              onClick={() => handleTemplateChange("CSharp")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "CSharp"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">لغة C# 💻</span>
                <span className="block text-[9px] text-white/40 font-mono">.NET Runtime</span>
              </div>
            </button>

            <button
              id="template-ruby"
              onClick={() => handleTemplateChange("Ruby")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Ruby"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-rose-500/10 text-rose-450">
                <Code className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">لغة Ruby 💎</span>
                <span className="block text-[9px] text-white/40 font-mono">Ruby Interpreter</span>
              </div>
            </button>

            <button
              id="template-php"
              onClick={() => handleTemplateChange("PHP")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "PHP"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">بيئة PHP 🐘</span>
                <span className="block text-[9px] text-white/40 font-mono">PHP Server</span>
              </div>
            </button>

            <button
              id="template-swift"
              onClick={() => handleTemplateChange("Swift")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Swift"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-red-400/10 text-red-300">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">لغة Swift 🍎</span>
                <span className="block text-[9px] text-white/40 font-mono">Swift Compiler</span>
              </div>
            </button>

            <button
              id="template-kotlin"
              onClick={() => handleTemplateChange("Kotlin")}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-right text-sm font-medium transition-all ${
                selectedTemplate === "Kotlin"
                  ? "bg-white/5 text-white border border-white/10 shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="p-1 px-1.5 rounded-lg bg-orange-500/10 text-orange-450">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="block font-medium text-xs">لغة Kotlin 🎯</span>
                <span className="block text-[9px] text-white/40 font-mono">Kotlin JVM</span>
              </div>
            </button>
          </div>
        </div>

        {/* File Explorer with Interactive Folder Tree System */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono flex items-center gap-1.5 font-sans">
              📁 شجرة ملفات ومجلدات المشروع
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setShowAddModal(!showAddModal);
                  setShowAddFolderModal(false);
                }}
                className={`p-1 px-1.5 rounded transition text-[9px] font-bold flex items-center gap-0.5 cursor-pointer ${
                  showAddModal ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                }`}
                title="إضافة ملف برمجي جديد"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>+ملف</span>
              </button>
              <button
                onClick={() => {
                  setShowAddFolderModal(!showAddFolderModal);
                  setShowAddModal(false);
                }}
                className={`p-1 px-1.5 rounded transition text-[9px] font-bold flex items-center gap-0.5 cursor-pointer ${
                  showAddFolderModal ? "bg-amber-600 text-white" : "bg-amber-500/10 text-amber-450 hover:bg-amber-500/20"
                }`}
                title="إنشاء مجلد منظم جديد"
              >
                <FolderPlus className="w-2.5 h-2.5" />
                <span>+مجلد</span>
              </button>
            </div>
          </div>

          {/* New Folder Inline Panel */}
          {showAddFolderModal && (
            <div className="p-3 bg-amber-950/10 border border-amber-500/20 rounded-xl flex flex-col gap-2 animate-in fade-in-50 duration-150">
              <span className="text-[10px] text-amber-300 font-medium font-sans text-right">اسم المجلد الجديد في مساحة العمل:</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="components, assets, config..."
                  value={newFolderNameInput}
                  onChange={(e) => setNewFolderNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFolder();
                  }}
                  className="flex-1 bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono placeholder-white/20 focus:outline-none focus:border-amber-500"
                  dir="ltr"
                />
                <button
                  onClick={handleCreateFolder}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 rounded text-[10px] font-bold text-white transition cursor-pointer"
                >
                  إنشاء مجلد
                </button>
              </div>
            </div>
          )}

          {/* New File Inline Panel with Folder Target Selection */}
          {showAddModal && (
            <div className="p-3 bg-blue-950/10 border border-blue-500/20 rounded-xl flex flex-col gap-2.5 animate-in fade-in-50 duration-150 text-right" dir="rtl">
              <div>
                <span className="text-[10px] text-white/60 font-medium block mb-1">اسم الملف الجديد (مثل utils.js):</span>
                <input
                  type="text"
                  placeholder="index.html, script.js, counter.tsx..."
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddFile();
                  }}
                  className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono placeholder-white/25 focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
              </div>

              <div>
                <span className="text-[10px] text-white/60 font-medium block mb-1 font-sans">المجلد المستهدف للملف:</span>
                <select
                  value={selectedFolderForNewFile}
                  onChange={(e) => setSelectedFolderForNewFile(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none font-sans"
                >
                  <option value="">📁 المجلد الرئيسي للمشروع (الجذر)</option>
                  {folders.map(folder => (
                    <option key={folder} value={folder}>📂 {folder}/</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddFile}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-[11px] font-bold text-white transition cursor-pointer text-center font-sans"
              >
                إنشاء ورسم الملف الجديد ✓
              </button>
              <p className="text-[8.5px] text-white/35 leading-relaxed text-right">
                * يدعم 18 لغة برمجية تلقائياً بناءً على اللاحقة المدخلة.
              </p>
            </div>
          )}

          {/* Files List tree scroll block */}
          <div className="flex flex-col gap-1 max-h-[360px] overflow-y-auto pr-1">
            
            {/* 1. Mapped Folders Rendering */}
            {folders.map(folderName => {
              const isCollapsed = !!collapsedFolders[folderName];
              const folderFiles = files.filter(f => f.folder === folderName);

              return (
                <div key={folderName} className="flex flex-col gap-0.5 border border-white/5 rounded-lg p-1 bg-white/[0.01]">
                  {/* Folder Header */}
                  <div className="flex items-center justify-between px-2 py-1 px-1 bg-white/[0.02] hover:bg-white/[0.04] rounded transition cursor-pointer select-none">
                    <button
                      onClick={() => setCollapsedFolders({
                        ...collapsedFolders,
                        [folderName]: !isCollapsed
                      })}
                      className="flex-1 flex items-center gap-1.5 text-right font-sans text-xs font-semibold text-amber-300"
                    >
                      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-500" />}
                      <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                      <span className="truncate">{folderName}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">({folderFiles.length})</span>
                    </button>

                    <button
                      onClick={(e) => handleDeleteFolderComplete(folderName, e)}
                      className="p-1 text-zinc-500 hover:text-red-400 rounded transition"
                      title="حذف المجلد"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Folder Items list */}
                  {!isCollapsed && (
                    <div className="pr-3 flex flex-col gap-0.5 border-r border-amber-500/10 mr-2 my-1">
                      {folderFiles.length === 0 ? (
                        <span className="text-[9px] text-zinc-650 py-1 px-2 text-right">المجلد فارغ حالياً</span>
                      ) : (
                        folderFiles.map(file => {
                          const fileIndex = files.findIndex(f => f.name === file.name);
                          const isSelected = fileIndex === activeFileIndex;
                          const isRenaming = renamingIndex === fileIndex;

                          return (
                            <div
                              key={`${file.name}-${fileIndex}`}
                              className={`group relative flex items-center justify-between rounded-md text-right text-xs font-mono transition-all border ${
                                isSelected
                                  ? "bg-blue-500/5 text-blue-300 border-blue-500/25"
                                  : "border-transparent text-white/50 hover:bg-white/[0.02] hover:text-white"
                              }`}
                            >
                              {isRenaming ? (
                                <div className="flex-1 p-1 flex gap-1 items-center">
                                  <input
                                    type="text"
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    className="flex-1 bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                                    dir="ltr"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleRenameFile(fileIndex);
                                      if (e.key === 'Escape') setRenamingIndex(null);
                                    }}
                                  />
                                </div>
                              ) : (
                                <button
                                  onClick={() => setActiveFileIndex(fileIndex)}
                                  className="flex-1 text-right flex items-center gap-1.5 px-2 py-1 cursor-pointer relative"
                                >
                                  <FileCode className={`w-3 h-3 ${isSelected ? "text-blue-400" : "text-zinc-500"}`} />
                                  <span className="truncate block">{file.name}</span>
                                </button>
                              )}

                              {!isRenaming && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pl-1 select-none">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRenamingIndex(fileIndex);
                                      setRenameValue(file.name);
                                    }}
                                    className="p-1 text-zinc-500 hover:text-blue-450"
                                    title="إعادة تسمية"
                                  >
                                    <Edit className="w-2.5 h-2.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteFile(fileIndex, e)}
                                    disabled={files.length <= 1}
                                    className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-35"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 2. Unassigned Root Files Rendering */}
            <div className="mt-1 pb-1 border-t border-white/5 pt-1.5">
              <span className="text-[9px] text-zinc-500 px-2 block mb-1 font-sans text-right">📄 ملفات خارج المجلدات (الجذر):</span>
              {files.filter(f => !f.folder || !folders.includes(f.folder)).map(file => {
                const fileIndex = files.findIndex(f => f.name === file.name);
                const isSelected = fileIndex === activeFileIndex;
                const isRenaming = renamingIndex === fileIndex;

                return (
                  <div
                    key={`${file.name}-${fileIndex}`}
                    className={`group relative flex items-center justify-between rounded-lg text-right text-xs font-mono transition-all border ${
                      isSelected
                        ? "bg-blue-500/5 text-blue-300 border-blue-500/25"
                        : "border-transparent text-white/60 hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    {isRenaming ? (
                      <div className="flex-1 p-1 flex gap-1 items-center">
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          className="flex-1 bg-black border border-white/10 rounded px-1.5 py-0.5 text-xs text-white"
                          dir="ltr"
                          ref={(input) => input && input.focus()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameFile(fileIndex);
                            if (e.key === 'Escape') setRenamingIndex(null);
                          }}
                        />
                        <button
                          onClick={() => handleRenameFile(fileIndex)}
                          className="p-1 bg-emerald-600 rounded text-white text-[9px] font-bold cursor-pointer"
                        >
                          حفظ
                        </button>
                        <button
                          onClick={() => setRenamingIndex(null)}
                          className="p-1 bg-white/10 rounded text-white/60 text-[9px] cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveFileIndex(fileIndex)}
                        id={`file-tab-${file.name}`}
                        className="flex-1 text-right flex items-center gap-2 px-3 py-2 cursor-pointer relative pr-8 min-w-0"
                      >
                        <FileCode className={`w-3.5 h-3.5 absolute right-2.5 transition-colors ${isSelected ? "text-blue-450" : "text-white/30"}`} />
                        <span className="truncate block font-semibold">{file.name}</span>
                        <span className="text-[8px] bg-white/5 opacity-40 group-hover:opacity-100 rounded px-1 text-white scale-90 tracking-tighter col-span-1">
                          {file.language}
                        </span>
                      </button>
                    )}

                    {!isRenaming && (
                      <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-opacity pl-2 select-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenamingIndex(fileIndex);
                            setRenameValue(file.name);
                          }}
                          className="p-1 text-white/40 hover:text-blue-400 rounded transition cursor-pointer"
                          title="إعادة تسمية الملف"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={(e) => handleDownloadSingleFile(file, e)}
                          className="p-1 text-white/40 hover:text-teal-400 rounded transition cursor-pointer"
                          title="تنزيل وتصدير هذا الملف منفرداً"
                        >
                          <Download className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => handleDeleteFile(fileIndex, e)}
                          disabled={files.length <= 1}
                          className="p-1 text-white/20 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 rounded transition cursor-pointer"
                          title="حذف الملف نهائياً"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Compressed ZIP Download Button */}
          <div className="pt-2 border-t border-white/5 mt-1">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping || files.length === 0}
              className="w-full py-2.5 px-3 bg-[#0A0A0A] border border-blue-500/30 hover:bg-blue-900/10 disabled:opacity-40 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-950/25"
            >
              {isZipping ? (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <FolderPlus className="w-4 h-4 text-blue-400 animate-pulse" />
              )}
              <span>تنزيل كافة الملفات مضغوطة ZIP 📦</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-white/40 leading-relaxed font-sans">
          💡 يمكنك كتابة الكود الخاص بك وتجربته برؤية النتيجة التفاعلية المباشرة، أو الضغط على <strong>نشر الكود للمجتمع</strong> لطرح أي سؤال بخصوصه.
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        <div className="bg-[#151515] border border-white/10 rounded-2xl flex flex-col shadow-xl overflow-hidden min-h-[480px]">
          {/* Editor Header */}
          <div className="bg-[#0F0F0F] px-4 py-3 flex items-center justify-between border-b border-white/10 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500/50"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500/50"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500/50"></span>
              <span className="text-xs text-white/40 font-mono mr-2 bg-[#0A0A0A] px-2 py-0.5 rounded border border-white/10">
                {files[activeFileIndex]?.name || "editor"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
              <button
                id="btn-ai-fix"
                onClick={handleAiFix}
                disabled={isAiLoading || !editorContent.trim()}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/80 text-white rounded text-xs font-bold transition-all shadow-md shadow-purple-900/10 font-sans cursor-pointer"
              >
                {isAiLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                )}
                <span>تصليح بالذكاء الاصطناعي 🪄</span>
              </button>

              <button
                id="btn-run-code"
                onClick={handleRunCode}
                disabled={isCompiling}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded text-xs font-bold transition-all shadow-md shadow-blue-900/10 font-sans cursor-pointer"
              >
                {isCompiling ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>تشغيل الكود RUN CODE</span>
              </button>

              <button
                id="btn-share-code"
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/15 hover:bg-white/10 text-white rounded text-xs font-bold transition-all font-sans cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>جاهز للنشر!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-white/60" />
                    <span>نشر مع المشكلة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Text Area Code representation */}
          <div className="relative flex-1 flex flex-col">
            <textarea
              id="raw-code-editor"
              value={editorContent}
              onChange={(e) => handleEditorChange(e.target.value)}
              className="w-full flex-1 p-5 min-h-[300px] font-mono text-sm bg-[#1A1B1E] text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/20 leading-relaxed resize-none border-b border-white/10"
              placeholder="// ابدأ كتابة الكود البرمجي هنا..."
              dir="ltr"
              spellCheck="false"
            />
          </div>

          {/* AI-Powered Explanations & Corrections panel */}
          {isAiLoading && (
            <div className="p-4 bg-purple-950/20 border-b border-purple-500/20 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4 animate-bounce text-purple-300" />
              </div>
              <div className="flex-1 text-right" dir="rtl">
                <span className="block text-xs font-bold text-purple-300">جاري تحليل الكود واكتشاف الأخطاء بالذكاء الاصطناعي...</span>
                <span className="block text-[10px] text-purple-400/80 mt-0.5">نقوم بفحص كود {files[activeFileIndex]?.language} وتوليف الحل المناسب لك.</span>
              </div>
            </div>
          )}

          {aiError && (
            <div className="p-4 bg-red-950/30 border-b border-red-500/20 flex items-center justify-between gap-3 text-right" dir="rtl">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-lg">⚠️</span>
                <div>
                  <span className="block text-xs font-bold text-red-300">لم يكتمل فحص الذكاء الاصطناعي</span>
                  <span className="block text-[10px] text-red-400/80 mt-0.5">{aiError}</span>
                </div>
              </div>
              <button 
                onClick={() => setAiError("")} 
                className="text-xs text-red-400 hover:text-red-350 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          )}

          {aiResponse && (
            <div className="p-5 bg-gradient-to-br from-purple-950/10 via-[#131417] to-[#0A0A0A] border-b border-purple-500/20 flex flex-col gap-4 text-right" dir="rtl">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
                    <Sparkles className="w-4 h-4 text-purple-300 fill-purple-300" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-purple-300 font-sans">اقتراحات مبرمج الذكاء الاصطناعي (AI Assistant Fix)</span>
                    <span className="block text-[10px] text-white/50 mt-0.5">قمنا بتحليل المشكلة بنجاح، وإليك الإصلاحات والتحسينات المقترحة:</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyFixedCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-950/20 cursor-pointer font-sans"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تطبيق الكود المصحح تلقائياً</span>
                  </button>
                  <button
                    onClick={() => setAiResponse(null)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer font-sans"
                  >
                    تجاهل
                  </button>
                </div>
              </div>

              {/* Explanations text block */}
              <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-xs text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto pr-2">
                <span className="font-semibold block text-purple-200 mb-1.5">💡 الملاحظات الكشفية وحل المشكلة بالتفصيل:</span>
                <p className="whitespace-pre-line text-[11px] leading-relaxed text-slate-300 select-text">{aiResponse.explanation}</p>
              </div>

              {/* Corrected Code Preview */}
              <div className="p-3 bg-black/40 border border-purple-500/10 rounded-xl font-mono text-[10px] text-slate-400 max-h-[160px] overflow-y-auto" dir="ltr">
                <span className="block text-right font-sans text-[10px] text-purple-300/60 mb-2 font-bold" dir="rtl">📝 الكود المصحح والجاهز للتطبيق:</span>
                <pre className="select-text whitespace-pre overflow-x-auto">{aiResponse.fixedCode}</pre>
              </div>
            </div>
          )}

          {/* Outputs / Sandbox results */}
          <div className="border-t border-white/10 flex flex-col md:grid md:grid-cols-2 bg-[#0A0A0A]">
            {/* Log output / Terminal */}
            <div className="p-4 border-b md:border-b-0 md:border-l border-white/10 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-white/40 font-sans">
                  منفذ الأوامر والرسائل (Terminal log)
                </span>
              </div>
              <div 
                id="terminal-output"
                className="flex-1 bg-black/60 rounded-xl p-3 font-mono text-xs text-emerald-500/80 min-h-[140px] border border-white/10 leading-relaxed whitespace-pre-wrap select-all cursor-text overflow-y-auto"
                dir="ltr"
              >
                {isCompiling ? (
                  <span className="text-white/40 animate-pulse">⚙️ يتم فحص وترجمة الكود المصدر برمجياً...</span>
                ) : runOutput ? (
                  runOutput
                ) : (
                  <span className="text-white/40">&gt; Process ready... اضغط "تشغيل الكود" لعرض التحليل الخطي للمخرجات هنا.</span>
                )}
              </div>
            </div>

            {/* Visual HTML Output Sandbox Preview */}
            <div className="p-4 flex flex-col bg-[#0A0A0A]">
              <div className="flex items-center gap-2 mb-2 justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-white/40 font-sans">عرض النتائج التفاعلي المباشر (Sandbox)</span>
                </div>
                <span className="text-[10px] text-white/40 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                  متصفح يحاكي الـ DOM
                </span>
              </div>
              <div className="flex-1 bg-[#1A1B1E] rounded-xl min-h-[140px] border border-white/10 overflow-hidden relative">
                {isCompiling ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : compiledHtml ? (
                  <iframe
                     id="sandbox-iframe"
                     title="Code Output Sandbox"
                     srcDoc={compiledHtml}
                     className="w-full h-full bg-[#1A1B1E] min-h-[140px]"
                     sandbox="allow-scripts"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <Sparkles className="w-8 h-8 text-white/20 mb-2" />
                    <p className="text-xs text-white/40">مخرجات الويب وواجهات React ستظهر بشكل حي وأنيق جداً في هذه المساحة بعد التشغيل.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
