"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function GDPRPage() {
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
              GDPR & Data Subject Rights
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
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <p>
                  This page explains how RunAsh (the "Controller") processes personal data covered by the EU General Data
                  Protection Regulation (GDPR), the lawful bases we rely on, and the rights available to data subjects under
                  GDPR. It supplements our Privacy Policy and applies to individuals in the European Economic Area (EEA).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Controller & Contact</h2>
                <p>
                  RunAsh is the data controller for the processing activities described here. For data protection inquiries,
                  please contact us at: <a href="mailto:privacy@runash.in">privacy@runash.in</a>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Personal Data We Process</h2>
                <p>
                  We process categories of personal data necessary to provide our services, including:
                </p>
                <ul>
                  <li>Account details (name, email, username)</li>
                  <li>Profile and billing information</li>
                  <li>Usage and telemetry (logs, analytics)</li>
                  <li>Content you create, upload or stream (audio/video/text) when you use AI or streaming features</li>
                  <li>Support communications and transaction records</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Lawful Bases for Processing</h2>
                <p>
                  Depending on the processing activity, we rely on one or more lawful bases under GDPR, including:
                </p>
                <ul>
                  <li><strong>Performance of a contract:</strong> to provide the services you request.</li>
                  <li><strong>Legal obligation:</strong> to comply with applicable laws.</li>
                  <li><strong>Legitimate interests:</strong> for fraud prevention, platform security, product improvement, and analytics where such interests are not overridden by your rights.</li>
                  <li><strong>Consent:</strong> where required (e.g., certain marketing communications or optional AI features that require explicit opt-in).</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Your Rights under GDPR</h2>
                <p>
                  If you are in the EEA, you have the following rights subject to statutory conditions and exceptions:
                </p>
                <ul>
                  <li><strong>Right of access</strong> — request a copy of personal data we hold about you.</li>
                  <li><strong>Right to rectification</strong> — correct inaccurate or incomplete data.</li>
                  <li><strong>Right to erasure</strong> ("right to be forgotten") — request deletion of your personal data where applicable.</li>
                  <li><strong>Right to restriction of processing</strong> — ask us to limit processing in certain circumstances.</li>
                  <li><strong>Right to data portability</strong> — receive a machine-readable copy of your data or request transfer to another controller where applicable.</li>
                  <li><strong>Right to object</strong> — object to processing based on legitimate interests or for direct marketing.</li>
                  <li><strong>Rights related to automated decision-making</strong> — request information and, where applicable, request human intervention for decisions based solely on automated processing with legal or similarly significant effects.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. How to Exercise Your Rights</h2>
                <p>
                  To exercise any GDPR right, contact us at <a href="mailto:privacy@runash.in">privacy@runash.in</a> or use the account
                  settings and support channels in your RunAsh account. Please provide sufficient information to locate your data
                  (e.g., account email, order number) and the specific request (access, correction, deletion, etc.).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Verification & Security</h2>
                <p>
                  We may need to verify your identity before fulfilling requests to protect your data and prevent fraudulent requests.
                  Verification may require sending a confirmation to your registered email or requesting additional information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Data Portability</h2>
                <p>
                  Where applicable, we will provide personal data in a structured, commonly used, machine-readable format (e.g., CSV or JSON).
                  Portability applies to data you have provided to us and which we process by automated means.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Automated Decision-Making</h2>
                <p>
                  Some features use automated processing and AI to assist functionality (e.g., recommendations, content moderation).
                  We aim to ensure such systems are fair and explainable; if you believe an automated decision has adversely affected
                  you, contact us to request human review and explanation.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. International Transfers</h2>
                <p>
                  RunAsh may transfer personal data to countries outside the EEA. Where transfers occur, we use appropriate safeguards,
                  such as Standard Contractual Clauses (SCCs), approved transfer mechanisms, or transfers to countries with an adequate level
                  of protection, and we document these measures in accordance with GDPR.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Data Retention</h2>
                <p>
                  We retain personal data only as long as necessary for the purposes described (service provision, legal obligations, dispute
                  resolution, and legitimate business needs). Retention periods vary by data type; contact us for specifics.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect personal data, including encryption in transit and at rest,
                  access controls, monitoring, and regular security assessments.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Complaints to Supervisory Authority</h2>
                <p>
                  If you are not satisfied with our response, you have the right to lodge a complaint with a supervisory authority in the EEA Member State
                  where you live, work, or where an alleged infringement occurred.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. Contact & Data Protection Officer</h2>
                <p>
                  For privacy inquiries or to exercise your GDPR rights, contact us at <a href="mailto:privacy@runash.in">privacy@runash.in</a>.
                  If applicable, our Data Protection Officer can be reached at the same address.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">15. Changes to this GDPR Information</h2>
                <p>
                  We may update this GDPR information to reflect changes in our practices or legal requirements. Material changes will be posted with an updated
                  "Last updated" date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
      }
