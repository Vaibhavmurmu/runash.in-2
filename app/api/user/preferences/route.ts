import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidUUID } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const preferences = await sql`
      SELECT * FROM user_preferences WHERE user_id = ${userId}::uuid
    `

    if (preferences.length === 0) {
      // Create default preferences if they don't exist
      const newPreferences = await sql`
        INSERT INTO user_preferences (user_id) 
        VALUES (${userId}::uuid) 
        RETURNING *
      `
      return NextResponse.json(newPreferences[0])
    }

    return NextResponse.json(preferences[0])
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()

    const updatedPreferences = await sql`
      UPDATE user_preferences 
      SET 
        theme = ${body.theme || "system"},
        language = ${body.language || "en"},
        timezone = ${body.timezone || "America/Los_Angeles"},
        compact_mode = ${body.compact_mode || false},
        show_sidebar_labels = ${body.show_sidebar_labels !== undefined ? body.show_sidebar_labels : true},
        hour_format_24 = ${body.hour_format_24 || false},
        reduced_motion = ${body.reduced_motion || false},
        high_contrast = ${body.high_contrast || false},
        large_text = ${body.large_text || false},
        screen_reader_support = ${body.screen_reader_support || false},
        auto_save = ${body.auto_save !== undefined ? body.auto_save : true},
        preload_content = ${body.preload_content !== undefined ? body.preload_content : true},
        background_sync = ${body.background_sync !== undefined ? body.background_sync : true},
        data_usage = ${body.data_usage || "balanced"},
        analytics_tracking = ${body.analytics_tracking !== undefined ? body.analytics_tracking : true},
        crash_reports = ${body.crash_reports !== undefined ? body.crash_reports : true},
        personalized_recommendations = ${body.personalized_recommendations !== undefined ? body.personalized_recommendations : true},
        default_video_quality = ${body.default_video_quality || "1080p"},
        audio_quality = ${body.audio_quality || "high"},
        auto_adjust_quality = ${body.auto_adjust_quality !== undefined ? body.auto_adjust_quality : true},
        hardware_acceleration = ${body.hardware_acceleration !== undefined ? body.hardware_acceleration : true},
        updated_at = NOW()
      WHERE user_id = ${userId}::uuid
      RETURNING *
    `

    if (updatedPreferences.length === 0) {
      return NextResponse.json({ error: "User preferences not found" }, { status: 404 })
    }

    return NextResponse.json(updatedPreferences[0])
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
