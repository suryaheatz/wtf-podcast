/*
  # Allow public SELECT access to all episodes

  1. Security Changes
    - Add policy allowing public users to SELECT all episodes (including drafts)
    - This enables the admin dashboard to display draft episodes without authentication
    
  2. Important Notes
    - This is appropriate for internal admin tools or demos
    - For production, implement authentication and remove this policy
    - Episodes can still only be created/updated/deleted by authenticated users
*/

-- Allow public users to view all episodes (needed for admin interface)
CREATE POLICY "Public users can view all episodes for admin"
  ON episodes
  FOR SELECT
  TO public
  USING (true);
