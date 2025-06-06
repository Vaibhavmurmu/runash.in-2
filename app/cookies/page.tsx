"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function CookiesPage() {
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
              Cookie Policy
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
                <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit our website. They help us
                  provide you with a better experience by remembering your preferences and analyzing how you use our
                  service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  RunAsh AI uses cookies for various purposes to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>Authentication and security</li>
                  <li>Remembering your preferences and settings</li>
                  <li>Analytics and performance monitoring</li>
                  <li>Personalizing content and features</li>
                  <li>Advertising and marketing optimization</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      These cookies are necessary for the website to function properly. They enable core functionality
                      such as security, network management, and accessibility.
                    </p>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Performance Cookies</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      These cookies help us understand how visitors interact with our website by collecting and
                      reporting information anonymously.
                    </p>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Functional Cookies</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      These cookies enable enhanced functionality and personalization, such as remembering your login
                      details and preferences.
                    </p>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Marketing Cookies</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      These cookies track your online activity to help advertisers deliver more relevant advertising or
                      to limit how many times you see an ad.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may use third-party services that set cookies on your device. These include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>
                    <strong>Google Analytics:</strong> For website analytics and performance monitoring
                  </li>
                  <li>
                    <strong>Stripe:</strong> For payment processing and fraud prevention
                  </li>
                  <li>
                    <strong>Intercom:</strong> For customer support and communication
                  </li>
                  <li>
                    <strong>Social Media Platforms:</strong> For social sharing and login functionality
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Managing Your Cookie Preferences</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You have several options for managing cookies:
                </p>

                <div className="mt-6 space-y-4">
                  <div className="p-6 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="text-xl font-semibold mb-3">Browser Settings</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Most web browsers allow you to control cookies through their settings. You can usually find these
                      options in the "Privacy" or "Security" section of your browser's settings.
                    </p>
                  </div>

                  <div className="p-6 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="text-xl font-semibold mb-3">Cookie Consent Manager</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      When you first visit our website, you'll see a cookie consent banner where you can choose which
                      types of cookies to accept or reject.
                    </p>
                  </div>

                  <div className="p-6 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h3 className="text-xl font-semibold mb-3">Opt-Out Links</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      For third-party cookies, you can often opt out directly through the service provider's website or
                      through industry opt-out tools.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Impact of Disabling Cookies</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  While you can disable cookies, please note that doing so may affect your experience on our website:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4">
                  <li>You may need to re-enter information more frequently</li>
                  <li>Some features may not work properly</li>
                  <li>Personalized content and recommendations may not be available</li>
                  <li>We may not be able to remember your preferences</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                  operational, legal, or regulatory reasons. We will notify you of any material changes by posting the
                  updated policy on our website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> admin@runash.in
                    <br />
                    <strong>Address:</strong> 310 RunAsh Tech Avenue, Bokaro JH Bharat (India) 827014
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
