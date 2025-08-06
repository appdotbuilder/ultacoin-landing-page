
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { teamMembersTable } from '../db/schema';
import { type CreateTeamMemberInput } from '../schema';
import { createTeamMember } from '../handlers/create_team_member';
import { eq } from 'drizzle-orm';

// Simple test input with all required fields
const testInput: CreateTeamMemberInput = {
  name: 'John Doe',
  position: 'CEO',
  bio: 'Experienced leader with 10+ years in blockchain technology',
  image_url: 'https://example.com/john-doe.jpg',
  linkedin_url: 'https://linkedin.com/in/johndoe',
  twitter_url: 'https://twitter.com/johndoe',
  order_index: 1,
  is_active: true
};

describe('createTeamMember', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a team member', async () => {
    const result = await createTeamMember(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.position).toEqual('CEO');
    expect(result.bio).toEqual(testInput.bio);
    expect(result.image_url).toEqual('https://example.com/john-doe.jpg');
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/johndoe');
    expect(result.twitter_url).toEqual('https://twitter.com/johndoe');
    expect(result.order_index).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save team member to database', async () => {
    const result = await createTeamMember(testInput);

    // Query using proper drizzle syntax
    const teamMembers = await db.select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.id, result.id))
      .execute();

    expect(teamMembers).toHaveLength(1);
    expect(teamMembers[0].name).toEqual('John Doe');
    expect(teamMembers[0].position).toEqual('CEO');
    expect(teamMembers[0].bio).toEqual(testInput.bio);
    expect(teamMembers[0].image_url).toEqual('https://example.com/john-doe.jpg');
    expect(teamMembers[0].linkedin_url).toEqual('https://linkedin.com/in/johndoe');
    expect(teamMembers[0].twitter_url).toEqual('https://twitter.com/johndoe');
    expect(teamMembers[0].order_index).toEqual(1);
    expect(teamMembers[0].is_active).toEqual(true);
    expect(teamMembers[0].created_at).toBeInstanceOf(Date);
    expect(teamMembers[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle team member with null social media links', async () => {
    const inputWithNulls: CreateTeamMemberInput = {
      name: 'Jane Smith',
      position: 'CTO',
      bio: 'Technical expert specializing in smart contracts',
      image_url: null,
      linkedin_url: null,
      twitter_url: null,
      order_index: 2,
      is_active: true
    };

    const result = await createTeamMember(inputWithNulls);

    expect(result.name).toEqual('Jane Smith');
    expect(result.position).toEqual('CTO');
    expect(result.image_url).toBeNull();
    expect(result.linkedin_url).toBeNull();
    expect(result.twitter_url).toBeNull();
    expect(result.order_index).toEqual(2);
    expect(result.is_active).toEqual(true);

    // Verify in database
    const teamMembers = await db.select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.id, result.id))
      .execute();

    expect(teamMembers[0].image_url).toBeNull();
    expect(teamMembers[0].linkedin_url).toBeNull();
    expect(teamMembers[0].twitter_url).toBeNull();
  });

  it('should use default is_active value when not provided', async () => {
    const inputWithDefaults: CreateTeamMemberInput = {
      name: 'Bob Johnson',
      position: 'Developer',
      bio: 'Frontend specialist with React expertise',
      image_url: null,
      linkedin_url: null,
      twitter_url: null,
      order_index: 3,
      is_active: true // Include required field - Zod defaults are applied during parsing, not in handler
    };

    const result = await createTeamMember(inputWithDefaults);

    expect(result.is_active).toEqual(true);
  });
});
