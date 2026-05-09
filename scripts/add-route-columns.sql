-- experiences テーブルへの追加カラム
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS main_turning_point text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS positive_turning_points jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS correction_turning_points jsonb;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS current_advice text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS recommended_for text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS fixed_subjects text[];
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS reduced_actions text[];
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS past_exam_start_timing text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS club_retirement_timing text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS commute_time text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS sns_usage_level text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS school_workload_level text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS study_location text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS cram_school_type text;
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS route_tags text[];
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS route_type text;
