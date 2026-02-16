# Database Design - Hệ Thống Web Địa Phương với AI Chatbot

**Ngày:** 2026-02-16  
**Tác giả:** System Design  
**Trạng thái:** Validated

## Tổng Quan

Thiết kế database cho hệ thống web địa phương hỗ trợ tìm kiếm quán ăn, đánh giá, blog, và chatbot AI. Sử dụng PostgreSQL với **Hybrid Approach**: relational tables cho core entities, JSONB cho metadata linh hoạt.

## Design Principles

### 1. **Hybrid Approach (Recommended)**

**Rationale:**
- Core entities cần query hiệu quả → Relational tables
- Metadata ít filter → JSONB cho flexibility
- Dễ migration khi cần normalize thêm

**Trade-offs:**
- ✅ Cân bằng performance vs simplicity
- ✅ Schema linh hoạt, dễ extend
- ✅ Query optimization cho search-heavy features
- ⚠️ Cần discipline khi quyết định relational vs JSONB

### 2. **Denormalization Strategy**

**Denormalized Fields:**
- `restaurants.avg_rating`, `review_count`: Tránh JOIN mỗi lần list quán
- `reviews.helpful_count`: Tính toán từ `review_reactions`

**Maintained By:**
- PostgreSQL triggers auto-update khi có changes
- Background jobs (optional) để verify consistency

### 3. **Search Optimization**

**Full-Text Search:**
- PostgreSQL `pg_trgm` extension + GIN indexes
- Fields indexed: `restaurants.name`, `menu_items.name`, `blogs.title`

**Future Migration Path:**
- Elasticsearch khi data > 100k records
- Keep PostgreSQL cho transactional data

## Core Entities

### 1. Users & Authentication

```sql
users (id, email, password_hash, full_name, role, preferences JSONB, ...)
password_reset_tokens (user_id, token, expires_at)
```

**Design Decisions:**
- UUID primary keys (security, distributed systems)
- `role` field: 'user', 'owner', 'admin' (simple RBAC)
- `preferences` JSONB: user settings ít query
- OAuth support: `google_id`, `facebook_id` fields

**Future Extensions:**
- Separate `user_profiles` table nếu cần nhiều metadata
- `user_sessions` table cho advanced session management

### 2. Restaurants

```sql
categories (id SERIAL, name, slug, icon, ...)
restaurants (id UUID, owner_id, category_id, name, address, district, 
             opening_hours JSONB, facilities JSONB, avg_rating, ...)
```

**Design Decisions:**
- **Address fields:** `ward`, `district`, `city` riêng để filter (UC-07)
- **Location:** `latitude`, `longitude` cho Google Maps
- **opening_hours JSONB:** Ít query, có thể phức tạp
  ```json
  {"mon": "8:00-22:00", "tue": "8:00-22:00", "wed": "closed"}
  ```
- **facilities JSONB:** Array đơn giản
  ```json
  ["wifi", "parking", "air_conditioner"]
  ```
- **status field:** 'pending', 'approved', 'rejected' (UC-09: Admin moderation)

**Indexes:**
- `district`, `city` cho filter location
- `avg_rating DESC` cho sort by rating
- GIN index cho full-text search name

**Migration Path:**
```sql
-- Nếu cần query phức tạp cho facilities
CREATE TABLE restaurant_facilities (
  restaurant_id UUID,
  facility_type VARCHAR(50),
  PRIMARY KEY (restaurant_id, facility_type)
);
```

### 3. Menu Items

```sql
menu_items (id UUID, restaurant_id, name, price, category, 
            attributes JSONB, is_available, is_signature, ...)
```

**Design Decisions:**
- **Separate table** (not JSONB) vì cần tìm kiếm món across quán
- `price` DECIMAL để filter "món < 50k"
- `category` VARCHAR đơn giản ('Món chính', 'Đồ uống'...)
  - Can normalize to table later if needed
- `attributes` JSONB cho metadata:
  ```json
  {"spicy_level": 3, "vegetarian": true, "calories": 500}
  ```

**Indexes:**
- `restaurant_id` cho query menu của quán
- `price` cho filter price range
- GIN index cho search tên món

**Why Not Nested Menu Table?**
- Use case đơn giản: chỉ cần flat list món
- Avoid over-engineering: `menus → menu_items` adds complexity
- Can add `menu_groups` later if needed categorization

### 4. Reviews System

```sql
reviews (id, restaurant_id, user_id, rating, content, images JSONB, 
         status, helpful_count, ...)
review_reactions (review_id, user_id, reaction_type)
review_replies (review_id, user_id, content)
```

**Design Decisions:**
- **3 tables approach:**
  - `reviews`: Core review data
  - `review_reactions`: Separate table vì need to query "who reacted"
  - `review_replies`: Owner response (important for engagement!)
  
- **UNIQUE(restaurant_id, user_id):** Prevent duplicate reviews
  - Can be removed if multiple reviews allowed
  
- **images JSONB:** Simple array of URLs
  ```json
  ["review1.jpg", "review2.jpg"]
  ```

- **status field:** Admin moderation (UC-09)

**Triggers:**
- Auto-update `restaurants.avg_rating` on review INSERT/UPDATE

### 5. Blogs

```sql
blogs (id, author_id, title, slug, content, tags JSONB, status, ...)
blog_comments (id, blog_id, user_id, parent_id, content)
```

**Design Decisions:**
- `tags` JSONB: Simple array, ít query
  ```json
  ["địa phương", "ẩm thực", "du lịch"]
  ```
- `blog_comments.parent_id`: Self-referencing cho threaded comments
- `status`: 'draft', 'pending', 'published', 'rejected'

### 6. Bookmarks

```sql
bookmarks (user_id, restaurant_id, notes, UNIQUE(user_id, restaurant_id))
```

Simple junction table với thêm `notes` field cho user's personal notes.

### 7. Chatbot Conversation

```sql
chat_conversations (id, user_id, session_id, metadata JSONB, ...)
chat_messages (id, conversation_id, role, content, intent, entities JSONB, 
               restaurant_results JSONB)
```

**Design Decisions:**
- **Why store chat history?**
  - Analytics: hiểu user behavior
  - Improve chatbot: training data
  - User experience: history across sessions
  
- **entities JSONB:** NER results
  ```json
  {"dish": "phở", "district": "quận 1", "price_max": 50000}
  ```
  
- **restaurant_results JSONB:** Track what was suggested
  ```json
  ["uuid1", "uuid2", "uuid3"]
  ```

- **session_id:** Track anonymous users before login

## JSONB vs Relational: Decision Matrix

| Data Type | Approach | Reason |
|-----------|----------|--------|
| Menu items | **Relational** | Need search across restaurants, filter by price |
| Restaurant facilities | **JSONB** | Rarely filtered, simple array, flexible |
| Opening hours | **JSONB** | Complex structure, rarely queried |
| User preferences | **JSONB** | Per-user config, no need to query |
| Review images | **JSONB** | Simple URL array, no complex queries |
| Blog tags | **JSONB** | Simple array, flexible tagging |
| Chat entities | **JSONB** | Vary by intent, flexible structure |

## Indexes Strategy

### Essential Indexes

```sql
-- Foreign keys (auto-created if using proper constraints)
idx_restaurants_owner, idx_restaurants_category
idx_menu_restaurant, idx_reviews_restaurant, idx_reviews_user

-- Filter/Sort columns
idx_restaurants_district, idx_restaurants_city
idx_restaurants_rating DESC
idx_menu_price

-- Full-text search
idx_restaurants_name_search (GIN)
idx_menu_name_search (GIN)

-- Status checks
idx_restaurants_status, idx_reviews_status
```

### Composite Indexes (Add When Needed)

```sql
-- Common query: "Tìm quán theo category và district"
CREATE INDEX idx_restaurants_cat_dist 
  ON restaurants(category_id, district);

-- Common query: "Menu items của quán, sắp xếp theo giá"
CREATE INDEX idx_menu_restaurant_price 
  ON menu_items(restaurant_id, price);
```

## Performance Considerations

### Query Optimization

**Denormalized Fields:**
- `restaurants.avg_rating`: Avoid `AVG(reviews.rating)` every query
- `restaurants.review_count`: Avoid `COUNT(*)` every query
- Maintained by triggers

**Pagination:**
- Always use `LIMIT` + `OFFSET` or cursor-based pagination
- Index on sort columns (`created_at DESC`, `avg_rating DESC`)

**Full-Text Search:**
```sql
-- Efficient search
SELECT * FROM restaurants
WHERE to_tsvector('english', name) @@ to_tsquery('phở');
```

### JSONB Queries

**Good JSONB Usage (No frequent queries):**
```sql
-- Extract opening hours for display
SELECT opening_hours->>'mon' FROM restaurants WHERE id = '...';
```

**Bad JSONB Usage (Should be relational):**
```sql
-- DO NOT filter by JSONB fields in production!
SELECT * FROM restaurants 
WHERE facilities @> '["wifi"]'::jsonb;  -- SLOW!
```

## Migration Paths

### Stage 1: Current Design (MVP)
- Hybrid approach as specified
- Support 1k-10k restaurants
- PostgreSQL full-text search

### Stage 2: Performance Optimization (10k-100k restaurants)
```sql
-- Normalize menu categories
CREATE TABLE menu_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

ALTER TABLE menu_items 
  ADD COLUMN category_id INTEGER REFERENCES menu_categories(id);
```

### Stage 3: Scale (100k+ restaurants)
- Migrate search to Elasticsearch
- Read replicas for queries
- Cache layer (Redis) for hot data
- Consider partitioning large tables (`reviews`, `chat_messages`)

### Stage 4: Advanced Features
```sql
-- Track menu item popularity
CREATE TABLE menu_item_views (
  menu_item_id UUID,
  date DATE,
  view_count INTEGER,
  PRIMARY KEY (menu_item_id, date)
);

-- Normalize facilities for complex filtering
CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  icon VARCHAR(20)
);

CREATE TABLE restaurant_facilities (
  restaurant_id UUID,
  facility_id INTEGER,
  PRIMARY KEY (restaurant_id, facility_id)
);
```

## Security Considerations

### SQL Injection Prevention
- Use parameterized queries (never string concatenation)
- ORM/query builder validation

### Data Privacy
- Hash passwords (bcrypt, argon2)
- PII encryption for sensitive fields
- GDPR compliance: user data deletion on request

### Row-Level Security (Optional)
```sql
-- Example: Users can only modify their own reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY review_user_policy ON reviews
  FOR ALL
  USING (user_id = current_user_id())
  WITH CHECK (user_id = current_user_id());
```

## Backup & Maintenance

### Backup Strategy
- Daily full backups
- Point-in-time recovery (PITR) enabled
- Test restore monthly

### Maintenance Jobs
```sql
-- Weekly vacuum analyze
VACUUM ANALYZE restaurants;
VACUUM ANALYZE reviews;

-- Reindex if needed
REINDEX INDEX CONCURRENTLY idx_restaurants_name_search;
```

## Testing Strategy

### Data Seeding
```sql
-- Seed categories
INSERT INTO categories (name, slug) VALUES
  ('Quán ăn sáng', 'quan-an-sang'),
  ('Quán cơm', 'quan-com');

-- Seed test users
INSERT INTO users (email, password_hash, role) VALUES
  ('owner@test.com', 'hashed', 'owner'),
  ('user@test.com', 'hashed', 'user'),
  ('admin@test.com', 'hashed', 'admin');
```

### Performance Testing
- Load test với 100k restaurants, 500k reviews
- Benchmark common queries:
  - List restaurants by district
  - Search món ăn
  - Load restaurant detail + menu + reviews

### Consistency Testing
- Verify triggers update `avg_rating` correctly
- Test cascade deletes
- Verify UNIQUE constraints

## API Design Implications

### RESTful Endpoints Alignment

```
GET  /api/restaurants?district=Quận+1&category=cafe&priceRange=$$
  → Query: restaurants table with indexes

GET  /api/restaurants/:id/menu
  → Query: menu_items WHERE restaurant_id = :id

POST /api/reviews
  → Insert review + Trigger updates restaurant.avg_rating

POST /api/chat
  → Insert chat_message with entities extraction
  → Query restaurants based on entities
```

### GraphQL Schema Alignment

```graphql
type Restaurant {
  id: ID!
  name: String!
  menuItems: [MenuItem!]!  # Join menu_items
  reviews: [Review!]!      # Join reviews
  avgRating: Float         # Denormalized field
}
```

## Conclusion

Thiết kế này cung cấp:

✅ **Balance:** Relational cho core features, JSONB cho flexibility  
✅ **Performance:** Proper indexes, denormalization cho common queries  
✅ **Scalability:** Clear migration path khi cần scale  
✅ **Maintainability:** Simple schema, dễ hiểu, dễ extend  

**Next Steps:**
1. Review design với team
2. Implement migrations (Prisma/TypeORM/raw SQL)
3. Seed test data
4. Performance benchmark
