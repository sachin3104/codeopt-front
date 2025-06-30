import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../common/header/Header'
import CodeEditor from '../common/editor/CodeEditor'
import { Background } from '@/components/common/background'
import { ActionMenu } from '../common/actions/CommonActionButtons'
import LanguageSelectModal from '../common/actions/LanguageSelectModal'
import { useConvert } from '@/hooks/use-convert'
import { useAuth } from '@/hooks/use-auth'

const Layout: React.FC = () => {
  const [showConvertModal, setShowConvertModal] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    run: convertRun,
    isLoading: isConverting,
    error: convertError,
    clear: clearConvert,
  } = useConvert()

  // Handler invoked when modal's Convert button is clicked
  const handleConvert = async (from: string, to: string) => {
    await convertRun(from, to)
    navigate('/results/convert')
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
        onConvert={handleConvert}
      />

      {/* Main Content - Centered with equal distance from all sides */}
      <main className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl">
          {/* Main Content Container */}
          <div className="flex flex-col ">
            {/* Greeting Message Section */}
            <div className="mb-6">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Welcome to optqo, {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase() : 'Guest'}
                </h1>
                <p className="text-white/70 text-sm md:text-base">
                  Your AI powered Analytics/ML code assistant
                </p>
              </div>
            </div>
            
            {/* Code Editor Section */}
            <div className="h-[250px] w-full">
              <CodeEditor height="100%" />
            </div>
            
            {/* Action Buttons Section - Below Code Editor */}
            <div className="flex justify-center">
              <ActionMenu
                actions={['analyze', 'optimize', 'convert', 'document']}
                variant="homepage"  // or omit since it's default
                onOverrides={{
                  convert: async () => setShowConvertModal(true),
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
