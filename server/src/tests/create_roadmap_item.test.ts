
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { roadmapItemsTable } from '../db/schema';
import { type CreateRoadmapItemInput } from '../schema';
import { createRoadmapItem } from '../handlers/create_roadmap_item';
import { eq, and, gte } from 'drizzle-orm';

// Simple test input
const testInput: CreateRoadmapItemInput = {
  title: 'Launch Beta Version',
  description: 'Release the beta version of the platform with core features',
  quarter: 'Q2',
  year: 2024,
  status: 'planned',
  order_index: 1,
  is_active: true
};

describe('createRoadmapItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a roadmap item', async () => {
    const result = await createRoadmapItem(testInput);

    // Basic field validation
    expect(result.title).toEqual('Launch Beta Version');
    expect(result.description).toEqual(testInput.description);
    expect(result.quarter).toEqual('Q2');
    expect(result.year).toEqual(2024);
    expect(result.status).toEqual('planned');
    expect(result.order_index).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save roadmap item to database', async () => {
    const result = await createRoadmapItem(testInput);

    // Query using proper drizzle syntax
    const roadmapItems = await db.select()
      .from(roadmapItemsTable)
      .where(eq(roadmapItemsTable.id, result.id))
      .execute();

    expect(roadmapItems).toHaveLength(1);
    expect(roadmapItems[0].title).toEqual('Launch Beta Version');
    expect(roadmapItems[0].description).toEqual(testInput.description);
    expect(roadmapItems[0].quarter).toEqual('Q2');
    expect(roadmapItems[0].year).toEqual(2024);
    expect(roadmapItems[0].status).toEqual('planned');
    expect(roadmapItems[0].order_index).toEqual(1);
    expect(roadmapItems[0].is_active).toEqual(true);
    expect(roadmapItems[0].created_at).toBeInstanceOf(Date);
    expect(roadmapItems[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create roadmap item with different status values', async () => {
    const inProgressInput: CreateRoadmapItemInput = {
      ...testInput,
      title: 'MVP Development',
      status: 'in_progress'
    };

    const result = await createRoadmapItem(inProgressInput);
    expect(result.status).toEqual('in_progress');

    const completedInput: CreateRoadmapItemInput = {
      ...testInput,
      title: 'Whitepaper Release',
      status: 'completed'
    };

    const result2 = await createRoadmapItem(completedInput);
    expect(result2.status).toEqual('completed');
  });

  it('should apply Zod defaults correctly', async () => {
    const minimalInput: CreateRoadmapItemInput = {
      title: 'Test Item',
      description: 'Test description',
      quarter: 'Q3',
      year: 2024,
      order_index: 0,
      status: 'planned',
      is_active: true
    };

    const result = await createRoadmapItem(minimalInput);

    // Verify values are applied
    expect(result.status).toEqual('planned');
    expect(result.is_active).toEqual(true);
  });

  it('should query roadmap items by year correctly', async () => {
    // Create roadmap items for different years
    await createRoadmapItem(testInput); // 2024
    
    const futureItem: CreateRoadmapItemInput = {
      ...testInput,
      title: 'Future Milestone',
      year: 2025,
      order_index: 2
    };
    await createRoadmapItem(futureItem);

    // Query for 2024 items
    const currentYearItems = await db.select()
      .from(roadmapItemsTable)
      .where(eq(roadmapItemsTable.year, 2024))
      .execute();

    expect(currentYearItems).toHaveLength(1);
    expect(currentYearItems[0].title).toEqual('Launch Beta Version');
    expect(currentYearItems[0].year).toEqual(2024);

    // Query for items from 2024 onwards
    const futureItems = await db.select()
      .from(roadmapItemsTable)
      .where(gte(roadmapItemsTable.year, 2024))
      .execute();

    expect(futureItems).toHaveLength(2);
    futureItems.forEach(item => {
      expect(item.year).toBeGreaterThanOrEqual(2024);
      expect(item.created_at).toBeInstanceOf(Date);
      expect(item.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should handle multiple roadmap items with different quarters and order', async () => {
    const q1Item: CreateRoadmapItemInput = {
      title: 'Q1 Milestone',
      description: 'First quarter goal',
      quarter: 'Q1',
      year: 2024,
      status: 'completed',
      order_index: 0,
      is_active: true
    };

    const q3Item: CreateRoadmapItemInput = {
      title: 'Q3 Milestone',
      description: 'Third quarter goal',
      quarter: 'Q3',
      year: 2024,
      status: 'in_progress',
      order_index: 2,
      is_active: true
    };

    await createRoadmapItem(q1Item);
    await createRoadmapItem(testInput); // Q2 item
    await createRoadmapItem(q3Item);

    // Query all 2024 items
    const yearItems = await db.select()
      .from(roadmapItemsTable)
      .where(
        and(
          eq(roadmapItemsTable.year, 2024),
          eq(roadmapItemsTable.is_active, true)
        )
      )
      .execute();

    expect(yearItems).toHaveLength(3);
    
    // Verify all quarters are represented
    const quarters = yearItems.map(item => item.quarter).sort();
    expect(quarters).toEqual(['Q1', 'Q2', 'Q3']);

    // Verify different statuses
    const statuses = yearItems.map(item => item.status);
    expect(statuses).toContain('planned');
    expect(statuses).toContain('in_progress');
    expect(statuses).toContain('completed');
  });
});
