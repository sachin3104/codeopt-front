import { Cookie, Settings, Shield, Info, Database } from "lucide-react";
import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <section className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 sm:mb-16 lg:mb-20">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                    <Cookie className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-400" />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 sm:px-0">
                  Cookie Policy
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
                  Learn how Sixth Sense Enterprises OPC Pvt Ltd uses cookies and similar technologies on the optqo analytics code optimization platform.
                </p>
                <p className="text-xs sm:text-sm text-white/50 mt-3 sm:mt-4">
                  Effective Date: July 1, 2025 | Last Updated: July 1, 2025 | Effective Till: January 1, 2026
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">1. Introduction</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-white/80">
                    <p className="text-xs sm:text-sm">
                      Sixth Sense Enterprises OPC Pvt Ltd ("Company," "we," "us," or "our") operates the optqo analytics code optimization platform ("Service"). This Cookie Policy explains how we use cookies and similar tracking technologies on our website and platform. This policy should be read in conjunction with our Privacy Policy, which provides additional information about how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-xs sm:text-sm">
                      By continuing to use our Service, you consent to our use of cookies and similar technologies as described in this policy. You have the right to manage your cookie preferences and can modify your browser settings to control how cookies are handled during your use of our platform.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Database className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">2. What Are Cookies</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-white/80">
                    <p className="text-xs sm:text-sm">
                      Cookies are small text files that are stored on your device when you visit our website or use our platform. These files contain information that allows our website to recognize your browser and remember certain information about your preferences and activities. Cookies enable us to provide you with a more personalized and efficient experience when using our Service.
                    </p>
                    <p className="text-xs sm:text-sm">
                      Similar technologies include web beacons, pixel tags, and local storage objects, which serve comparable functions to cookies in helping us understand how our Service is used and to improve your experience. Throughout this policy, references to cookies include these similar tracking technologies unless specifically noted otherwise.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">3. Types of Cookies We Use</h2>
                  </div>
                  <div className="space-y-4 sm:space-y-6 text-white/80">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Essential Cookies</h3>
                      <p className="text-xs sm:text-sm mb-2">These cookies are necessary for the basic functionality of our Service and cannot be disabled without affecting your ability to use the platform. These cookies authenticate your login sessions, maintain your security settings, and ensure that core features of our code optimization platform operate correctly. Essential cookies enable you to navigate our website, access secure areas, and use fundamental features such as uploading code files and receiving optimization results.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Performance and Analytics Cookies</h3>
                      <p className="text-xs sm:text-sm mb-2">These cookies help us understand how users interact with our Service by collecting information about page visits, feature usage, and user behavior patterns. These cookies allow us to analyze traffic to our website, measure the effectiveness of our code optimization tools, and identify areas for improvement in our platform performance. The information collected through these cookies is typically aggregated and anonymized.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Functional Cookies</h3>
                      <p className="text-xs sm:text-sm mb-2">These cookies enhance your experience by remembering your preferences and settings within our platform. These cookies store information such as your preferred programming language selections, interface customizations, and previously uploaded code file preferences. Functional cookies ensure that you do not need to re-enter this information each time you visit our Service.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Security Cookies</h3>
                      <p className="text-xs sm:text-sm mb-2">These cookies protect our Service and your account from unauthorized access and fraudulent activities. These cookies help us detect suspicious behavior, prevent cross-site request forgery attacks, and maintain the integrity of your code optimization sessions. Security cookies work in conjunction with our broader security measures to protect your uploaded code and personal information.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">4. How We Use Cookies</h2>
                  </div>
                  <div className="space-y-4 sm:space-y-6 text-white/80">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Session Management</h3>
                      <p className="text-xs sm:text-sm mb-2">Cookies maintain your authenticated state while you use our platform, ensuring that you remain logged in as you navigate between different features of our code optimization Service. These cookies expire when you close your browser or log out of your account, providing security while maintaining convenience during your active session.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">User Experience Optimization</h3>
                      <p className="text-xs sm:text-sm mb-2">This involves using cookies to remember your preferences and settings, such as your preferred code display format, optimization parameters, and interface layout. This personalization ensures that our Service adapts to your working style and provides a consistent experience across your visits to our platform.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Platform Performance Monitoring</h3>
                      <p className="text-xs sm:text-sm mb-2">This utilizes cookies to collect technical information about how our Service performs on your device, including page load times, feature response rates, and system compatibility. This data helps us optimize our code processing algorithms and ensure that our LLM-powered optimization tools operate efficiently across different user environments.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Analytics and Improvement</h3>
                      <p className="text-xs sm:text-sm mb-2">This involves using cookies to gather insights about user behavior patterns, popular features, and common workflows within our Service. This information guides our development priorities and helps us enhance the effectiveness of our code analysis, optimization, transformation, and documentation capabilities.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">5. Third-Party Cookies</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-white/80">
                    <p className="text-xs sm:text-sm">
                      Our Service may include cookies from third-party service providers that support our platform operations. These external cookies are governed by the respective privacy policies of the third-party providers and may include analytics services, content delivery networks, and security monitoring tools.
                    </p>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">LLM API Integration</h3>
                      <p className="text-xs sm:text-sm mb-2">May involve cookies or similar technologies from our third-party language model providers to facilitate secure and efficient processing of your uploaded code. These cookies help maintain session continuity during code optimization processes and ensure reliable communication between our platform and external processing services.</p>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Infrastructure Support Services</h3>
                      <p className="text-xs sm:text-sm mb-2">Include cookies from cloud hosting providers, content delivery networks, and security services that help deliver our platform reliably and securely. These third-party cookies enable essential functions such as load balancing, DDoS protection, and global content distribution.</p>
                    </div>
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg border border-white/20">
                      <p className="text-xs sm:text-sm text-white/70">
                        We work with reputable third-party providers who maintain appropriate data protection standards and use cookies in accordance with applicable privacy regulations. However, we recommend reviewing the privacy policies of these third-party services to understand their specific cookie practices and data handling procedures.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">6. Managing Your Cookie Preferences</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-white/80">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Browser Settings</h3>
                      <p className="text-xs sm:text-sm mb-2">
                        Provide the primary method for controlling cookie behavior on our Service. Most modern browsers allow you to view, manage, and delete cookies through their settings menus. You can typically configure your browser to block all cookies, accept only certain types of cookies, or notify you when cookies are being set.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Cookie Categories</h3>
                      <p className="text-xs sm:text-sm mb-2">
                        Can often be managed individually through browser settings, allowing you to accept essential cookies while declining others. However, disabling certain categories of cookies may limit your ability to use some features of our Service, particularly those related to user preferences and platform optimization.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Regular Management</h3>
                      <p className="text-xs sm:text-sm mb-2">
                        Of your cookie preferences ensures that your settings remain aligned with your privacy preferences. You can clear existing cookies and modify your acceptance settings at any time, though this may require you to re-enter certain preferences and settings within our platform.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Platform-Specific Controls</h3>
                      <p className="text-xs sm:text-sm mb-2">
                        May be available within our Service to manage certain functional cookies and preferences. These controls complement your browser settings and provide additional options for customizing your experience while using our code optimization tools.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">7. Cookie Retention and Expiration</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-white/80">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Session Cookies</h3>
                      <p className="text-xs sm:text-sm mb-2">Expire automatically when you close your browser or log out of our Service. These temporary cookies are essential for maintaining your active session and ensuring secure access to your account and uploaded code during your visit to our platform.</p>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Persistent Cookies</h3>
                      <p className="text-xs sm:text-sm mb-2">Remain on your device for predetermined periods or until you manually delete them through your browser settings. These cookies typically store user preferences and settings that enhance your experience across multiple visits to our Service. The retention periods for persistent cookies vary based on their specific functions and purposes.</p>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Automatic Expiration</h3>
                      <p className="text-xs sm:text-sm mb-2">Occurs when cookies reach their predetermined expiration dates, at which point they are automatically removed from your device. We set appropriate expiration periods for different types of cookies based on their functions and your privacy interests.</p>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Manual Deletion</h3>
                      <p className="text-xs sm:text-sm mb-2">Can be performed through your browser settings at any time. Clearing cookies will remove stored preferences and may require you to re-enter certain information or reconfigure your settings within our platform.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white">8. Contact Information</h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4 text-white/80">
                    <p className="text-xs sm:text-sm">
                      If you have any questions about this Cookie Policy, please contact us:
                    </p>
                    <p className="text-xs sm:text-sm"><strong>Email:</strong> info@optqo.ai</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </div>
  );
} 