import { FileText, Scale, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";

export default function TermsOfServicePage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-20">
                <div className="flex justify-center mb-6">
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-4">
                    <Scale className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-6">
                  Terms of Service
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  These terms govern your use of Sixth Sense Enterprises OPC Pvt Ltd's optqo analytics code optimization platform.
                </p>
                <p className="text-sm text-white/50 mt-4">
                  Effective Date: July 1, 2025 | Last Updated: July 1, 2025 | Effective Till: January 1, 2026
                </p>
              </div>

              <div className="space-y-8">
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      By accessing or using our analytics code optimization platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms constitute a legally binding agreement between you ("User" or "you") and Sixth Sense Enterprises OPC Pvt Ltd ("Company," "we," "us," or "our").
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <p className="text-sm">
                      Our Service provides analytics professionals with code optimization tools powered by Large Language Model (LLM) APIs. The Service allows users to upload code written in Python, R, and SAS programming languages to receive the following functionality:
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code Analysis</h3>
                      <p className="text-sm mb-2">Performance insights including memory usage, space utilization, execution speed, and other parameters that impact code performance and efficiency.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code Optimization</h3>
                      <p className="text-sm mb-2">Automated enhancement of uploaded code with detailed explanations of improvements made, including quantified benefits in terms of execution time, server runtime, memory consumption, and associated cost savings.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code Transformation</h3>
                      <p className="text-sm mb-2">Conversion of code between supported programming languages (Python, R, and SAS) while maintaining functional equivalency.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code Documentation</h3>
                      <p className="text-sm mb-2">Addition of comprehensive comments and explanatory annotations to improve code readability and maintainability.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">3. User Accounts and Registration</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      To access certain features of the Service, you must create an account and provide accurate, complete registration information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">4. Acceptable Use Policy</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      You agree to use the Service only for lawful purposes and in accordance with these Terms. You may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>Upload code that contains malicious software, viruses, or other harmful components.</li>
                      <li>Submit code that infringes upon intellectual property rights of third parties or violates applicable laws or regulations.</li>
                      <li>Use the Service to process proprietary code belonging to your employer or third parties without proper authorization.</li>
                      <li>Attempt to reverse engineer, decompile, or extract the underlying algorithms or methodologies of our LLM-powered optimization engine.</li>
                      <li>Share your account credentials with unauthorized parties or attempt to circumvent usage limitations or security measures.</li>
                      <li>Upload code containing personally identifiable information, sensitive data, or confidential information unless you have explicit permission to do so.</li>
                      <li>Use the Service in any manner that could damage, disable, overburden, or impair our servers or networks.</li>
                    </ul>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">5. Intellectual Property Rights</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Your Code</h3>
                      <p className="text-sm mb-2">You retain ownership of the original code you upload to the Service. By uploading code, you grant us a limited, non-exclusive license to process, analyze, and optimize your code using our LLM-powered tools for the sole purpose of providing the requested services.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Service Output</h3>
                      <p className="text-sm mb-2">The optimized code, analysis reports, transformations, and documentation generated by our Service are provided to you under a non-exclusive license. While you may use these outputs for your intended purposes, the underlying methodologies, algorithms, and LLM models remain our proprietary technology.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Platform Technology</h3>
                      <p className="text-sm mb-2">All rights, title, and interest in the Service, including our optimization algorithms, user interface, and LLM integration, remain exclusively with the Company.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">6. Data Processing and Privacy</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code Processing</h3>
                      <p className="text-sm mb-2">Your uploaded code is processed using third-party LLM APIs to provide optimization, analysis, transformation, and documentation services. We implement appropriate technical and organizational measures to protect your code during processing.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Data Retention</h3>
                      <p className="text-sm mb-2">Uploaded code and generated outputs may be temporarily stored on our servers to facilitate service delivery. We will retain your data only for as long as necessary to provide the requested services, unless longer retention is required by law.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Third-Party LLM Providers</h3>
                      <p className="text-sm mb-2">Our Service utilizes external LLM APIs, which may process your code according to their respective privacy policies and terms of service. By using our Service, you acknowledge and consent to this processing.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Confidentiality</h3>
                      <p className="text-sm mb-2">We will not intentionally disclose your uploaded code or generated outputs to unauthorized third parties, except as required by law or as necessary to provide the Service.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">7. Service Availability and Performance</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      We strive to maintain high service availability but do not guarantee uninterrupted access to the Service. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control, including third-party LLM API availability.
                    </p>
                    <p className="text-sm">
                      Performance metrics, optimization suggestions, and cost savings estimates provided by the Service are based on algorithmic analysis and should be validated in your specific computing environment before implementation.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">8. Limitation of Liability</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <p className="text-sm">
                      The Service is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                    </p>
                    <p className="text-sm">
                      To the maximum extent permitted by law, our total liability for any claims arising from or related to the Service shall not exceed the amount you paid for the Service in the twelve months preceding the claim.
                    </p>
                    <p className="text-sm">
                      We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, even if we have been advised of the possibility of such damages.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">9. User Responsibilities and Warranties</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      You warrant that you have the necessary rights and permissions to upload and process any code submitted to the Service. You are solely responsible for ensuring that your use of optimized code complies with your organization's policies and applicable regulations.
                    </p>
                    <p className="text-sm">
                      You acknowledge that the Service provides automated suggestions and optimizations that should be reviewed and tested before implementation in production environments. We are not responsible for any issues arising from the implementation of suggested optimizations without proper validation.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">10. Indemnification</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">11. Termination</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      We may terminate or suspend your access to the Service at any time, with or without cause, including if you violate these Terms. Upon termination, your right to use the Service will cease immediately, and we may delete your account and associated data.
                    </p>
                    <p className="text-sm">
                      You may terminate your account at any time by contacting our support team or using the account deletion functionality within the Service.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">12. Modifications to Terms</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      We reserve the right to modify these Terms at any time. We will notify users of material changes through the Service or via email. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Scale className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">13. Governing Law and Dispute Resolution</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the Arbitration and Conciliation Act, 2015 of India, with the arbitration proceedings to be conducted in New Delhi, India.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">14. Miscellaneous Provisions</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Severability</h3>
                      <p className="text-sm mb-2">If any provision of these Terms is deemed invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Entire Agreement</h3>
                      <p className="text-sm mb-2">These Terms constitute the entire agreement between you and the Company regarding the Service and supersede all prior agreements and understandings.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Assignment</h3>
                      <p className="text-sm mb-2">You may not assign or transfer your rights under these Terms without our written consent. We may assign our rights and obligations under these Terms at any time.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Force Majeure</h3>
                      <p className="text-sm mb-2">We shall not be liable for any failure to perform due to circumstances beyond our reasonable control, including but not limited to acts of God, government actions, or third-party service interruptions.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">10. Contact Information</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    <p><strong>Email:</strong> info@optqo.ai</p>
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