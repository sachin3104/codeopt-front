import React, { useState } from 'react'
import Header from '../common/header/Header'
import CodeEditor from '../common/editor/CodeEditor'
import { Background } from '@/components/common/background'
import { ActionMenu } from '../common/actions'
import LanguageSelectModal from '../common/actions/LanguageSelectModal'
import { useConvert } from '@/hooks/use-convert'

const Layout: React.FC = () => {
  const [showConvertModal, setShowConvertModal] = useState(false)
  const { clear: clearConvert } = useConvert()

  const openConvertModal = async () => {
    clearConvert()
    setShowConvertModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Header />

      <LanguageSelectModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
      />

      <main className="flex items-center justify-center flex-1 px-2 sm:px-4 md:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-4 sm:pb-6 md:pb-8">
        <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl">
          <div className="flex flex-col space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
            <div className="text-center px-2 sm:px-4 md:px-6">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-2 md:mb-3 leading-tight tracking-tight">
                Welcome to optqo
              </h1>
              <p className="text-white/70 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                Your AI powered Analytics/ML code assistant
              </p>
            </div>
            
            <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
              <div className="h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[260px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
                <CodeEditor height="100%" />
              </div>
            </div>
            
            <div className="flex justify-center px-2 xs:px-3 sm:px-4 md:px-6">
              <ActionMenu
                actions={['analyze', 'optimize', 'convert', 'document']}
                variant="homepage"
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