-- First, temporarily remove the constraint
ALTER TABLE loans DROP CONSTRAINT loans_status_check;

-- Create a temporary column to store the numeric status
ALTER TABLE loans ADD COLUMN status_numeric INTEGER;

-- Convert the existing status values to numeric values
UPDATE loans SET status_numeric = 
  CASE 
    WHEN status = 'Active' THEN 1 
    WHEN status = 'Overdue' THEN 2
    WHEN status = 'Returned' THEN 3
    -- Handle the old names too just in case
    WHEN status = 'active' THEN 1 
    WHEN status = 'pending_return' THEN 2
    WHEN status = 'completed' THEN 3
  END;

-- Drop the old text column and rename the numeric column
ALTER TABLE loans DROP COLUMN status;
ALTER TABLE loans RENAME COLUMN status_numeric TO status;

-- Add the constraint for numeric values
ALTER TABLE loans ADD CONSTRAINT loans_status_check CHECK (status IN (1, 2, 3));

-- Make the status column non-null
ALTER TABLE loans ALTER COLUMN status SET NOT NULL;
