-- Update the constraint to include Lost status (4)
ALTER TABLE loans DROP CONSTRAINT loans_status_check;
ALTER TABLE loans ADD CONSTRAINT loans_status_check CHECK (status IN (1, 2, 3, 4));
