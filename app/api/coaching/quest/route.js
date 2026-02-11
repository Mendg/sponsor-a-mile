import { NextResponse } from 'next/server';
import { getCurrentTeamQuest, updateTeamQuestProgress } from '@/lib/coaching';

// GET /api/coaching/quest
// Returns current active team quest with progress
export async function GET() {
  try {
    // Update progress first
    const quest = await updateTeamQuestProgress();

    if (!quest) {
      return NextResponse.json({ quest: null });
    }

    return NextResponse.json({
      quest: {
        id: quest.id,
        week_number: quest.week_number,
        quest_name: quest.quest_name,
        quest_type: quest.quest_type,
        target_value: parseFloat(quest.target_value),
        current_value: parseFloat(quest.current_value),
        is_completed: quest.is_completed,
        progress_percent: quest.progress_percent,
        reward_badge: quest.reward_badge,
        reward_points: quest.reward_points,
        start_date: quest.start_date,
        end_date: quest.end_date
      }
    });
  } catch (error) {
    console.error('Team quest error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
