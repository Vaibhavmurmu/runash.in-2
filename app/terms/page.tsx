"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-orange-950/30 dark:to-gray-950"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5 dark:opacity-10"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 border border-orange-500/30 rounded-full bg-orange-500/10 backdrop-blur-sm">
              <span className="text-orange-600 dark:text-orange-400">Legal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 dark:from-orange-400 dark:via-orange-300 dark:to-yellow-300 text-transparent bg-clip-text">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Last updated: Jun 06, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By accessing or using RunAsh AI's services ("Service"), you agree to be bound by these Terms of
                  Service ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  RunAsh AI provides an AI-powered live streaming platform that enhances video quality, provides chat
                  moderation, analytics, and other streaming-related features. Our Service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>Real-time AI video and audio enhancement</li>
                  <li>Multi-platform streaming capabilities</li>
                  <li>Chat moderation and audience engagement tools</li>
                  <li>Analytics and performance insights</li>
                  <li>Virtual backgrounds and effects</li>
                  <li>API access and integrations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  To use certain features of our Service, you must create an account. You agree to provide accurate,
                  current, and complete information during registration and to update such information to keep it
                  accurate, current, and complete.
                </p>
                <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Security</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You are responsible for safeguarding the password and for maintaining the security of your account.
                  You agree not to disclose your password to any third party and to take sole responsibility for any
                  activities or actions under your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You agree not to use the Service for any unlawful purpose or in any way that could damage, disable,
                  overburden, or impair our servers or networks. Prohibited activities include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>Streaming content that violates copyright or other intellectual property rights</li>
                  <li>Harassment, abuse, or harmful content targeting individuals or groups</li>
                  <li>Spam, malware, or other malicious activities</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Content and Intellectual Property</h2>
                <h3 className="text-xl font-semibold mb-3">5.1 Your Content</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You retain ownership of content you create and stream through our Service. By using our Service, you
                  grant us a limited license to process, store, and transmit your content as necessary to provide the
                  Service.
                </p>
                <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Our Content</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by RunAsh AI and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Privacy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                  Service, to understand our practices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Subscription and Billing</h2>
                <h3 className="text-xl font-semibold mb-3">7.1 Paid Services</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Some aspects of the Service may be provided for a fee. You agree to pay all fees associated with your
                  use of paid features. Fees are non-refundable except as required by law.
                </p>
                <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Automatic Renewal</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Subscription services automatically renew unless cancelled before the renewal date. You may cancel
                  your subscription at any time through your account settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice,
                  for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Disclaimers and Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Service is provided "as is" without warranties of any kind. To the fullest extent permitted by
                  law, RunAsh AI disclaims all warranties and shall not be liable for any indirect, incidental, special,
                  or consequential damages.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes
                  via email or through the Service. Your continued use of the Service after such modifications
                  constitutes acceptance of the updated Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> admin@runash.in
                    <br />
                    <strong>Address:</strong> 310  RunAsh Tech Avenue, Bokaro, JH, Bharat(India) 827014
                    <br />
                    <strong>Phone:</strong> +91 (06542) 253096
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
