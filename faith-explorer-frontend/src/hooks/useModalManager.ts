import { useState, useCallback } from 'react';

export type ModalType = 'subscription' | 'about' | 'settings' | 'mobileMenu' | 'desktopMenu';

export function useModalManager() {
  const [activeModals, setActiveModals] = useState<Set<ModalType>>(new Set());

  const openModal = useCallback((modal: ModalType) => {
    setActiveModals(prev => new Set(prev).add(modal));
  }, []);

  const closeModal = useCallback((modal: ModalType) => {
    setActiveModals(prev => {
      const next = new Set(prev);
      next.delete(modal);
      return next;
    });
  }, []);

  const toggleModal = useCallback((modal: ModalType) => {
    setActiveModals(prev => {
      const next = new Set(prev);
      if (next.has(modal)) {
        next.delete(modal);
      } else {
        next.add(modal);
      }
      return next;
    });
  }, []);

  const closeAll = useCallback(() => {
    setActiveModals(new Set());
  }, []);

  const isOpen = useCallback((modal: ModalType) => {
    return activeModals.has(modal);
  }, [activeModals]);

  return {
    openModal,
    closeModal,
    toggleModal,
    closeAll,
    isOpen,
  };
}

