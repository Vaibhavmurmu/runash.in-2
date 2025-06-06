"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Last updated: Jun 06, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert prose-orange">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  RunAsh AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, disclose, and safeguard your information when you use our AI-powered live
                  streaming platform and related services (the "Service").
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold mb-3">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Account information (name, email address, username)</li>
                  <li>Profile information and preferences</li>
                  <li>Payment information (processed by third-party payment processors)</li>
                  <li>Communications with us (support tickets, feedback)</li>
                  <li>Content you create or upload (stream metadata, custom backgrounds)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Usage data (features used, time spent, interactions)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Log data (access times, pages viewed, errors encountered)</li>
                  <li>Analytics data (performance metrics, user behavior patterns)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Video and Audio Data</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We process video and audio streams in real-time to provide AI enhancement features. This data is
                  processed temporarily and is not stored permanently unless you explicitly choose to record your
                  streams.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Provide and maintain our Service</li>
                  <li>Process AI enhancements for your streams</li>
                  <li>Improve our algorithms and features</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Provide customer support</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                  <li>Send you marketing communications (with your consent)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Service Providers:</strong> Third-party companies that help us operate our Service
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales
                  </li>
                  <li>
                    <strong>Consent:</strong> When you explicitly consent to sharing
                  </li>
                  <li>
                    <strong>Streaming Platforms:</strong> Data necessary to stream to connected platforms
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your information
                  against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We retain your information for as long as necessary to provide our services and fulfill the purposes
                  outlined in this Privacy Policy. Specific retention periods include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>
                    <strong>Account Data:</strong> Until you delete your account
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Up to 2 years for analytics purposes
                  </li>
                  <li>
                    <strong>Video Processing Data:</strong> Processed in real-time and not stored
                  </li>
                  <li>
                    <strong>Support Communications:</strong> Up to 3 years
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Your Rights and Choices</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Access:</strong> Request access to your personal information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in a portable format
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to certain processing of your information
                  </li>
                  <li>
                    <strong>Restriction:</strong> Request restriction of processing
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience on our Service. These
                  technologies help us:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze usage patterns and improve our Service</li>
                  <li>Provide personalized content and features</li>
                  <li>Ensure security and prevent fraud</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect the
                  functionality of our Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure that
                  such transfers comply with applicable data protection laws and implement appropriate safeguards to
                  protect your information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                  Privacy Policy periodically.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> admin@runash.in
                    <br />
                    <strong>Address:</strong> Runash Digital Innovation Technologies Pvt Ltd.
                    <br />
                    310 RunAsh Tech Avenue
                    <br />
                    Bokaro, Jharkhand, 827014
                    <br />
                    Bharat (India)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-gray-950 border-t border-orange-200/50 dark:border-orange-900/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} RunAsh AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
