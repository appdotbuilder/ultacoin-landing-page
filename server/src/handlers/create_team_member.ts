
import { db } from '../db';
import { teamMembersTable } from '../db/schema';
import { type CreateTeamMemberInput, type TeamMember } from '../schema';

export const createTeamMember = async (input: CreateTeamMemberInput): Promise<TeamMember> => {
  try {
    // Insert team member record
    const result = await db.insert(teamMembersTable)
      .values({
        name: input.name,
        position: input.position,
        bio: input.bio,
        image_url: input.image_url,
        linkedin_url: input.linkedin_url,
        twitter_url: input.twitter_url,
        order_index: input.order_index,
        is_active: input.is_active
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Team member creation failed:', error);
    throw error;
  }
};
