/*
  # Add SELECT policy for authenticated users to view all episodes

  1. Security Changes
    - Add policy allowing authenticated users to SELECT all episodes (including drafts)
    - This enables the admin dashboard to display draft episodes
    
  2. Policy Details
    - Target: episodes table
    - Action: SELECT
    - Role: authenticated
    - Condition: true (authenticated users can view all episodes)
*/

-- Drop existing restrictive policy if needed and create comprehensive policy
CREATE POLICY "Authenticated users can view all episodes"
  ON episodes
  FOR SELECT
  TO authenticated
  USING (true);
