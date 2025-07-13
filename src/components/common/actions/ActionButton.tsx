import React from 'react'
import { ActionKey, ActionVariant } from '@/types/action'
import { useActionValidation } from '@/hooks/use-action-validation'
import { useActionModals } from '@/hooks/use-action-modals'
import { useActionDescriptors } from '@/hooks/use-action-descriptors'
import { HomepageActionButton } from './HomepageActionButton'
import { LayoutActionButton } from './LayoutActionButton'
import { ActionModalsContainer } from './ActionModalsContainer'

interface ActionButtonProps {
  action: ActionKey
  variant?: ActionVariant
  onOverride?: () => Promise<void>
}

/**
 * Renders a button for a single action with proper validation and modal handling.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({ 
  action, 
  variant = 'homepage',
  onOverride 
}) => {
  const { validateAction, isCodeEmpty, detectedLanguage, code } = useActionValidation()
  const { modals, openModal, closeModal } = useActionModals()
  const descriptors = useActionDescriptors(onOverride ? { [action]: onOverride } : {})
  const { label, icon: Icon, isLoading, run } = descriptors[action]

  const handleAction = async () => {
    const validation = validateAction()
    if (validation !== 'valid') {
      openModal(validation)
      return
    }
    await run()
  }

  return (
    <>
      {variant === 'homepage' ? (
        <HomepageActionButton
          onClick={handleAction}
          disabled={isLoading || isCodeEmpty}
          icon={Icon}
          label={label}
          subname={descriptors[action].subname}
        />
      ) : (
        <LayoutActionButton
          onClick={handleAction}
          disabled={isLoading || isCodeEmpty}
          icon={Icon}
          label={label}
          variant={variant}
        />
      )}
      
      <ActionModalsContainer
        modals={modals}
        onClose={closeModal}
        code={code}
        detectedLanguage={detectedLanguage}
      />
    </>
  )
} 