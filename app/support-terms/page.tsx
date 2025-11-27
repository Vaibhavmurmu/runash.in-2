"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function SupportTermsPage() {
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
              Support Terms
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Last updated: Nov 27, 2025</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert prose-orange">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
                <p>
                  These Support Terms describe the support services RunAsh provides to customers, including available
                  support channels, response targets, service level expectations, fees (if any), and responsibilities of
                  both RunAsh and the customer. These terms supplement any applicable Master Services Agreement, Terms of
                  Service, or product-specific agreements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Scope</h2>
                <p>
                  Support covers technical issues related to RunAsh-hosted products and official RunAsh integrations. It
                  includes assistance with product configuration, troubleshooting platform defects, and guidance for
                  using supported features. Third-party products, custom integrations, or user-modified code may be
                  out-of-scope unless an explicit statement of support is provided.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Support Levels</h2>
                <ul>
                  <li><strong>Standard Support:</strong> Included for all customers via email and help center; business hours response targets.</li>
                  <li><strong>Priority / Premium Support:</strong> Available to customers on paid plans or via an add-on; includes faster response times, designated contacts, and escalation paths.</li>
                  <li><strong>Enterprise Support:</strong> Custom SLA, technical account management, and extended coverage available under contract.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Support Channels</h2>
                <ul>
                  <li><strong>Email:</strong> support@runash.in — primary channel for Standard Support.</li>
                  <li><strong>In-app / Dashboard:</strong> Support requests and ticketing through the user account interface.</li>
                  <li><strong>Live Chat / Phone:</strong> Available for Priority and Enterprise customers as specified in their plan.</li>
                  <li><strong>Knowledge Base:</strong> Self-service articles, FAQs, and guides maintained in the Help Center.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Response Targets</h2>
                <p>
                  Response targets are goals, not guarantees, unless a separate SLA applies. Typical targets:
                </p>
                <ul>
                  <li><strong>Critical (service down / data loss):</strong> initial response within 1 business hour (Priority/Enterprise) or 4 business hours (Standard).</li>
                  <li><strong>High (major feature broken, severe degradation):</strong> initial response within 4 business hours (Priority/Enterprise) or 1 business day (Standard).</li>
                  <li><strong>Normal (general issues, questions):</strong> initial response within 1 business day (Priority/Enterprise) or 2–3 business days (Standard).</li>
                  <li><strong>Low (feature requests, cosmetic):</strong> initial response within 3–5 business days.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Customer Responsibilities</h2>
                <ul>
                  <li>Provide accurate account and environment details, reproducible steps, logs, screenshots, and other requested information.</li>
                  <li>Maintain supported versions of client software and follow documented setup/configuration steps.</li>
                  <li>Cooperate with RunAsh personnel during investigation and testing, and provide timely access when needed.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. RunAsh Responsibilities</h2>
                <ul>
                  <li>Use commercially reasonable efforts to diagnose and resolve reported issues.</li>
                  <li>Communicate status updates and remediation plans for high-impact incidents.</li>
                  <li>Escalate issues internally and engage engineering resources as necessary under the applicable support tier.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Escalation</h2>
                <p>
                  Priority and Enterprise customers receive defined escalation paths and named contacts. If you believe an
                  issue requires escalation, indicate urgency and provide ticket/reference details when requesting review.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Out of Scope</h2>
                <p>
                  The following items are typically out of scope unless otherwise agreed:
                </p>
                <ul>
                  <li>Support for third-party systems, libraries, or custom code developed by the customer.</li>
                  <li>Data recovery for issues caused by customer-side backups not provided to RunAsh.</li>
                  <li>Support for significantly outdated or unsupported software versions.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Fees</h2>
                <p>
                  Standard Support is included with applicable products. Premium or Enterprise support tiers may incur
                  additional fees as set out in the customer's order or support agreement. Any time-and-materials work
                  outside standard support may be billed at RunAsh's prevailing rates with prior approval.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Maintenance and Scheduled Downtime</h2>
                <p>
                  We perform scheduled maintenance to keep the service secure and up to date. We will provide advance
                  notice for planned maintenance where practical. Scheduled maintenance windows are not considered
                  outages for SLA metrics unless otherwise specified in a contract.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Security and Data Handling</h2>
                <p>
                  Support personnel may request logs or access to help diagnose issues. We handle any customer data in
                  accordance with our Privacy Policy and applicable agreements; access is limited to authorized staff and
                  logged for audit purposes. Sensitive credentials should be shared only through secure channels and
                  replaced if exposed.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Confidentiality</h2>
                <p>
                  Information exchanged during support interactions will be treated according to the confidentiality
                  provisions of the parties' governing agreement. RunAsh will not disclose customer confidential
                  information except as required by law or with consent.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. Liability</h2>
                <p>
                  RunAsh's liability for support services is subject to the limitations and exclusions set forth in the
                  customer's governing agreement (e.g., Terms of Service or Master Services Agreement). These Support
                  Terms do not expand or modify those limitations unless expressly stated in a signed agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">15. Termination of Support</h2>
                <p>
                  Support entitlements may be suspended or terminated for accounts that violate terms, do not pay
                  applicable support fees, or for other reasons set out in a customer's agreement. RunAsh will provide
                  notice where practical prior to suspension.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">16. Changes to These Terms</h2>
                <p>
                  We may update these Support Terms from time to time. Material changes will be communicated and an
                  updated "Last updated" date will appear on this page. Continued use of support services after changes
                  constitutes acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">17. Contact</h2>
                <p>
                  For support, contact <a href="mailto:support@runash.in">support@runash.in</a> or use the in-app support
                  channels. For questions about these Support Terms, contact legal@runash.in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
