import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../common/header/Header'
import CodeEditor from '../common/editor/CodeEditor'
import { Background } from '@/components/common/background'
import { ActionMenu } from '../common/actions/CommonActionButtons'
import LanguageSelectModal from '../common/actions/LanguageSelectModal'
import { useAuth } from '@/hooks/use-auth'
import { useConvert } from '@/hooks/use-convert'

const Layout: React.FC = () => {
  const [showConvertModal, setShowConvertModal] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clear: clearConvert } = useConvert()

  const openConvertModal = async () => {
    clearConvert()         // wipe out the _old_ result only once, when we open
    setShowConvertModal(true)
  }

  return (
    <div className="min-h-screen">
      <Background />
      {/* Header */}
      <Header />

      {/* Centralized Language Conversion Modal */}
      <LanguageSelectModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
      />

      {/* Main Content - Centered with equal distance from all sides */}
      <main className="flex items-center justify-center min-h-screen px-3 sm:px-4 lg:px-6">
        <div className="w-full max-w-5xl">
          {/* Main Content Container */}
          <div className="flex flex-col">
            {/* Greeting Message Section */}
            <div className="mb-4 sm:mb-6">
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 sm:mb-2">
                  Welcome to optqo, {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase() : 'Guest'}
                </h1>
                <p className="text-white/70 text-xs sm:text-sm md:text-base">
                  Your AI powered Analytics/ML code assistant
                </p>
              </div>
            </div>
            
            {/* Code Editor Section */}
            <div className="h-[200px] sm:h-[250px] w-full">
              <CodeEditor height="100%" />
            </div>
            
            {/* Action Buttons Section - Below Code Editor */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <ActionMenu
                actions={['analyze', 'optimize', 'convert', 'document']}
                variant="homepage"  // or omit since it's default
                onOverrides={{
                  convert: openConvertModal,
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout
