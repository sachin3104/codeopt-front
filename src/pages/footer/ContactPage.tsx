import { Mail, MapPin, Send, Linkedin } from "lucide-react";
import Header from "../../components/landing-page/Header";
import Footer from "../../components/landing-page/Footer";
import { Background } from "../../components/common/background";
import api from "../../api/client";
import { useState } from "react";
import { toast } from "sonner";

// Custom Discord Icon
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
  </svg>
);

// Custom X (Twitter) Icon
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <Background />
      
      <div className="relative flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <section className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-3 sm:mb-4 px-2 sm:px-0">
                  Get in Touch
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto px-4 sm:px-0">
                  Have questions about optqo? We're here to help you optimize your code and workflow.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Contact Info & Social Links */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <div className="space-y-6 sm:space-y-8">
                    {/* Contact Info */}
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Contact Information</h2>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">Email</p>
                            <p className="text-white/70 text-xs sm:text-sm">info@optqo.ai</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">India Office</p>
                            <p className="text-white/70 text-xs sm:text-sm">4th Floor, Rectangle 1</p>
                            <p className="text-white/70 text-xs sm:text-sm">Saket, New Delhi 110017</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">Dubai Office</p>
                            <p className="text-white/70 text-xs sm:text-sm">Sixth Sense Management</p>
                            <p className="text-white/70 text-xs sm:text-sm">Meydan Grandstand, Dubai</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Connect With Us</h2>
                      
                      <div className="space-y-3">
                        <a 
                          href="https://discord.gg/jUZRnjeG5X" 
                          target="_blank"   
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:bg-white/10 transition-all duration-300 rounded-lg text-white border border-white/20"
                        >
                          <DiscordIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">Discord</p>
                            <p className="text-white/70 text-xs sm:text-sm">Join our community</p>
                          </div>
                        </a>
                        
                        <a 
                          href="https://x.com/optqo_ai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:bg-white/10 transition-all duration-300 rounded-lg text-white border border-white/20"
                        >
                          <XIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">X</p>
                            <p className="text-white/70 text-xs sm:text-sm">Follow for updates</p>
                          </div>
                        </a>
                        
                        <a 
                          href="https://www.linkedin.com/company/optqo-ai" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:bg-white/10 transition-all duration-300 rounded-lg text-white border border-white/20"
                        >
                          <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                          <div>
                            <p className="font-medium text-sm sm:text-base">LinkedIn</p>
                            <p className="text-white/70 text-xs sm:text-sm">Professional network</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send us a Message</h2>
                  <ContactForm />
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

// ContactForm component
function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/email-inquiry/contact", {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      toast.success("Your message has been sent! We'll get back to you soon.");
      setForm({ firstName: "", lastName: "", email: "", phone: "", subject: "", message: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        id="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        required
        className="bg-black/40 border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-sm sm:text-base h-10 sm:h-12 col-span-1"
      />
      <input
        type="text"
        id="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        required
        className="bg-black/40 border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-sm sm:text-base h-10 sm:h-12 col-span-1"
      />
      <input
        type="email"
        id="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
        className="col-span-2 bg-black/40 border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-sm sm:text-base h-10 sm:h-12"
      />
      <input
        type="tel"
        id="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="col-span-2 bg-black/40 border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-sm sm:text-base h-10 sm:h-12"
      />
      <input
        type="text"
        id="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange}
        required
        className="col-span-2 bg-black/40 border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-sm sm:text-base h-10 sm:h-12"
      />
      <textarea
        id="message"
        placeholder="Message"
        value={form.message}
        onChange={handleChange}
        required
        className="col-span-2 bg-black/40 border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-white/50 transition-colors resize-none placeholder-white/40 text-sm sm:text-base min-h-[120px] sm:min-h-[180px]"
      />
      <button
        type="submit"
        disabled={loading}
        className="col-span-2 w-full bg-white hover:bg-white/90 text-gray-900 rounded-lg sm:rounded-xl py-2.5 sm:py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Send className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900" />
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
} 