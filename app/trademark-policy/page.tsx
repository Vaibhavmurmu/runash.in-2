"use client"

import ThemeToggle from "@/components/theme-toggle"

export default function TrademarkPolicyPage() {
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
              Trademark Policy
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
                  RunAsh respects the intellectual property rights of others and expects users of our services to do the same.
                  This Trademark Policy explains how we handle trademark complaints, permitted and prohibited uses of trademarks,
                  and how trademark owners can report alleged infringements.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Scope</h2>
                <p>
                  This policy applies to trademarks (including service marks and logos) used in connection with content hosted on
                  or distributed through RunAsh services, including user profiles, uploaded content, and listings. It supplements our
                  Terms of Service and other legal notices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. What Is a Trademark?</h2>
                <p>
                  A trademark is a word, phrase, symbol, design, or combination that identifies and distinguishes the source of goods
                  or services of one party from those of others. Trademark rights may be established through registration or by use.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Permitted Uses</h2>
                <ul>
                  <li>Non-confusing use of a trademark to accurately identify products, services, or affiliations (nominative fair use).</li>
                  <li>Descriptive references that do not create a likelihood of confusion about source, sponsorship, or endorsement.</li>
                  <li>Use of trademarks in commentary, criticism, news reporting, or educational contexts where allowed by applicable law.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Prohibited Uses</h2>
                <ul>
                  <li>Using another party's trademark in a manner likely to cause confusion about affiliation, sponsorship, or endorsement.</li>
                  <li>Impersonating a trademark owner or falsely implying ownership or authorization.</li>
                  <li>Using a trademark in product listings, domain names, profile names, or metadata with the intent to divert users or misrepresent origin.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Reporting Alleged Trademark Infringement</h2>
                <p>
                  Trademark owners (or authorized agents) may submit a trademark complaint to RunAsh. To help us process your request,
                  please provide the following information:
                </p>
                <ul>
                  <li>Your name, company name (if applicable), and contact information (email, phone).</li>
                  <li>A clear identification of the trademark claimed to be infringed (word mark, logo, registration number, and country if available).</li>
                  <li>A description of the location of the allegedly infringing material on RunAsh (URL or account/profile location).</li>
                  <li>A statement that you have a good faith belief that use of the trademark is not authorized by the owner, its agent, or the law.</li>
                  <li>A statement, under penalty of perjury where applicable, that the information in the notice is accurate and that you are authorized to act on behalf of the trademark owner.</li>
                  <li>A physical or electronic signature of the trademark owner or authorized agent.</li>
                </ul>
                <p>
                  Send notices to: <a href="mailto:legal@runash.in">legal@runash.in</a>. Including complete information up front speeds review.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Our Response Process</h2>
                <p>
                  Upon receiving a valid complaint, we will review the notice and may take action consistent with our Terms of Service,
                  which may include removing or disabling access to the allegedly infringing content, notifying the account holder, or
                  suspending accounts for repeat infringers. We may also request additional information to verify the claim.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Counter-Notices</h2>
                <p>
                  If you believe your content was removed or disabled in error (for example, because you have rights to use the trademark or
                  because the use is lawful), you may submit a counter-notice. A valid counter-notice should include:
                </p>
                <ul>
                  <li>Your contact details and a description of the material that was removed and its location before removal.</li>
                  <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification.</li>
                  <li>A consent to local jurisdiction (where required) and agreement to accept service of process.</li>
                </ul>
                <p>
                  We will evaluate counter-notices and, where appropriate, may restore content in accordance with applicable law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Repeat Infringer Policy</h2>
                <p>
                  Accounts that repeatedly post infringing content or fail to comply with lawful takedown requests may be suspended
                  or terminated in accordance with our Terms of Service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Limitations</h2>
                <p>
                  RunAsh is not a legal adviser and cannot resolve disputes between private parties. We do not adjudicate trademark
                  ownership; submission of a complaint is not a determination of infringement. Trademark owners should consider pursuing
                  their rights through courts or trademark offices when appropriate.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
                <p>
                  To report alleged trademark infringement or send counter-notices, contact us at <a href="mailto:legal@runash.in">legal@runash.in</a>.
                  For additional questions about this policy, reach out to the same address.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Changes to this Policy</h2>
                <p>
                  We may update this Trademark Policy to reflect changes in law or our practices. Material changes will be posted with an
                  updated "Last updated" date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
