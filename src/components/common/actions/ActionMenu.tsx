import React from 'react'
import { ActionKey, ActionVariant } from '@/types/action'
import { useActionValidation } from '@/hooks/use-action-validation'
import { useActionModals } from '@/hooks/use-action-modals'
import { useActionDescriptors } from '@/hooks/use-action-descriptors'
import { getContainerStyles, getInnerContainerStyles } from '@/utils/action-utils'
import { HomepageActionButton } from './HomepageActionButton'
import { LayoutActionButton } from './LayoutActionButton'
import { ActionModalsContainer } from './ActionModalsContainer'

interface ActionMenuProps {
  actions: ActionKey[]
  variant?: ActionVariant
  /**
   * Supply custom run logic for actions, e.g. convert => open modal
   */
  onOverrides?: Partial<Record<ActionKey, () => Promise<void>>>
}

/**
 * Renders a horizontal set of action buttons with proper validation and modal handling.
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({ 
  actions, 
  variant = 'homepage',
  onOverrides 
}) => {
  const { validateAction, isCodeEmpty, detectedLanguage, code } = useActionValidation()
  const { modals, openModal, closeModal } = useActionModals()
  const descriptors = useActionDescriptors(onOverrides)

  const handleAction = async (run: () => Promise<void>) => {
    const validation = validateAction()
    if (validation !== 'valid') {
      openModal(validation)
      return
    }
    await run()
  }

  return (
    <>
      <div className={getContainerStyles(variant)}>
        <div className={getInnerContainerStyles(variant)}>
          {actions.map(key => {
            const { label, icon: Icon, isLoading, run } = descriptors[key]
            
            // Use HomepageActionButton for homepage variant
            if (variant === 'homepage') {
              return (
                <HomepageActionButton
                  key={key}
                  onClick={() => handleAction(run)}
                  disabled={isLoading || isCodeEmpty}
                  icon={Icon}
                  label={label}
                  subname={descriptors[key].subname}
                />
              )
            }

            // Use regular button for layout variant
            return (
              <LayoutActionButton
                key={key}
                onClick={() => handleAction(run)}
                disabled={isLoading || isCodeEmpty}
                icon={Icon}
                label={label}
                variant={variant}
              />
            )
          })}
        </div>
      </div>

      <ActionModalsContainer
        modals={modals}
        onClose={closeModal}
        code={code}
        detectedLanguage={detectedLanguage}
      />
    </>
  )
} 