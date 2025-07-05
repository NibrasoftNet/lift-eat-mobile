import React, { createContext, useContext, useState } from 'react';
import {
  ModalContextProps,
  ModalType,
} from '@/utils/interfaces/modals.interface';

const ModalContext = createContext<ModalContextProps>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
});

export function useModalContext() {
  return useContext(ModalContext);
}

interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType | undefined>();
  const [modalData, setModalData] = useState<any>();

  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setModalType(undefined);
    setModalData(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        modalType,
        modalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
