-- First, temporarily remove the constraint
ALTER TABLE loans DROP CONSTRAINT loans_status_check;

-- Then update the data
UPDATE loans SET status = 'Active' WHERE status = 'active';
UPDATE loans SET status = 'Overdue' WHERE status = 'pending_return';
UPDATE loans SET status = 'Returned' WHERE status = 'completed';

-- Finally, add the constraint back with the new values
ALTER TABLE loans ADD CONSTRAINT loans_status_check CHECK (status IN ('Active', 'Overdue', 'Returned'));
