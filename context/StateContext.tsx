
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, LearningPath, ResourceItem, ModuleContent } from '../types';

interface AppState {
  user: UserProfile;
  activePath: LearningPath | null;
  bookmarks: ResourceItem[];
  addXP: (amount: number) => void;
  setPath: (path: LearningPath) => void;
  updateModuleStatus: (moduleIndex: number, status: 'active' | 'completed') => void;
  saveModuleContent: (moduleIndex: number, content: ModuleContent) => void;
  toggleBookmark: (resource: ResourceItem) => void;
  isBookmarked: (resourceId: string) => boolean;
}

const defaultUser: UserProfile = {
  name: 'Alex Chen',
  role: 'Machine Learning Engineer',
  bio: 'Passionate about bringing AI to the edge. Exploring the intersection of robotics and large language models.',
  avatarUrl: 'https://picsum.photos/200',
  xp: 12450,
  streak: 14,
  interests: ['Reinforcement Learning', 'Edge AI', 'Computer Vision', 'Rust']
};

const StateContext = createContext<AppState | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cognosys_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [activePath, setActivePathState] = useState<LearningPath | null>(() => {
    const saved = localStorage.getItem('cognosys_path');
    return saved ? JSON.parse(saved) : null;
  });

  const [bookmarks, setBookmarks] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('cognosys_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cognosys_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (activePath) {
        localStorage.setItem('cognosys_path', JSON.stringify(activePath));
    } else {
        localStorage.removeItem('cognosys_path');
    }
  }, [activePath]);

  useEffect(() => {
    localStorage.setItem('cognosys_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addXP = (amount: number) => {
    setUser(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const setPath = (path: LearningPath) => {
    setActivePathState(path);
  };

  const updateModuleStatus = (moduleIndex: number, status: 'active' | 'completed') => {
    if (!activePath) return;
    
    const newModules = [...activePath.modules];
    const oldStatus = newModules[moduleIndex].status;
    
    newModules[moduleIndex] = { ...newModules[moduleIndex], status };
    
    // Unlock next module if completing current
    if (status === 'completed' && moduleIndex + 1 < newModules.length) {
        if (newModules[moduleIndex + 1].status === 'locked' || !newModules[moduleIndex + 1].status) {
             newModules[moduleIndex + 1].status = 'active';
        }
    }

    setActivePathState({ ...activePath, modules: newModules });
    
    if (status === 'completed' && oldStatus !== 'completed') {
        addXP(100); // Award XP for completion
    }
  };

  const saveModuleContent = (moduleIndex: number, content: ModuleContent) => {
      if (!activePath) return;
      const newModules = [...activePath.modules];
      newModules[moduleIndex] = { ...newModules[moduleIndex], content };
      setActivePathState({ ...activePath, modules: newModules });
  };

  const toggleBookmark = (resource: ResourceItem) => {
    setBookmarks(prev => {
        const exists = prev.find(r => r.id === resource.id);
        if (exists) {
            return prev.filter(r => r.id !== resource.id);
        } else {
            return [...prev, resource];
        }
    });
  };

  const isBookmarked = (resourceId: string) => {
      return bookmarks.some(r => r.id === resourceId);
  }

  return (
    <StateContext.Provider value={{ 
        user, 
        activePath, 
        bookmarks, 
        addXP, 
        setPath, 
        updateModuleStatus, 
        saveModuleContent,
        toggleBookmark,
        isBookmarked
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
