import { Shield, Eye, Lock, Database, Users, FileText } from "lucide-react";
import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";

export default function PrivacyPolicyPage() {
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
                    <Shield className="h-12 w-12 text-blue-400" />
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-6">
                  Privacy Policy
                </h1>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Sixth Sense Enterprises OPC Pvt Ltd is committed to protecting your privacy and ensuring the security of your data on the optqo analytics code optimization platform.
                </p>
                <p className="text-sm text-white/50 mt-4">
                  Effective Date: July 1, 2025 | Last Updated: July 1, 2025 | Effective Till: January 1, 2026
                </p>
              </div>

              <div className="space-y-8">
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      Sixth Sense Enterprises OPC Pvt Ltd ("Company," "we," "us," or "our") operates the optqo analytics code optimization platform ("Service"). This Privacy Policy explains how we collect, use, process, and protect your personal information when you use our Service. We are committed to protecting your privacy and ensuring the security of your data in accordance with applicable data protection laws.
                    </p>
                    <p className="text-sm">
                      This Privacy Policy applies to all users of our Service and describes our practices regarding the collection and processing of information through our website and platform. By using our Service, you consent to the collection and use of information as described in this Privacy Policy.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
                      <p className="text-sm mb-2">When you create an account, we collect personal information including your name, email address, company affiliation, and professional details. This information is necessary to establish and maintain your user account and provide personalized service.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code and Technical Data</h3>
                      <p className="text-sm mb-2">We collect and process the programming code you upload to our platform, written in Python, R, or SAS languages. This code is processed through our LLM-powered optimization engine to provide analysis, optimization suggestions, code transformation, and documentation services. We also collect metadata associated with your code submissions, including file names, timestamps, and performance metrics.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Usage Data</h3>
                      <p className="text-sm mb-2">We automatically collect information about how you interact with our Service, including pages visited, features used, time spent on the platform, and patterns of service utilization. This data helps us improve our Service and understand user needs.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Technical Information</h3>
                      <p className="text-sm mb-2">We collect technical data such as your IP address, browser type and version, device information, operating system, and referring website. This information is collected through standard web technologies including cookies and similar tracking mechanisms.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Communication Data</h3>
                      <p className="text-sm mb-2">When you contact us through our support channels or communicate with our team, we collect and store the content of these communications along with associated metadata to provide support and improve our services.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Service Delivery</h3>
                      <p className="text-sm mb-2">We use your uploaded code and account information to provide our core services including code analysis, optimization, transformation between programming languages, and automated documentation generation. Your code is processed through third-party LLM APIs to deliver these analytical and optimization services.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Service Improvement</h3>
                      <p className="text-sm mb-2">We analyze usage patterns and user feedback to enhance our platform functionality, develop new features, and improve the accuracy of our optimization algorithms. This analysis is conducted on aggregated and anonymized data whenever possible.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Account Management</h3>
                      <p className="text-sm mb-2">We use your personal information to maintain your account, authenticate your access to the Service, and provide customer support. This includes sending service-related communications and responding to your inquiries.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Performance Analytics</h3>
                      <p className="text-sm mb-2">We utilize technical and usage data to monitor system performance, identify potential issues, and optimize our infrastructure to ensure reliable service delivery.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Legal Compliance</h3>
                      <p className="text-sm mb-2">We may process your information to comply with applicable laws, regulations, legal processes, or governmental requests, and to protect our rights and interests or those of our users.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">4. Data Processing Through Third-Party LLM APIs</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      Our Service relies on third-party Large Language Model APIs to provide code optimization, analysis, and transformation capabilities. When you upload code to our platform, this information is transmitted to and processed by external LLM providers to generate the requested analytical outputs and optimization recommendations.
                    </p>
                    <p className="text-sm">
                      These third-party LLM providers operate under their own privacy policies and terms of service. While we implement contractual safeguards and technical measures to protect your data during this processing, you acknowledge that your code will be processed by these external services as part of our Service delivery.
                    </p>
                    <p className="text-sm">
                      We work exclusively with reputable LLM providers who maintain appropriate security standards and data protection practices. However, we cannot control the internal operations of these third-party services beyond the contractual protections we have established.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">5. Data Sharing and Disclosure</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Third-Party Service Providers</h3>
                      <p className="text-sm mb-2">We share your information with carefully selected service providers who assist in operating our platform, including cloud hosting providers, LLM API services, and technical support vendors. These providers are bound by contractual obligations to protect your information and use it solely for the purposes of providing services to us.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Business Transfers</h3>
                      <p className="text-sm mb-2">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity as part of the business transaction. We will provide notice of such transfers and any changes to data handling practices.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Legal Requirements</h3>
                      <p className="text-sm mb-2">We may disclose your information when required by law, legal process, or governmental request, or when we believe disclosure is necessary to protect our rights, comply with judicial proceedings, or respond to claims of intellectual property infringement.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Consent-Based Sharing</h3>
                      <p className="text-sm mb-2">We may share your information with additional third parties when you provide explicit consent for such sharing or when you direct us to integrate with other services or platforms.</p>
                    </div>
                    
                    <div className="mt-4 p-4 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg border border-white/20">
                      <p className="text-sm text-white/70">
                        We do not sell, rent, or trade your personal information to third parties for their marketing purposes. Any sharing of information is conducted in accordance with applicable data protection laws and the terms outlined in this Privacy Policy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">6. Data Security and Protection</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      We implement comprehensive security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. Our security practices include encryption of data in transit and at rest, secure authentication mechanisms, regular security assessments, and restricted access controls for our personnel.
                    </p>
                    <p className="text-sm">
                      Your uploaded code and generated outputs are processed and stored using industry-standard security protocols. We maintain secure connections with third-party LLM providers and implement additional safeguards to protect your code during external processing.
                    </p>
                    <p className="text-sm">
                      While we employ robust security measures, no system can guarantee complete security. We continuously monitor and update our security practices to address emerging threats and maintain the protection of your data.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">7. Data Retention and Deletion</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Account Data</h3>
                      <p className="text-sm mb-2">We retain your account information for as long as your account remains active or as needed to provide our services. Upon account deletion, we will remove your personal information from our active systems within a reasonable timeframe.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Code and Processing Data</h3>
                      <p className="text-sm mb-2">Uploaded code and generated outputs are retained temporarily to facilitate service delivery and may be cached for performance optimization. We delete this data according to our established retention schedules unless longer retention is required for legal compliance.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Usage and Technical Data</h3>
                      <p className="text-sm mb-2">We may retain aggregated and anonymized usage data for analytical purposes and service improvement. This data cannot be used to identify individual users and may be retained indefinitely for business intelligence purposes.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Legal Hold</h3>
                      <p className="text-sm mb-2">We may retain information longer when required by law, legal process, or when necessary to resolve disputes or enforce our agreements.</p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">8. Your Rights and Choices</h2>
                  </div>
                  <div className="space-y-6 text-white/80">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Access and Portability</h3>
                      <p className="text-sm mb-2">You have the right to access the personal information we hold about you and to receive a copy of this information in a structured, commonly used format.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Correction and Updates</h3>
                      <p className="text-sm mb-2">You may update or correct your account information at any time through your account settings or by contacting our support team. We will promptly update our records upon verification of requested changes.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Deletion Rights</h3>
                      <p className="text-sm mb-2">You may request deletion of your personal information, subject to our legitimate business needs and legal obligations. Account deletion will result in the removal of your personal data from our active systems.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Processing Restrictions</h3>
                      <p className="text-sm mb-2">You may request restrictions on how we process your information in certain circumstances, such as when you contest the accuracy of the data or object to processing for specific purposes.</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Communication Preferences</h3>
                      <p className="text-sm mb-2">You can control certain communications from us through your account settings or by following unsubscribe instructions in our emails.</p>
                    </div>
                    
                    <div className="mt-4 p-4 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg border border-white/20">
                      <p className="text-sm text-white/70">
                        To exercise these rights, please contact us using the information provided in the Contact section of this Privacy Policy. We will respond to your requests in accordance with applicable data protection laws.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Database className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">9. International Data Transfers</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      Our Service operates globally with infrastructure and service providers located in multiple jurisdictions. Your information may be transferred to and processed in countries other than your country of residence, including jurisdictions that may have different data protection laws.
                    </p>
                    <p className="text-sm">
                      When we transfer personal information internationally, we implement appropriate safeguards to ensure the protection of your data, including contractual protections and compliance with applicable data transfer regulations.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lock className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">10. Cookies and Tracking Technologies</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      We use cookies and similar tracking technologies to enhance your experience on our platform, analyze usage patterns, and provide personalized features. These technologies help us remember your preferences, authenticate your sessions, and gather analytical data about Service usage.
                    </p>
                    <p className="text-sm">
                      You can control cookie settings through your browser preferences, though disabling certain cookies may limit some functionality of our Service. Our platform may use both session cookies that expire when you close your browser and persistent cookies that remain until deleted or expired.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">11. Children's Privacy</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      Our Service is designed for professional analytics users and is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without appropriate consent, we will take steps to delete such information promptly.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">12. Changes to This Privacy Policy</h2>
                  </div>
                  <div className="space-y-4 text-white/80">
                    <p className="text-sm">
                      We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or business operations. We will notify users of material changes through the Service, email communication, or other appropriate channels.
                    </p>
                    <p className="text-sm">
                      Your continued use of the Service after such notifications constitutes acceptance of the updated Privacy Policy. We encourage you to review this Privacy Policy regularly to stay informed about how we protect your information.
                    </p>
                  </div>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">13. Data Protection Officer and Contact Information</h2>
                  <p className="text-white/70 mb-6">
                    For questions about this Privacy Policy, requests regarding your personal information, or concerns about our data practices, please contact us at:
                  </p>
                  <div className="space-y-2 text-sm text-white/60">
                    <p><strong>Email:</strong> info@optqo.ai</p>
                    <p><strong>India Office:</strong> 4th Floor, Rectangle 1, Commercial Complex D Floor, Saket, New Delhi 110017, India</p>
                    <p><strong>Dubai Office:</strong> Sixth Sense Management Consultancy L.L.C-FZ, Meydan Grandstand, 6th Floor, Meydan Road, Nad Al Sheba, Dubai, U.A.E.</p>
                  </div>
                  <p className="text-sm text-white/70 mt-4">
                    We are committed to addressing your privacy concerns and will respond to your inquiries in accordance with applicable data protection laws and regulations.
                  </p>
                </div>

                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8 text-center">
                  <p className="text-sm text-white/50 italic">
                    This Privacy Policy is effective as of the date indicated above and governs the collection and use of information through our Service.
                  </p>
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