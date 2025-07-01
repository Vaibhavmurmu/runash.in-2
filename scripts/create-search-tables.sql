-- Create search indexes table
CREATE TABLE IF NOT EXISTS search_indexes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(100) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search documents table
CREATE TABLE IF NOT EXISTS search_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    index_id UUID REFERENCES search_indexes(id) ON DELETE CASCADE,
    content_id VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    embedding VECTOR(1536), -- For OpenAI embeddings (requires pgvector extension)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search queries table
CREATE TABLE IF NOT EXISTS search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    search_type VARCHAR(50) DEFAULT 'hybrid',
    results_count INTEGER DEFAULT 0,
    response_time INTEGER DEFAULT 0, -- in milliseconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search results table
CREATE TABLE IF NOT EXISTS search_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES search_queries(id) ON DELETE CASCADE,
    document_id UUID REFERENCES search_documents(id) ON DELETE CASCADE,
    relevance_score DECIMAL(5,4) DEFAULT 0.0,
    rank INTEGER NOT NULL,
    clicked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search feedback table
CREATE TABLE IF NOT EXISTS search_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES search_queries(id) ON DELETE CASCADE,
    result_id UUID REFERENCES search_results(id) ON DELETE CASCADE,
    user_id UUID,
    feedback_type VARCHAR(50) NOT NULL, -- 'helpful', 'not_helpful', 'irrelevant'
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search analytics table
CREATE TABLE IF NOT EXISTS search_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_queries INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    avg_response_time DECIMAL(8,2) DEFAULT 0.0,
    top_queries JSONB DEFAULT '[]',
    popular_content JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_search_documents_content_type ON search_documents(content_type);
CREATE INDEX IF NOT EXISTS idx_search_documents_title ON search_documents USING GIN(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_search_documents_content ON search_documents USING GIN(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_search_documents_tags ON search_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_search_documents_created_at ON search_documents(created_at);

CREATE INDEX IF NOT EXISTS idx_search_queries_user_id ON search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON search_queries(created_at);
CREATE INDEX IF NOT EXISTS idx_search_queries_query ON search_queries USING GIN(to_tsvector('english', query));

CREATE INDEX IF NOT EXISTS idx_search_results_query_id ON search_results(query_id);
CREATE INDEX IF NOT EXISTS idx_search_results_document_id ON search_results(document_id);
CREATE INDEX IF NOT EXISTS idx_search_results_relevance_score ON search_results(relevance_score DESC);

CREATE INDEX IF NOT EXISTS idx_search_feedback_query_id ON search_feedback(query_id);
CREATE INDEX IF NOT EXISTS idx_search_feedback_user_id ON search_feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_search_analytics_date ON search_analytics(date);

-- Create vector similarity index if pgvector is available
-- CREATE INDEX IF NOT EXISTS idx_search_documents_embedding ON search_documents USING ivfflat (embedding vector_cosine_ops);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_search_indexes_updated_at BEFORE UPDATE ON search_indexes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_search_documents_updated_at BEFORE UPDATE ON search_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
