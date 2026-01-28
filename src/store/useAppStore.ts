import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Route {
  path: string;
  name: string;
  icon: string;
  visible: boolean;
}

interface Permissions {
  can_write: boolean;
  can_manage_users: boolean;
  can_manage_articles: boolean;
}

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
    avatar_url?: string;
    bio?: string;
  } | null;
  token: string | null;
  routes: Route[];
  permissions: Permissions;
  setLogin: (isLogin: boolean) => void;
  setTeacher: (isTeacher: boolean) => void;
  setUserInfo: (userInfo: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role: string;
    created_at?: string;
    avatar_url?: string;
    bio?: string;
  } | null) => void;
  setToken: (token: string | null) => void;
  setRoutes: (routes: Route[]) => void;
  setPermissions: (permissions: Permissions) => void;
  logout: () => void;
  updateUserInfo: (userInfo: Partial<{
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role: string;
    created_at?: string;
    avatar_url?: string;
    bio?: string;
  }>) => void;
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
      routes: [],
      permissions: {
        can_write: false,
        can_manage_users: false,
        can_manage_articles: false
      },

      setLogin: (isLogin) => set({ isLogin }),
      setTeacher: (isTeacher) => set({ isTeacher }),
      setUserInfo: (userInfo) => set({
        userInfo: userInfo ? {
          ...userInfo,
          full_name: userInfo.full_name || '',
          created_at: userInfo.created_at || new Date().toISOString(),
          avatar_url: userInfo.avatar_url || undefined,
          bio: userInfo.bio || undefined
        } : null
      }),
      // @ts-ignore 这个可能确实有点问题，后续再说
      updateUserInfo: (userInfo) => set((state) => ({
        userInfo: userInfo ? {
          ...state.userInfo,
          ...userInfo
        } : state.userInfo
      })),
      setToken: (token) => set({ token }),
      setRoutes: (routes) => set({ routes }),
      setPermissions: (permissions) => set({ permissions }),
      logout: () => set({
        isLogin: false,
        isTeacher: false,
        userInfo: null,
        token: null,
        routes: [],
        permissions: {
          can_write: false,
          can_manage_users: false,
          can_manage_articles: false
        }
      }),

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