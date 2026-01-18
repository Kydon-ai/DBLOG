import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isLogin: boolean;
  isTeacher: boolean;
  userInfo: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
  } | null;
  token: string | null;
  setLogin: (isLogin: boolean) => void;
  setTeacher: (isTeacher: boolean) => void;
  setUserInfo: (userInfo: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role: string;
    created_at?: string;
  } | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface CounterState {
  clickNums: number;
  addNums: () => void;
  reduceNums: () => void;
  setClickNums: (nums: number) => void;
}

interface ArticleState {
  articleId: number;
  setArticleId: (id: number) => void;
}

interface DemoState {
  myCount: number;
  increment: () => void;
  decrement: () => void;
}

interface TestState {
  name: string;
  age: number;
  avatar: string;
  setName: (name: string) => void;
  setAge: (age: number) => void;
  setAvatar: (avatar: string) => void;
}

interface AppStore extends UserState, CounterState, ArticleState, DemoState, TestState { }

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // User state
      isLogin: false,
      isTeacher: false,
      userInfo: null,
      token: null,

      setLogin: (isLogin) => set({ isLogin }),
      setTeacher: (isTeacher) => set({ isTeacher }),
      setUserInfo: (userInfo) => set({ userInfo: userInfo ? { ...userInfo, full_name: userInfo.full_name || '', created_at: userInfo.created_at || new Date().toISOString() } : null }),
      setToken: (token) => set({ token }),
      logout: () => set({ isLogin: false, isTeacher: false, userInfo: null, token: null }),

      // Counter state
      clickNums: 0,
      addNums: () => set((state) => ({ clickNums: state.clickNums + 1 })),
      reduceNums: () => set((state) => ({ clickNums: state.clickNums - 1 })),
      setClickNums: (clickNums) => set({ clickNums }),

      // Article state
      articleId: -1,
      setArticleId: (articleId) => set({ articleId }),

      // Demo state
      myCount: 0,
      increment: () => set((state) => ({ myCount: state.myCount + 1 })),
      decrement: () => set((state) => ({ myCount: state.myCount - 1 })),

      // Test state
      name: 'test',
      age: 18,
      avatar: '/img/user.png',
      setName: (name) => set({ name }),
      setAge: (age) => set({ age }),
      setAvatar: (avatar) => set({ avatar }),
    }),
    {
      name: 'app-storage',
    }
  )
);
