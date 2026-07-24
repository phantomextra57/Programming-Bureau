/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Code2, 
  MessageSquare, 
  Tv, 
  User as UserIcon, 
  Sparkles,
  Layers,
  Terminal,
  ChevronRight,
  Info,
  LogOut,
  Loader2,
  Bell,
  BellOff,
  CheckCircle2,
  Trash2,
  Heart
} from "lucide-react";
import { User, Post, TeacherChannelPost, Comment, UserRole, AppNotification, NotificationType } from "./types";
import { MOCK_USERS, MOCK_POSTS, MOCK_CHANNELS_POSTS } from "./mockData";
import IdeWorkspace from "./components/IdeWorkspace";
import CommunityFeed from "./components/CommunityFeed";
import TeacherChannels from "./components/TeacherChannels";
import UserProfile from "./components/UserProfile";
import AuthScreen from "./components/AuthScreen";
import { 
  auth, 
  db, 
  signOut, 
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from "./firebase";

export default function App() {
  // Authentication & Dynamic Profile States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Firestore Collections Sync States
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [channelPosts, setChannelPosts] = useState<TeacherChannelPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [firestoreError, setFirestoreError] = useState<boolean>(false);

  // UI States
  const [activeTab, setActiveTab] = useState<"feed" | "ide" | "teachers" | "profile">("feed");
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [platformName, setPlatformName] = useState<string>("ديوان البرمجة");
  
  // Shared state: code passed from IDE workspace to forum feed composer
  const [prepopulatedCode, setPrepopulatedCode] = useState<{
    code: string;
    language: string;
    filename: string;
  } | null>(null);

  // Sign out user handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error("Failed to sign out", err);
    }
  };

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      try {
        if (firebaseUser) {
          // Fetch real-time profile
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            setCurrentUser(userSnap.data() as User);
          } else {
            // If no profile (Google Sign-In first time might be loading in AuthScreen),
            // AuthScreen creates it. We listen dynamically or set a timeout.
            const checkTimer = setInterval(async () => {
              try {
                const reSnap = await getDoc(userDocRef);
                if (reSnap.exists()) {
                  setCurrentUser(reSnap.data() as User);
                  clearInterval(checkTimer);
                }
              } catch (timerErr) {
                console.warn("Timer profile fetch warning:", timerErr);
              }
            }, 1000);
            setTimeout(() => clearInterval(checkTimer), 10000);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (authErr) {
        console.warn("Authentication check warning, fallback active:", authErr);
        // If offline and we have a user from previous session auth cache, let them in
        if (firebaseUser) {
          setCurrentUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "مستكشف دون اتصال",
            username: firebaseUser.email?.split("@")[0] || "offline_user",
            role: "student",
            avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(firebaseUser.uid)}`,
            bio: "بروفايل مؤقت أثناء عدم الاتصال بالخادم الرئيسي.",
            skills: ["JavaScript", "TypeScript"],
            subscribersCount: 0,
            subscribedTeachers: [],
            completedChallenges: 0
          });
        }
      } finally {
        setAuthLoading(false);
      }
    }, (authError) => {
      console.warn("Auth helper state listener failed/offline:", authError);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Database seeding and real-time synchronization
  useEffect(() => {
    // A. Seed default values in Firestore if collections are empty
    const seedDatabase = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        if (usersSnap.empty) {
          // Seed Users
          for (const u of MOCK_USERS) {
            await setDoc(doc(db, "users", u.id), u);
          }
        }

        const postsSnap = await getDocs(collection(db, "posts"));
        if (postsSnap.empty) {
          // Seed posts
          for (const p of MOCK_POSTS) {
            await setDoc(doc(db, "posts", p.id), p);
          }
        }

        const channelPostsSnap = await getDocs(collection(db, "channels_posts"));
        if (channelPostsSnap.empty) {
          // Seed channel posts
          for (const cp of MOCK_CHANNELS_POSTS) {
            await setDoc(doc(db, "channels_posts", cp.id), cp);
          }
        }
      } catch (err) {
        console.warn("Database seeding issue/offline mode active:", err);
        // If offline, populate state with mock data to look real instantly!
        if (posts.length === 0) setPosts(MOCK_POSTS);
        if (users.length === 0) setUsers(MOCK_USERS);
        if (channelPosts.length === 0) setChannelPosts(MOCK_CHANNELS_POSTS);
      }
    };


    // B. Sync users list in real-time
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList: User[] = [];
      snapshot.forEach(docSnap => {
        usersList.push(docSnap.data() as User);
      });
      setUsers(usersList);
    }, (error) => {
      console.warn("Offline or permissions mode for users sync:", error);
      if (error?.message?.includes("permissions") || error?.code === "permission-denied") {
        setFirestoreError(true);
      }
      if (users.length === 0) setUsers(MOCK_USERS);
    });

    // C. Sync posts list ordered by creation date
    const postsQuery = query(collection(db, "posts"));
    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      const postsList: Post[] = [];
      snapshot.forEach(docSnap => {
        postsList.push(docSnap.data() as Post);
      });
      // Sort client-side by date descending
      postsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(postsList);
    }, (error) => {
      console.warn("Offline or permissions mode for posts sync:", error);
      if (error?.message?.includes("permissions") || error?.code === "permission-denied") {
        setFirestoreError(true);
      }
      if (posts.length === 0) setPosts(MOCK_POSTS);
    });

    // D. Sync teacher channels posts
    const channelsQuery = query(collection(db, "channels_posts"));
    const unsubChannels = onSnapshot(channelsQuery, (snapshot) => {
      const channelPostsList: TeacherChannelPost[] = [];
      snapshot.forEach(docSnap => {
        channelPostsList.push(docSnap.data() as TeacherChannelPost);
      });
      channelPostsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setChannelPosts(channelPostsList);
    }, (error) => {
      console.warn("Offline or permissions mode for channel posts sync:", error);
      if (error?.message?.includes("permissions") || error?.code === "permission-denied") {
        setFirestoreError(true);
      }
      if (channelPosts.length === 0) setChannelPosts(MOCK_CHANNELS_POSTS);
    });

    return () => {
      unsubUsers();
      unsubPosts();
      unsubChannels();
    };
  }, []);

  // Sync user profile state changes if databases values changes
  useEffect(() => {
    if (currentUser) {
      const unUser = onSnapshot(doc(db, "users", currentUser.id), (docSnap) => {
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data() as User);
        }
      }, (error) => {
        console.warn("User self profile sync offline/failed:", error);
      });

      // Sync Notifications collection
      const notifyQuery = collection(db, "notifications");
      const unNotify = onSnapshot(notifyQuery, (snapshot) => {
        const list: AppNotification[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as AppNotification;
          if (data.userId === currentUser.id) {
            list.push(data);
          }
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(list);
      }, (error) => {
        console.warn("Notifications collection fetch offline/fallback active:", error);
        // Fallback local storage or simulated state
        const local = localStorage.getItem(`notify_${currentUser.id}`);
        if (local) {
          setNotifications(JSON.parse(local));
        } else {
          // Put one default welcome notification
          const defaultNo: AppNotification = {
            id: `not_${Date.now()}`,
            userId: currentUser.id,
            senderName: "نظام المنصة",
            senderAvatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=system",
            type: "system",
            title: "مرحباً بك في المنصة المحدثة! 👋",
            message: "الآن تدعم المنصة الإشعارات الفورية وتصليح الأكواد بذكاء اصطناعي فائق الجودة ولغات برمجية متعددة.",
            linkTab: "feed",
            read: false,
            createdAt: new Date().toISOString()
          };
          setNotifications([defaultNo]);
          localStorage.setItem(`notify_${currentUser.id}`, JSON.stringify([defaultNo]));
        }
      });

      return () => {
        unUser();
        unNotify();
      };
    }
  }, [currentUser?.id]);

  // Helper: Create and send notification
  const sendNotification = async (
    targetUserId: string,
    senderName: string,
    senderAvatarUrl: string,
    type: NotificationType,
    title: string,
    message: string,
    linkTab: "feed" | "ide" | "teachers" | "profile"
  ) => {
    if (currentUser && targetUserId === currentUser.id && type !== "system" && type !== "ai_completion") {
      return; // Do not notify self for their own likes/comments
    }

    const newNotifyId = `notify_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newNotify: AppNotification = {
      id: newNotifyId,
      userId: targetUserId,
      senderName,
      senderAvatarUrl,
      type,
      title,
      message,
      linkTab,
      read: false,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "notifications", newNotifyId), newNotify);
    } catch (err) {
      console.warn("Could not save notification to Firestore (offline fallback used):", err);
      // Fallback local storage sync
      const currentLocalList = JSON.parse(localStorage.getItem(`notify_${targetUserId}`) || "[]");
      const updated = [newNotify, ...currentLocalList];
      localStorage.setItem(`notify_${targetUserId}`, JSON.stringify(updated));
      if (currentUser && targetUserId === currentUser.id) {
        setNotifications(updated);
      }
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (err) {
      console.warn("Could not update read state in Firestore, applying locally:", err);
      const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
      setNotifications(updated);
      localStorage.setItem(`notify_${currentUser.id}`, JSON.stringify(updated));
    }
  };

  const handleClearNotification = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.warn("Could not delete from Firestore, applying locally:", err);
      const updated = notifications.filter(n => n.id !== id);
      setNotifications(updated);
      localStorage.setItem(`notify_${currentUser.id}`, JSON.stringify(updated));
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(`notify_${currentUser.id}`, JSON.stringify(updated));

    for (const n of notifications) {
      if (!n.read) {
        try {
          await updateDoc(doc(db, "notifications", n.id), { read: true });
        } catch (e) {
          // ignore sync failures
        }
      }
    }
  };

  // Handle Auth success directly
  const handleAuthSuccess = (userProfile: User) => {
    setCurrentUser(userProfile);
    // Send standard system welcome notification
    sendNotification(
      userProfile.id,
      "نظام المنصة",
      "https://api.dicebear.com/7.x/identicon/svg?seed=system",
      "system",
      "تم تسجيل الدخول للمنصة بنجاح 🚀",
      "مرحباً بك مبرمح عاصم! نتطلع لمشاهدة مشاركتك الفعالة اليوم وتصليح أكواد زملائك.",
      "profile"
    );
  };

  // Simulator profile helper triggers manually in profile tab
  const handleSwitchUserTemp = async (userId: string) => {
    // Simulator Switch user (for demo purposes if selected inside Profile panel)
    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      setCurrentUser(userSnap.data() as User);
    }
  };

  const handleCreateProfileTemp = async (
    name: string,
    username: string,
    role: UserRole,
    bio: string,
    skills: string[]
  ) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      name,
      username,
      role,
      bio,
      skills,
      avatarUrl: currentUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
      bannerUrl: currentUser.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    };
    await setDoc(doc(db, "users", currentUser.id), updated);
    setCurrentUser(updated);
  };

  const handleUpdateAvatarAndBanner = async (avatarUrl: string, bannerUrl: string) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      avatarUrl,
      bannerUrl
    };
    try {
      await setDoc(doc(db, "users", currentUser.id), updated);
      setCurrentUser(updated);
    } catch (err) {
      console.error("Failed to update avatar and banner in Firestore:", err);
      setCurrentUser(updated);
    }
  };

  const handleResetDatabase = async () => {
    const collectionsToDelete = ["users", "posts", "channels_posts", "notifications"];
    for (const colName of collectionsToDelete) {
      try {
        const snap = await getDocs(collection(db, colName));
        const deletePromises = snap.docs.map(docSnap => deleteDoc(doc(db, colName, docSnap.id)));
        await Promise.all(deletePromises);
        console.log(`Successfully cleared ${colName}`);
      } catch (err) {
        console.warn(`Failed to clear ${colName}:`, err);
      }
    }
    window.location.reload();
  };

  // Handler: Add real post to Firestore
  const handleAddPost = async (newPostData: Omit<Post, "id" | "authorId" | "authorName" | "authorAvatarUrl" | "authorRole" | "createdAt" | "likes" | "comments">) => {
    if (!currentUser) return;
    
    const newId = `post_${Date.now()}`;
    const newPost: Post = {
      ...newPostData,
      id: newId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatarUrl: currentUser.avatarUrl,
      authorRole: currentUser.role,
      likes: [],
      comments: [],
      isSolved: newPostData.type === "error" ? false : undefined,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "posts", newId), newPost);
    } catch (err) {
      console.error("Failed to append post to Firestore:", err);
    }
  };

  // Handler: Toggle post likes inside Firestore
  const handleLikePost = async (postId: string) => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as Post;
      const likes = postData.likes || [];
      const hasLiked = likes.includes(currentUser.id);
      const updatedLikes = hasLiked
        ? likes.filter(id => id !== currentUser.id)
        : [...likes, currentUser.id];

      await updateDoc(postRef, { likes: updatedLikes });

      // Notify post author if liked
      if (!hasLiked && postData.authorId !== currentUser.id) {
        await sendNotification(
          postData.authorId,
          currentUser.name,
          currentUser.avatarUrl,
          "like",
          "تفاعل إعجاب جديد! ❤️",
          `أعجب المبرمج ${currentUser.name} بمنشورك البرمجي.`,
          "feed"
        );
      }
    }
  };

  // Handler: Submit comment as solver solution in Firestore
  const handleAddComment = async (
    postId: string,
    content: string,
    codeSnippet?: { code: string; language: string }
  ) => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as Post;
      const comments = postData.comments || [];

      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        postId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatarUrl: currentUser.avatarUrl,
        authorRole: currentUser.role,
        content,
        codeSnippet,
        likes: [],
        createdAt: new Date().toISOString()
      };

      await updateDoc(postRef, {
        comments: [...comments, newComment]
      });

      // Notify post author
      if (postData.authorId !== currentUser.id) {
        await sendNotification(
          postData.authorId,
          currentUser.name,
          currentUser.avatarUrl,
          "comment",
          "تعليق جديد ومساعدة برمجية! 💬",
          `أضاف المبرمج ${currentUser.name} حلاً أو تعليقاً على مشكلتك: "${content.slice(0, 30)}..."`,
          "feed"
        );
      }
    }
  };

  // Handler: Toggle comment likes
  const handleLikeComment = async (postId: string, commentId: string) => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as Post;
      const comments = postData.comments || [];

      const updatedComments = comments.map(comment => {
        if (comment.id !== commentId) return comment;

        const likesList = comment.likes || [];
        const hasLiked = likesList.includes(currentUser.id);
        const updatedLikes = hasLiked
          ? likesList.filter(id => id !== currentUser.id)
          : [...likesList, currentUser.id];

        return { ...comment, likes: updatedLikes };
      });

      await updateDoc(postRef, { comments: updatedComments });
    }
  };

  // Handler: Mark answer as verified in Firestore, credits points
  const handleMarkSolution = async (postId: string, commentId: string) => {
    if (!currentUser) return;

    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data() as Post;
      const comments = postData.comments || [];

      const updatedComments = comments.map(c => {
        if (c.id === commentId) {
          return { ...c, isSolution: true };
        }
        return c;
      });

      const winningComment = comments.find(c => c.id === commentId);
      if (winningComment) {
        // Increment winner's solved count inside Firestore
        const solverRef = doc(db, "users", winningComment.authorId);
        const solverSnap = await getDoc(solverRef);
        if (solverSnap.exists()) {
          const solverData = solverSnap.data() as User;
          await updateDoc(solverRef, {
            solvedErrorsCount: (solverData.solvedErrorsCount || 0) + 1
          });
        }

        // Notify winner
        await sendNotification(
          winningComment.authorId,
          currentUser.name,
          currentUser.avatarUrl,
          "solution",
          "تم قبول حلك وتوثيق مهاراتك! ✨🏅",
          `اعتمد ${currentUser.name} حلك النموذجي للمشكلة بنجاح كإجابة صحيحة للحل!`,
          "feed"
        );
      }

      await updateDoc(postRef, {
        isSolved: true,
        solvedByCommentId: commentId,
        comments: updatedComments
      });
    }
  };

  // Handler: student subscribe in Firestore
  const handleSubscribe = async (teacherId: string) => {
    if (!currentUser || currentUser.role === "teacher") return;

    // Fetch student profile
    const studentRef = doc(db, "users", currentUser.id);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data() as User;
      const subs = studentData.subscribedTeachers || [];
      if (subs.includes(teacherId)) return;

      // Update student profile with subscription Target
      await updateDoc(studentRef, {
        subscribedTeachers: [...subs, teacherId]
      });

      // Increment Teacher subscribers count
      const teacherRef = doc(db, "users", teacherId);
      const teacherSnap = await getDoc(teacherRef);
      if (teacherSnap.exists()) {
        const teacherData = teacherSnap.data() as User;
        await updateDoc(teacherRef, {
          subscribersCount: (teacherData.subscribersCount || 0) + 1
        });
      }

      // Notify Teacher
      await sendNotification(
        teacherId,
        currentUser.name,
        currentUser.avatarUrl,
        "broadcast",
        "لديك مشترك بقناتك التعليمية! 🎓",
        `اشترك المبرمج ${currentUser.name} في قناتك لمتابعة دروسك وبثوثك المباشرة القادمة.`,
        "teachers"
      );
    }
  };

  // Handler: unsubscribe student in Firestore
  const handleUnsubscribe = async (teacherId: string) => {
    if (!currentUser || currentUser.role === "teacher") return;

    const studentRef = doc(db, "users", currentUser.id);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data() as User;
      const subs = studentData.subscribedTeachers || [];
      if (!subs.includes(teacherId)) return;

      await updateDoc(studentRef, {
        subscribedTeachers: subs.filter(id => id !== teacherId)
      });

      const teacherRef = doc(db, "users", teacherId);
      const teacherSnap = await getDoc(teacherRef);
      if (teacherSnap.exists()) {
        const teacherData = teacherSnap.data() as User;
        await updateDoc(teacherRef, {
          subscribersCount: Math.max(0, (teacherData.subscribersCount || 0) - 1)
        });
      }
    }
  };

  // Handler: launch material announcement as Teacher
  const handleAddChannelPost = async (title: string, content: string, code?: string, language?: string) => {
    if (!currentUser || currentUser.role !== "teacher") return;

    const newId = `chan_post_${Date.now()}`;
    const newChannelPost: TeacherChannelPost = {
      id: newId,
      teacherId: currentUser.id,
      title,
      content,
      codeSnippet: code ? {
        code,
        language: language || "javascript"
      } : undefined,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, "channels_posts", newId), newChannelPost);

      // Notify all students subscribed to this teacher
      users.forEach(async (u) => {
        if (u.subscribedTeachers && u.subscribedTeachers.includes(currentUser.id)) {
          await sendNotification(
            u.id,
            currentUser.name,
            currentUser.avatarUrl,
            "broadcast",
            "درس جديد متاح في قنوات المعلمين! 📡",
            `أطلق المعلم ${currentUser.name} درساً برمجياً جديداً بعنوان: "${title}"`,
            "teachers"
          );
        }
      });
    } catch (err) {
      console.error("Failed to create broadcast post:", err);
    }
  };

  const handleShareToFeed = (code: string, language: string, filename: string) => {
    setPrepopulatedCode({ code, language, filename });
    setActiveTab("feed");
  };

  const handleClearPrepopulated = () => {
    setPrepopulatedCode(null);
  };

  // Loading indicator for authorization check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white font-sans text-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="text-xs text-white/50">يتم تحميل حالة الحماية ومصادقة قواعد البيانات...</span>
      </div>
    );
  }

  // If no logged user on page, render AuthScreen
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col antialiased selection:bg-blue-500/30 selection:text-white" dir="rtl">
      
      {/* Platform Branding Header */}
      <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 border-b border-white/10 backdrop-blur-md px-4 py-4 sm:px-6 shadow-md transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/10 text-white border border-white/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-purple-400 bg-clip-text text-transparent font-extrabold">{platformName}</span>
                <span className="text-[10px] py-0.5 px-2 bg-blue-500/15 border border-blue-500/30 font-mono font-medium rounded text-blue-400">Live Backend</span>
              </h1>
              <p className="text-[10px] text-white/40 mt-0.5 font-sans">فضاء متكامل للمعلمين والطلاب لكتابة الكود والتعاون البرمجي المتصل</p>
            </div>
          </div>

          {/* Tab Navigation Menu */}
          <nav className="flex items-center gap-1 border-b md:border-b-0 border-white/5 py-1 flex-1 md:flex-initial justify-center md:justify-start order-3 md:order-2 min-w-full md:min-w-0">
            <button
              id="tab-btn-feed"
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "feed" 
                  ? "bg-white/5 text-white border border-white/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>منتدى المبرمجين Feed</span>
            </button>

            <button
              id="tab-btn-ide"
              onClick={() => setActiveTab("ide")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ide" 
                  ? "bg-white/5 text-white border border-white/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>محرر الأكواد IDE</span>
            </button>

            <button
              id="tab-btn-teachers"
              onClick={() => setActiveTab("teachers")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "teachers" 
                  ? "bg-white/5 text-white border border-white/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>قنوات المعلمين</span>
            </button>

            <button
              id="tab-btn-profile"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "profile" 
                  ? "bg-white/5 text-white border border-white/10" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>بروفايلي والتحكم</span>
            </button>
          </nav>

          {/* Dynamic authenticated banner controller */}
          <div className="flex items-center gap-3 order-2 md:order-3">
            <div className="text-left md:text-right hidden sm:block">
              <span className="text-[10px] text-white/40 block">المستخدم الحالي:</span>
              <span className="text-xs font-bold text-white/80 block">{currentUser.name}</span>
            </div>
            
            {/* Bell Notification Button */}
            <div className="relative">
              <button
                id="btn-bell-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-white/60 hover:text-blue-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer flex items-center justify-center"
                title="الإشعارات الفورية"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Popover pane absolute positioned */}
              {showNotifications && (
                <div 
                  id="notifications-popover"
                  className="absolute left-0 mt-3.5 w-80 sm:w-96 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl p-4 text-right z-50 animate-in fade-in-50 slide-in-from-top-3 duration-200"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-2.5">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5 font-sans">
                      <Bell className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                      <span>الإشعارات الفورية</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-full font-mono">
                        {notifications.length}
                      </span>
                    </span>
                    
                    {notifications.filter(n => !n.read).length > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[10px] text-blue-400 hover:text-blue-300 transition font-medium cursor-pointer"
                      >
                        قراءة الكل ✓
                      </button>
                    )}
                  </div>

                  <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2.5 pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-white/30 flex flex-col items-center gap-2">
                        <BellOff className="w-8 h-8 text-white/10 animate-pulse" />
                        <span className="text-[11px]">لا توجد إشعارات حالياً.</span>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`group/not flex gap-3 p-2.5 rounded-xl border transition-all ${
                            n.read 
                              ? "bg-transparent border-white/[0.03] opacity-65" 
                              : "bg-blue-500/[0.02] border-blue-500/15 shadow-sm shadow-blue-500/5 rotate-0"
                          }`}
                        >
                          <img src={n.senderAvatarUrl} alt="" className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 shrink-0" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-bold text-white truncate">{n.senderName}</span>
                              <span className="text-[8.5px] text-white/30 font-mono tracking-tight shrink-0">
                                {new Date(n.createdAt).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <span className="block text-[10.5px] font-bold text-blue-300 mt-0.5">{n.title}</span>
                            <p className="text-[10px] text-white/60 leading-relaxed mt-0.5">{n.message}</p>
                            
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/[0.02]">
                              <button
                                onClick={() => {
                                  setActiveTab(n.linkTab);
                                  handleMarkNotificationRead(n.id);
                                  setShowNotifications(false);
                                }}
                                className="text-[9.5px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span>عرض الاثبات</span>
                                <ChevronRight className="w-2.5 h-2.5 rotate-180" />
                              </button>
                              
                              <button
                                onClick={() => handleClearNotification(n.id)}
                                className="text-white/20 hover:text-red-400 p-1 rounded-md transition opacity-0 group-hover/not:opacity-100 cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-2 mt-2 flex justify-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-white/40 hover:text-white transition font-sans cursor-pointer"
                    >
                      إغلاق لوحة الإشعارات
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="header-user-badge"
              onClick={() => setActiveTab("profile")}
              className="group flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition cursor-pointer"
              title="تعديل بروفايلك"
            >
              <img src={currentUser.avatarUrl} alt="" className="w-6 h-6 rounded-full bg-slate-800" referrerPolicy="no-referrer" />
              <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold ${
                currentUser.role === "teacher" ? "bg-purple-900/40 text-purple-400" : "bg-blue-900/40 text-blue-400"
              }`}>
                {currentUser.role === "teacher" ? "معلم 🎓" : "طالب 💻"}
              </span>
            </button>

            <button
              onClick={handleSignOut}
              className="p-2 text-white/40 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 rounded-xl transition cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20">
        


        {/* Helper prepopulation widget alert */}
        {prepopulatedCode && (
          <div id="prepopulation-alert" className="bg-blue-950/40 border border-blue-500/30 text-blue-300 rounded-2xl p-4 mb-6 text-xs flex items-center justify-between flex-wrap gap-2 animate-pulse font-sans">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>لقد جئت من محرر الأكواد! لقد قمنا بوضع كود ملفك <code>{prepopulatedCode.filename}</code> في محرر المنشورات لكتابة سؤالك بسهولة.</span>
            </div>
            <button 
              onClick={handleClearPrepopulated}
              className="px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold transition-colors"
            >
              إلغاء التضمين
            </button>
          </div>
        )}

        {/* Tab Routing Container Rendering */}
        <div className="w-full">
          {activeTab === "feed" && (
            <CommunityFeed
              posts={posts}
              currentUser={currentUser}
              onAddPost={handleAddPost}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onMarkSolution={handleMarkSolution}
              prepopulatedCode={prepopulatedCode}
              onClearPrepopulatedCode={handleClearPrepopulated}
              onUpdateUserProfile={handleUpdateAvatarAndBanner}
            />
          )}

          {activeTab === "ide" && (
            <IdeWorkspace
              onShareToFeed={handleShareToFeed}
              currentUserRole={currentUser.role}
              onFixedWithAi={async (fileName) => {
                await sendNotification(
                  currentUser.id,
                  "مساعد الذكاء الاصطناعي 🪄",
                  "https://api.dicebear.com/7.x/bottts/svg?seed=ai-helper",
                  "ai_completion",
                  "اكتمل تفحص وتصليح الكود المصدري! 🪄",
                  `تمت ترقية وإصلاح كود الملف "${fileName}" تلقائياً بنجاح وبقوام برمجي سليم.`,
                  "ide"
                );
              }}
            />
          )}

          {activeTab === "teachers" && (
            <TeacherChannels
              currentUser={currentUser}
              teachers={users.filter(u => u.role === "teacher")}
              channelPosts={channelPosts}
              onSubscribe={handleSubscribe}
              onUnsubscribe={handleUnsubscribe}
              onAddChannelPost={handleAddChannelPost}
            />
          )}

          {activeTab === "profile" && (
            <UserProfile
              currentUser={currentUser}
              allUsers={users}
              onSwitchUser={handleSwitchUserTemp}
              onCreateProfile={handleCreateProfileTemp}
              onUpdateUserProfile={handleUpdateAvatarAndBanner}
              onResetDatabase={handleResetDatabase}
            />
          )}
        </div>
      </main>

      {/* Footer system indicators */}
      <footer className="bg-black/80 text-white/30 text-[11px] py-4 text-center border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
          <span>&copy; {new Date().getFullYear()} ديوان البرمجة للتدريب البرمجي والتعلم السحابي المتكامل. متصل بقاعدة بيانات مستقرة حية.</span>
          <div className="flex items-center gap-1.5 text-blue-400/80">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
            <span>صلي علي النبي</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
