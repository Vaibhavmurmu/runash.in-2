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
              Support Terms & Enterprise SLA
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
                  These Support Terms describe the levels of technical support RunAsh provides to customers and the
                  enterprise Service Level Agreement (SLA) commitments for supported services. Support access, response
                  targets, and remedies vary by plan (Standard, Priority, Enterprise). Enterprise customers receive the
                  enhanced commitments described below as part of their customer agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. Scope</h2>
                <p>
                  This policy covers support for RunAsh-hosted services, APIs, and officially supported integrations.
                  It does not apply to third-party services or self-hosted deployments unless explicitly included in an
                  Enterprise Agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Support Channels & Hours</h2>
                <ul>
                  <li><strong>Email:</strong> support@runash.in — monitored 24x7 for Enterprise; business hours for Standard.</li>
                  <li><strong>Portal:</strong> Support portal ticketing and knowledge base available to all customers.</li>
                  <li><strong>Phone & Slack:</strong> Dedicated phone and Slack channels for Enterprise customers (contact enterprise@runash.in).</li>
                  <li><strong>Account Manager:</strong> Enterprise customers receive a named account manager and escalation contact.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Priority Levels & Response Targets</h2>
                <p>Issue priorities and typical target response times:</p>
                <ul>
                  <li>
                    <strong>P1 — Critical (Service Down):</strong> Complete outage or critical production feature unusable.
                    Enterprise: Response within 15 minutes, continuous work until mitigated. Target initial diagnosis: 1 hour.
                    Standard: Response within 1 hour business-hours only.
                  </li>
                  <li>
                    <strong>P2 — High:</strong> Major functionality impaired with no immediate workaround.
                    Enterprise: Response within 1 hour, target resolution or mitigation plan within 8 business hours.
                  </li>
                  <li>
                    <strong>P3 — Medium:</strong> Partial loss of functionality or non-critical bug.
                    Enterprise: Response within 4 business hours, resolution in next release or documented workaround.
                  </li>
                  <li>
                    <strong>P4 — Low:</strong> General questions, enhancement requests, or cosmetic issues.
                    Enterprise: Response within 1 business day.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Enterprise SLA: Availability & Measurement</h2>
                <p>
                  For customers with an Enterprise Agreement the following availability SLA applies to the RunAsh
                  production service:
                </p>
                <ul>
                  <li><strong>SLA Target:</strong> 99.9% monthly uptime for covered services.</li>
                  <li><strong>Measurement:</strong> Monthly Uptime Percentage is calculated as: (Total minutes in month - Downtime minutes) / Total minutes in month * 100.</li>
                  <li><strong>Downtime:</strong> Time when a covered service is unavailable to more than a defined percentage of users, as measured by our monitoring systems.</li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scheduled maintenance (with prior notice), emergency maintenance, customer-caused outages, or outages
                  caused by third-party services are excluded from Downtime measurement (see Exclusions).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Service Credits</h2>
                <p>
                  If RunAsh fails to meet the SLA Target in a given calendar month, Enterprise customers may request a
                  Service Credit according to the table below. Service Credits are the sole and exclusive remedy for SLA
                  failures.
                </p>
                <ul>
                  <li>Monthly Uptime ≥ 99.9%: No credit.</li>
                  <li>Monthly Uptime &lt; 99.9% and ≥ 99.0%: 10% credit of monthly service fees for the affected service.</li>
                  <li>Monthly Uptime &lt; 99.0% and ≥ 95.0%: 25% credit of monthly service fees for the affected service.</li>
                  <li>Monthly Uptime &lt; 95.0%: 50% credit of monthly service fees for the affected service (maximum credit).</li>
                </ul>
                <p>
                  To receive a credit, the customer must: (a) submit a claim within 30 days after the end of the month
                  in which the breach occurred, including timestamps and supporting details; and (b) be current on payments.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Escalation & Communication</h2>
                <p>
                  Enterprise customers receive an escalation matrix with named contacts and response commitments. For
                  P1 incidents, RunAsh will provide near-real-time status updates until incident resolution. We provide
                  a post-incident report within a mutually agreed timeframe for major incidents.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Maintenance & Change Management</h2>
                <ul>
                  <li>Scheduled maintenance windows are announced at least 48 hours in advance and are not counted as Downtime.</li>
                  <li>Emergency maintenance may occur with best-effort notice when required for security or operational stability.</li>
                  <li>Major changes affecting functionality will follow the agreed change management process with Enterprise customers and include rollout plans and rollback procedures.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Exclusions</h2>
                <p>
                  SLA and Support Terms do not apply to outages or issues caused by:
                </p>
                <ul>
                  <li>Customer misconfiguration or misuse of the service.</li>
                  <li>Failures of third-party services beyond RunAsh's reasonable control (cloud provider, CDN, external APIs).</li>
                  <li>Scheduled maintenance or emergency maintenance as described above.</li>
                  <li>Force majeure events, denial-of-service attacks, or other malicious acts by third parties.</li>
                  <li>Beta features or non-production environments unless explicitly covered in the Enterprise Agreement.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Onboarding, Reviews & Reporting</h2>
                <p>
                  Enterprise customers receive onboarding support, technical onboarding sessions, and regular service
                  reviews (frequency per Enterprise Agreement). RunAsh will provide availability and incident reports on request.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Security & Data Protection</h2>
                <p>
                  RunAsh maintains reasonable administrative, technical, and physical safeguards to protect customer data.
                  Security incident response, data handling, and breach notification procedures are documented in the
                  Enterprise Agreement and follow applicable laws and industry best practices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">12. Fees & Credits</h2>
                <p>
                  Service Credits, when granted, are applied to future invoices or refunded only if explicitly stated in
                  the customer's Enterprise Agreement. Service Credits do not extend subscription terms and are capped as
                  set forth in Section 6.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">13. Termination Rights</h2>
                <p>
                  Repeated failure to meet SLA commitments (as defined in the Enterprise Agreement) may entitle the
                  customer to termination rights or other remedies specified in their contract. Any termination rights
                  will be governed solely by the binding Enterprise Agreement, not this summary page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">14. How to Submit an SLA Claim</h2>
                <ol>
                  <li>Open a ticket via the support portal and mark it as an SLA claim, or email enterprise@runash.in.</li>
                  <li>Include incident timestamps, affected service, and supporting monitoring data.</li>
                  <li>Claims must be submitted within 30 days after the month in which the SLA breach occurred.</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">15. Changes & Amendments</h2>
                <p>
                  These Support Terms may be updated from time to time. Material changes for Enterprise customers will
                  be communicated through account managers and documented in the Enterprise Agreement.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">16. Contact</h2>
                <p>
                  For support or SLA inquiries:
                  <br />
                  General support: <a href="mailto:support@runash.in">support@runash.in</a>
                  <br />
                  Enterprise & SLA: <a href="mailto:enterprise@runash.in">enterprise@runash.in</a>
                  <br />
                  Account manager: see your Enterprise Agreement for dedicated contact details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
      }
