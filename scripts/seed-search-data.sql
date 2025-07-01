-- Insert sample search indexes
INSERT INTO search_indexes (name, description, content_type, settings) VALUES
('users_index', 'Index for user profiles and information', 'user', '{"boost_title": 2.0, "boost_tags": 1.5}'),
('streams_index', 'Index for live streams and recordings', 'stream', '{"boost_title": 2.0, "boost_description": 1.5}'),
('files_index', 'Index for uploaded files and media', 'file', '{"boost_filename": 2.0, "boost_metadata": 1.2}'),
('content_index', 'Index for general content and posts', 'content', '{"boost_title": 2.0, "boost_content": 1.0}')
ON CONFLICT DO NOTHING;

-- Insert sample search documents
WITH search_index_ids AS (
    SELECT id, content_type FROM search_indexes
)
INSERT INTO search_documents (index_id, content_id, content_type, title, content, metadata, tags) VALUES
-- User documents
((SELECT id FROM search_index_ids WHERE content_type = 'user'), 'user_1', 'user', 'Alex Johnson - Content Creator', 'Experienced content creator specializing in tech tutorials and live streaming. Passionate about AI and machine learning.', '{"followers": 15000, "verified": true}', ARRAY['tech', 'ai', 'streaming', 'tutorials']),
((SELECT id FROM search_index_ids WHERE content_type = 'user'), 'user_2', 'user', 'Sarah Chen - Gaming Streamer', 'Professional gaming streamer with focus on competitive esports and community building.', '{"followers": 25000, "verified": true}', ARRAY['gaming', 'esports', 'streaming', 'community']),
((SELECT id FROM search_index_ids WHERE content_type = 'user'), 'user_3', 'user', 'Mike Rodriguez - Music Producer', 'Music producer and live performer sharing beats and production techniques.', '{"followers": 8000, "verified": false}', ARRAY['music', 'production', 'beats', 'live']),

-- Stream documents
((SELECT id FROM search_index_ids WHERE content_type = 'stream'), 'stream_1', 'stream', 'AI Development Tutorial Series', 'Complete tutorial series on building AI applications with Python and TensorFlow. Covers machine learning basics to advanced neural networks.', '{"duration": 7200, "viewers": 1500, "status": "completed"}', ARRAY['ai', 'python', 'tensorflow', 'tutorial', 'machine-learning']),
((SELECT id FROM search_index_ids WHERE content_type = 'stream'), 'stream_2', 'stream', 'Competitive Gaming Championship', 'Live coverage of the annual competitive gaming championship featuring top players from around the world.', '{"duration": 14400, "viewers": 5000, "status": "live"}', ARRAY['gaming', 'esports', 'championship', 'competitive', 'live']),
((SELECT id FROM search_index_ids WHERE content_type = 'stream'), 'stream_3', 'stream', 'Music Production Masterclass', 'Learn professional music production techniques using industry-standard software and equipment.', '{"duration": 5400, "viewers": 800, "status": "scheduled"}', ARRAY['music', 'production', 'masterclass', 'software', 'equipment']),

-- File documents
((SELECT id FROM search_index_ids WHERE content_type = 'file'), 'file_1', 'file', 'AI_Tutorial_Resources.zip', 'Complete resource package for AI development tutorial including code samples, datasets, and documentation.', '{"size": 157286400, "type": "archive", "downloads": 2500}', ARRAY['ai', 'tutorial', 'resources', 'code', 'datasets']),
((SELECT id FROM search_index_ids WHERE content_type = 'file'), 'file_2', 'file', 'Gaming_Highlights_2024.mp4', 'Best gaming moments and highlights compilation from 2024 streams and tournaments.', '{"size": 2147483648, "type": "video", "duration": 1800}', ARRAY['gaming', 'highlights', '2024', 'compilation', 'tournaments']),
((SELECT id FROM search_index_ids WHERE content_type = 'file'), 'file_3', 'file', 'Beat_Pack_Vol1.wav', 'Original beat pack featuring 20 unique instrumental tracks for content creators.', '{"size": 524288000, "type": "audio", "tracks": 20}', ARRAY['music', 'beats', 'instrumental', 'original', 'pack']),

-- Content documents
((SELECT id FROM search_index_ids WHERE content_type = 'content'), 'content_1', 'content', 'Getting Started with Live Streaming', 'Comprehensive guide for beginners looking to start their live streaming journey. Covers equipment, software, and best practices.', '{"views": 15000, "likes": 1200, "published": true}', ARRAY['streaming', 'beginner', 'guide', 'equipment', 'software']),
((SELECT id FROM search_index_ids WHERE content_type = 'content'), 'content_2', 'content', 'Advanced AI Techniques for Content Creation', 'Explore cutting-edge AI tools and techniques that can enhance your content creation workflow and audience engagement.', '{"views": 8500, "likes": 750, "published": true}', ARRAY['ai', 'content-creation', 'advanced', 'tools', 'engagement']),
((SELECT id FROM search_index_ids WHERE content_type = 'content'), 'content_3', 'content', 'Building a Gaming Community', 'Strategies and tips for building and maintaining an engaged gaming community across multiple platforms.', '{"views": 12000, "likes": 950, "published": true}', ARRAY['gaming', 'community', 'engagement', 'platforms', 'strategies'])
ON CONFLICT DO NOTHING;

-- Insert sample search queries (for analytics)
INSERT INTO search_queries (query, filters, search_type, results_count, response_time) VALUES
('AI tutorial', '{"contentType": ["stream", "content"]}', 'hybrid', 5, 150),
('gaming highlights', '{"contentType": ["file"]}', 'keyword', 3, 80),
('music production', '{"contentType": ["user", "stream"]}', 'semantic', 4, 200),
('streaming guide', '{"contentType": ["content"]}', 'hybrid', 2, 120),
('machine learning', '{"contentType": ["stream", "file"]}', 'semantic', 6, 180),
('esports championship', '{"contentType": ["stream"]}', 'keyword', 1, 90),
('beat pack', '{"contentType": ["file"]}', 'keyword', 2, 70),
('content creation', '{"contentType": ["content", "user"]}', 'hybrid', 8, 160),
('python tensorflow', '{"contentType": ["stream", "file"]}', 'semantic', 3, 140),
('community building', '{"contentType": ["content"]}', 'hybrid', 4, 110)
ON CONFLICT DO NOTHING;

-- Insert sample search analytics
INSERT INTO search_analytics (date, total_queries, unique_users, avg_response_time, top_queries, popular_content) VALUES
(CURRENT_DATE - INTERVAL '1 day', 150, 45, 135.5, 
 '["AI tutorial", "gaming highlights", "music production", "streaming guide", "machine learning"]',
 '["AI Development Tutorial Series", "Gaming Highlights 2024", "Getting Started with Live Streaming"]'),
(CURRENT_DATE - INTERVAL '2 days', 180, 52, 142.3,
 '["content creation", "esports championship", "beat pack", "python tensorflow", "community building"]',
 '["Advanced AI Techniques", "Competitive Gaming Championship", "Music Production Masterclass"]'),
(CURRENT_DATE - INTERVAL '3 days', 120, 38, 128.7,
 '["streaming guide", "AI tutorial", "gaming highlights", "music production", "machine learning"]',
 '["Building a Gaming Community", "AI Tutorial Resources", "Beat Pack Vol1"]')
ON CONFLICT (date) DO NOTHING;
