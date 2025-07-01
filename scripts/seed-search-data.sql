-- Insert default search indexes
INSERT INTO search_indexes (name, description, content_type, fields, settings) VALUES
('users', 'User profiles and information', 'user', 
 '{"title": "username", "content": "bio", "metadata": ["email", "location", "tags"]}',
 '{"boost_fields": {"title": 2.0, "content": 1.0}}'),
('files', 'Uploaded files and documents', 'file',
 '{"title": "filename", "content": "description", "metadata": ["file_type", "size", "tags"]}',
 '{"boost_fields": {"title": 2.0, "content": 1.0}}'),
('streams', 'Live streams and recordings', 'stream',
 '{"title": "title", "content": "description", "metadata": ["category", "tags", "duration"]}',
 '{"boost_fields": {"title": 2.5, "content": 1.0}}'),
('content', 'General content and posts', 'content',
 '{"title": "title", "content": "body", "metadata": ["category", "tags", "author"]}',
 '{"boost_fields": {"title": 2.0, "content": 1.0}}');

-- Insert sample search documents
INSERT INTO search_documents (index_id, document_id, content_type, title, content, metadata, tags) VALUES
((SELECT id FROM search_indexes WHERE name = 'users'), 'user-1', 'user', 
 'John Doe', 'Full-stack developer passionate about React and Node.js', 
 '{"email": "john@example.com", "location": "San Francisco", "followers": 150}',
 ARRAY['developer', 'react', 'nodejs']),
((SELECT id FROM search_indexes WHERE name = 'users'), 'user-2', 'user',
 'Jane Smith', 'UI/UX designer with 5 years of experience in mobile apps',
 '{"email": "jane@example.com", "location": "New York", "followers": 320}',
 ARRAY['designer', 'ui', 'ux', 'mobile']),
((SELECT id FROM search_indexes WHERE name = 'streams'), 'stream-1', 'stream',
 'React Best Practices 2024', 'Learn the latest React patterns and performance optimization techniques',
 '{"category": "programming", "duration": 3600, "views": 1250}',
 ARRAY['react', 'javascript', 'tutorial', 'programming']),
((SELECT id FROM search_indexes WHERE name = 'streams'), 'stream-2', 'stream',
 'Design System Workshop', 'Building scalable design systems for modern web applications',
 '{"category": "design", "duration": 2700, "views": 890}',
 ARRAY['design', 'ui', 'design-system', 'workshop']),
((SELECT id FROM search_indexes WHERE name = 'files'), 'file-1', 'file',
 'project-proposal.pdf', 'Comprehensive project proposal for Q1 2024 initiatives',
 '{"file_type": "pdf", "size": 2048576, "upload_date": "2024-01-15"}',
 ARRAY['proposal', 'project', 'planning']),
((SELECT id FROM search_indexes WHERE name = 'content'), 'content-1', 'content',
 'Getting Started with AI Search', 'A comprehensive guide to implementing AI-powered search functionality',
 '{"category": "tutorial", "author": "Tech Team", "publish_date": "2024-01-20"}',
 ARRAY['ai', 'search', 'tutorial', 'guide']);

-- Insert sample search analytics
INSERT INTO search_analytics (date, total_queries, unique_users, avg_response_time_ms, top_queries, popular_content) VALUES
(CURRENT_DATE - INTERVAL '1 day', 245, 89, 125.5,
 '[{"query": "react tutorial", "count": 45}, {"query": "design system", "count": 32}]',
 '[{"title": "React Best Practices 2024", "clicks": 78}, {"title": "Design System Workshop", "clicks": 56}]'),
(CURRENT_DATE - INTERVAL '2 days', 198, 76, 132.8,
 '[{"query": "javascript", "count": 38}, {"query": "ui design", "count": 28}]',
 '[{"title": "Getting Started with AI Search", "clicks": 65}, {"title": "project-proposal.pdf", "clicks": 43}]');
