-- Add missing columns to Posts table
ALTER TABLE "Posts" 
ADD COLUMN "author_id" text,
ADD COLUMN "flags" json;

-- Sample data for testing (optional)
-- INSERT INTO "Posts" (title, content, author_id, flags, upvotes) 
-- VALUES 
-- ('Morning Yoga Group', 'Join us for peaceful morning yoga sessions in the park every Tuesday and Thursday at 7 AM.', 'user123', '["Beginner Friendly", "Outdoor"]', 5),
-- ('Rock Climbing Meetup', 'Looking for climbing partners! Indoor climbing gym sessions every weekend.', 'user456', '["Advanced", "Indoor"]', 12);