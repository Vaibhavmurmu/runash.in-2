import { NextResponse } from "next/server"

/**
 * GET /api/community
 * Returns structured community data for the community page.
 *
 * This is a lightweight example payload to enable local development.
 * Replace /wire this to a real data source in production.
 */

export async function GET() {
  const payload = {
    programs: [
      {
        id: "mentorship",
        title: "Creator Mentorship Program",
        description:
          "One-on-one mentorship with experienced creators to refine your content strategy and technical setup.",
        color: "from-orange-400 to-orange-600",
        participants: 1247,
        duration: "3 months",
        nextCohort: "2026-01-12",
        benefits: [
          "Weekly 1:1 mentoring sessions",
          "Custom growth plan and checkpoints",
          "Technical production review",
          "Feature spotlight opportunities",
        ],
        requirements: ["RunAsh account", "Commit to weekly check-ins"],
        tags: ["mentorship", "growth"],
      },
      {
        id: "innovation-lab",
        title: "Innovation Lab",
        description:
          "Beta access to new RunAsh features — provide feedback and shape the roadmap.",
        color: "from-purple-500 to-pink-500",
        participants: 456,
        duration: "Ongoing",
        nextCohort: "Rolling admission",
        benefits: [
          "Early access to features",
          "Direct product feedback sessions",
          "Badge on profile",
        ],
        requirements: ["Pro plan or higher"],
        tags: ["innovation", "beta"],
      },
      {
        id: "content-challenge",
        title: "Content Challenge Series",
        description:
          "Monthly creative challenges with prizes, cross-promotion and workshops focused on engagement.",
        color: "from-orange-300 to-orange-500",
        participants: 2341,
        duration: "Monthly",
        nextCohort: "2026-01 Challenge",
        benefits: [
          "Prize pools",
          "Featured creator spotlights",
          "Cross-promotion on RunAsh channels",
        ],
        requirements: ["Original content", "Adhere to guidelines"],
        tags: ["content", "challenges"],
      },
    ],
    events: [
      {
        id: "evt-ai-2026-01",
        title: "AI for Stream Growth",
        description:
          "Workshop exploring AI techniques to boost discoverability and viewer engagement.",
        date: "2026-01-20",
        time: "17:00",
        type: "Workshop",
        attendees: 234,
        maxAttendees: 500,
        speaker: {
          name: "Dr. Aisha Bennett",
          role: "AI & Growth Lead",
          avatar: "/images/speakers/aisha.png",
        },
        tags: ["AI", "Workshop", "Growth"],
        location: "Online",
      },
      {
        id: "evt-showcase-2026-02",
        title: "Creator Showcase Night",
        description:
          "Monthly showcase where community members present their best work and learnings.",
        date: "2026-02-05",
        time: "19:00",
        type: "Showcase",
        attendees: 567,
        maxAttendees: 1000,
        speaker: {
          name: "RunAsh Community Team",
          role: "Community",
          avatar: "/images/speakers/community.png",
        },
        tags: ["Showcase", "Community"],
        location: "Online",
      },
    ],
    members: [
      {
        name: "StreamQueen",
        slug: "streamqueen",
        avatar: "/images/members/streamqueen.png",
        role: "Gaming Creator",
        followers: "125K",
        growth: "+45%",
        achievement: "Reached 100K followers in 6 months",
        quote:
          "RunAsh's tools helped me double engagement. The mentorship program was a game changer!",
        platforms: ["Twitch", "YouTube", "TikTok"],
        joinedDate: "2024-06-15",
      },
      {
        name: "TechTalker",
        slug: "techtalker",
        avatar: "/images/members/techtalker.png",
        role: "Tech Educator",
        followers: "89K",
        growth: "+67%",
        achievement: "Built a sustainable education channel",
        quote: "Multi-platform streaming saved me hours. I can focus on content now.",
        platforms: ["YouTube", "LinkedIn"],
        joinedDate: "2024-04-20",
      },
      {
        name: "ArtisticSoul",
        slug: "artisticsoul",
        avatar: "/images/members/artisticsoul.png",
        role: "Art Streamer",
        followers: "67K",
        growth: "+89%",
        achievement: "Monetized art streams successfully",
        quote: "Challenges pushed me to try new styles. My audience loves it!",
        platforms: ["Instagram", "TikTok"],
        joinedDate: "2024-08-10",
      },
    ],
    resources: [
      {
        category: "Guides & Tutorials",
        icon: "guide",
        items: [
          { title: "Complete Streaming Setup", type: "Guide", duration: "30 min", url: "/resources/setup" },
          { title: "AI Features Masterclass", type: "Video", duration: "45 min", url: "/resources/ai" },
        ],
      },
      {
        category: "Live Workshops",
        icon: "live",
        items: [
          { title: "Beginner Streaming Workshop", type: "Live", duration: "2 hours", url: "/resources/workshops" },
        ],
      },
    ],
    stats: [
      { label: "Active Members", value: "45,678", change: "+12% this month" },
      { label: "Events This Month", value: "24", change: "8 upcoming" },
      { label: "Success Stories", value: "1,247", change: "+89 this week" },
      { label: "Community Projects", value: "156", change: "23 active" },
    ],
  }

  return NextResponse.json(payload, { status: 200 })
}
