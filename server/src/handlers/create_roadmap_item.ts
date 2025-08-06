
import { db } from '../db';
import { roadmapItemsTable } from '../db/schema';
import { type CreateRoadmapItemInput, type RoadmapItem } from '../schema';

export const createRoadmapItem = async (input: CreateRoadmapItemInput): Promise<RoadmapItem> => {
  try {
    // Insert roadmap item record
    const result = await db.insert(roadmapItemsTable)
      .values({
        title: input.title,
        description: input.description,
        quarter: input.quarter,
        year: input.year,
        status: input.status,
        order_index: input.order_index,
        is_active: input.is_active
      })
      .returning()
      .execute();

    const roadmapItem = result[0];
    return roadmapItem;
  } catch (error) {
    console.error('Roadmap item creation failed:', error);
    throw error;
  }
};
