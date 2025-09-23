-- Add support for additional tournament status values
ALTER TABLE tournaments DROP CONSTRAINT IF EXISTS tournaments_status_check;

ALTER TABLE tournaments ADD CONSTRAINT tournaments_status_check 
CHECK (status IN ('registration_open', 'registration_closed', 'in_progress', 'completed'));