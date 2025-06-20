import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../common/header/Header'
import CodeEditor from '../common/editor/CodeEditor'
import { Background } from '@/components/common/background'
// import SubscriptionWidget from '../subscription/SubscriptionWidget'  // currently unused
import { ActionMenu } from '../common/actions/CommonActionButtons'
import LanguageSelectModal from '../common/actions/LanguageSelectModal'
import { useConvert } from '@/hooks/use-convert'

const Layout: React.FC = () => {
  const [showConvertModal, setShowConvertModal] = useState(false)
  const navigate = useNavigate()
  const {
    run: convertRun,
    isLoading: isConverting,
    error: convertError,
    clear: clearConvert,
  } = useConvert()

  // Handler invoked when modal’s Convert button is clicked
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

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        {/* Action Buttons Section */}
        <div className="mb-8">
        <ActionMenu
          actions={['analyze', 'optimize', 'convert', 'document']}
          variant="homepage"  // or omit since it's default
          onOverrides={{
            convert: async () => setShowConvertModal(true),
          }}
        />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Code Editor Section */}
          <div className="lg:col-span-4 h-[600px]">
            <CodeEditor height="100%" />
          </div>

          {/* Subscription Widget Section (commented out) */}
          {/* <div className="lg:col-span-1">
            <SubscriptionWidget variant="detailed" />
          </div> */}
        </div>
      </main>
    </div>
  )
}

export default Layout
