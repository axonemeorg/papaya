-- Creates the function and trigger to manage the entry_number for user journal entries. --
CREATE OR REPLACE FUNCTION increment_entry_number()
RETURNS trigger AS $$
BEGIN
  NEW.entry_number := (
    SELECT COALESCE(MAX(entry_number), 0) + 1
    FROM journal_entry
    WHERE user_id = NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_entry_number_trigger
BEFORE INSERT ON journal_entry
FOR EACH ROW
EXECUTE FUNCTION increment_entry_number();
