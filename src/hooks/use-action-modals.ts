import { useState } from 'react'
import { ModalType } from '@/types/action'

export function useActionModals() {
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showRequestLimitModal, setShowRequestLimitModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  
  const openModal = (type: ModalType) => {
    switch (type) {
      case 'character-limit': 
        setShowLimitModal(true)
        break
      case 'request-limit': 
        setShowRequestLimitModal(true)
        break
      case 'language-not-supported': 
        setShowLanguageModal(true)
        break
    }
  }
  
  const closeModal = (type: ModalType) => {
    switch (type) {
      case 'character-limit': 
        setShowLimitModal(false)
        break
      case 'request-limit': 
        setShowRequestLimitModal(false)
        break
      case 'language-not-supported': 
        setShowLanguageModal(false)
        break
    }
  }
  
  const closeAllModals = () => {
    setShowLimitModal(false)
    setShowRequestLimitModal(false)
    setShowLanguageModal(false)
  }
  
  return {
    modals: { 
      showLimitModal, 
      showRequestLimitModal, 
      showLanguageModal 
    },
    openModal,
    closeModal,
    closeAllModals
  }
} 