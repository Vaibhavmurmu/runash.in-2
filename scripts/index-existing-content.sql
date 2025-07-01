-- Script to index existing content for search functionality
-- This script will populate the search_documents table with existing data

-- First, ensure the search_documents table exists
CREATE TABLE IF NOT EXISTS search_documents (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    url TEXT,
    metadata JSONB DEFAULT '{}',
    embedding vector(1536),
    search_vector tsvector,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Clear existing search documents to avoid duplicates
TRUNCATE TABLE search_documents;

-- Index users as searchable content
INSERT INTO search_documents (id, title, content, content_type, tags, url, metadata, created_at, updated_at)
SELECT 
    'user_' || id::text as id,
    COALESCE(username, email, 'User') as title,
    COALESCE(bio, 'User profile for ' || COALESCE(username, email)) as content,
    'user' as content_type,
    ARRAY['user', 'profile'] as tags,
    '/users/' || id::text as url,
    jsonb_build_object(
        'email', email,
        'username', username,
        'verified', email_verified,
        'createdAt', created_at
    ) as metadata,
    created_at,
    COALESCE(updated_at, created_at)
FROM users
WHERE email IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

-- Index files as searchable content
INSERT INTO search_documents (id, title, content, content_type, tags, url, metadata, created_at, updated_at)
SELECT 
    'file_' || f.id::text as id,
    f.filename as title,
    COALESCE(f.description, f.filename || ' - ' || COALESCE(f.file_type, 'Unknown file type')) as content,
    'file' as content_type,
    ARRAY['file'] || 
    CASE 
        WHEN f.file_type LIKE 'image/%' THEN ARRAY['image']
        WHEN f.file_type LIKE 'video/%' THEN ARRAY['video'] 
        WHEN f.file_type LIKE 'audio/%' THEN ARRAY['audio']
        WHEN f.file_type LIKE '%pdf%' THEN ARRAY['document', 'pdf']
        ELSE ARRAY['document']
    END as tags,
    '/storage/files/' || f.id::text as url,
    jsonb_build_object(
        'fileType', f.file_type,
        'fileSize', f.file_size,
        'userId', f.user_id,
        'bucketId', f.bucket_id,
        'createdAt', f.created_at
    ) || COALESCE(f.metadata, '{}'::jsonb) as metadata,
    f.created_at,
    COALESCE(f.updated_at, f.created_at)
FROM stored_files f
WHERE f.filename IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    metadata = EXCLUDED.metadata,
    updated_at = NOW();

-- Create sample streams if streams table doesn't exist or is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'streams') 
    OR (SELECT COUNT(*) FROM streams) = 0 THEN
        
        -- Insert sample streams
        INSERT INTO search_documents (id, title, content, content_type, tags, url, metadata, created_at, updated_at)
        VALUES 
        ('stream_1', 'React Best Practices 2024', 
         'Learn the latest React patterns, hooks, and performance optimization techniques. This comprehensive tutorial covers modern React development with real-world examples.',
         'stream', ARRAY['react', 'javascript', 'tutorial', 'programming', 'web-development'],
         '/streams/stream_1',
         '{"duration": 3600, "views": 1250, "category": "programming", "difficulty": "intermediate"}'::jsonb,
         NOW() - INTERVAL '2 days', NOW()),
         
        ('stream_2', 'AI Development with Python',
         'Explore machine learning and AI development using Python. Cover TensorFlow, PyTorch, and modern AI frameworks with hands-on projects.',
         'stream', ARRAY['python', 'ai', 'machine-learning', 'tensorflow', 'tutorial'],
         '/streams/stream_2', 
         '{"duration": 2700, "views": 890, "category": "ai", "difficulty": "advanced"}'::jsonb,
         NOW() - INTERVAL '1 day', NOW()),
         
        ('stream_3', 'Gaming Highlights - Esports Championship',
         'Epic gaming moments and highlights from the latest esports championship tournament. Watch the best plays and strategies.',
         'stream', ARRAY['gaming', 'esports', 'highlights', 'tournament', 'entertainment'],
         '/streams/stream_3',
         '{"duration": 1800, "views": 2100, "category": "gaming", "live": false}'::jsonb,
         NOW() - INTERVAL '3 hours', NOW()),
         
        ('stream_4', 'Music Production Masterclass',
         'Learn professional music production techniques, mixing, and mastering with industry-standard tools and software.',
         'stream', ARRAY['music', 'production', 'audio', 'masterclass', 'creative'],
         '/streams/stream_4',
         '{"duration": 4200, "views": 650, "category": "music", "difficulty": "intermediate"}'::jsonb,
         NOW() - INTERVAL '5 hours', NOW()),
         
        ('stream_5', 'Design System Deep Dive',
         'Building scalable design systems for modern web applications. Cover component libraries, design tokens, and best practices.',
         'stream', ARRAY['design', 'ui', 'ux', 'design-system', 'frontend'],
         '/streams/stream_5',
         '{"duration": 2400, "views": 780, "category": "design", "difficulty": "intermediate"}'::jsonb,
         NOW() - INTERVAL '1 hour', NOW())
         
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            metadata = EXCLUDED.metadata,
            updated_at = NOW();
    END IF;
END $$;

-- Create sample posts if posts table doesn't exist or is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts')
    OR (SELECT COUNT(*) FROM posts) = 0 THEN
        
        -- Insert sample posts
        INSERT INTO search_documents (id, title, content, content_type, tags, url, metadata, created_at, updated_at)
        VALUES 
        ('post_1', 'Getting Started with Live Streaming',
         'A comprehensive guide to starting your live streaming journey. Learn about equipment setup, software configuration, and best practices for engaging your audience. This guide covers everything from basic streaming setups to advanced techniques for professional content creation.',
         'post', ARRAY['streaming', 'guide', 'tutorial', 'beginner', 'content-creation'],
         '/posts/post_1',
         '{"readTime": 5, "category": "tutorial", "difficulty": "beginner", "author": "StreamMaster"}'::jsonb,
         NOW() - INTERVAL '1 week', NOW()),
         
        ('post_2', 'Building Community Through Content',
         'Strategies for building and maintaining an engaged community around your content. Focus on authentic connections, consistent value delivery, and meaningful interactions with your audience. Learn how to foster loyalty and create lasting relationships.',
         'post', ARRAY['community', 'content-creation', 'engagement', 'strategy', 'audience'],
         '/posts/post_2',
         '{"readTime": 8, "category": "strategy", "difficulty": "intermediate", "author": "CommunityBuilder"}'::jsonb,
         NOW() - INTERVAL '3 days', NOW()),
         
        ('post_3', 'The Future of Web Development',
         'Exploring emerging trends in web development including AI integration, serverless architecture, modern frameworks, and the evolution of user experiences. Discover what technologies will shape the next decade of web development.',
         'post', ARRAY['web-development', 'trends', 'future', 'technology', 'ai'],
         '/posts/post_3',
         '{"readTime": 12, "category": "technology", "difficulty": "advanced", "author": "TechVisionary"}'::jsonb,
         NOW() - INTERVAL '2 days', NOW()),
         
        ('post_4', 'Audio Production Tips for Creators',
         'Essential audio production techniques for content creators. Learn about recording equipment, editing software, mixing techniques, and mastering your audio content for professional results.',
         'post', ARRAY['audio', 'production', 'tips', 'content-creation', 'tutorial'],
         '/posts/post_4',
         '{"readTime": 6, "category": "tutorial", "difficulty": "intermediate", "author": "AudioPro"}'::jsonb,
         NOW() - INTERVAL '1 day', NOW()),
         
        ('post_5', 'Monetization Strategies for Content Creators',
         'Comprehensive guide to monetizing your content across different platforms. Explore sponsorships, affiliate marketing, merchandise, subscriptions, and other revenue streams for sustainable creator income.',
         'post', ARRAY['monetization', 'business', 'creator-economy', 'strategy', 'income'],
         '/posts/post_5',
         '{"readTime": 10, "category": "business", "difficulty": "intermediate", "author": "CreatorBiz"}'::jsonb,
         NOW() - INTERVAL '6 hours', NOW())
         
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            metadata = EXCLUDED.metadata,
            updated_at = NOW();
    END IF;
END $$;

-- Update search vectors for all documents
UPDATE search_documents 
SET search_vector = to_tsvector('english', 
    COALESCE(title, '') || ' ' || 
    COALESCE(content, '') || ' ' ||
    COALESCE(array_to_string(tags, ' '), '')
)
WHERE search_vector IS NULL;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS search_documents_search_vector_idx 
ON search_documents USING gin(search_vector);

CREATE INDEX IF NOT EXISTS search_documents_content_type_idx 
ON search_documents(content_type);

CREATE INDEX IF NOT EXISTS search_documents_tags_idx 
ON search_documents USING gin(tags);

CREATE INDEX IF NOT EXISTS search_documents_created_at_idx 
ON search_documents(created_at DESC);

-- Insert some initial search queries for analytics
INSERT INTO search_queries (query, search_type, results_count, response_time, created_at)
VALUES 
('react tutorial', 'keyword', 5, 45, NOW() - INTERVAL '2 hours'),
('music production', 'hybrid', 3, 67, NOW() - INTERVAL '1 hour'),
('gaming highlights', 'semantic', 8, 123, NOW() - INTERVAL '30 minutes'),
('design system', 'keyword', 2, 34, NOW() - INTERVAL '15 minutes'),
('ai development', 'hybrid', 4, 89, NOW() - INTERVAL '5 minutes')
ON CONFLICT DO NOTHING;

-- Show indexing results
SELECT 
    content_type,
    COUNT(*) as document_count,
    AVG(LENGTH(content)) as avg_content_length
FROM search_documents 
GROUP BY content_type
ORDER BY document_count DESC;

COMMIT;
