import { useCallback, useState } from "react";

/**
 * Custom Hook: useModal
 * Manages modal visibility, selected modal item/payload, and modal lifecycle.
 *
 * @param {boolean} [initialState=false]
 * @returns {{
 *   isOpen: boolean,
 *   data: any,
 *   openModal: (modalData?: any) => void,
 *   closeModal: () => void,
 *   toggleModal: () => void
 * }}
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(Boolean(initialState));
  const [data, setData] = useState(null);

  const openModal = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
}
