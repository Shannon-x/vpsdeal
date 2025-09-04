# Issue #2: Database Optimization - Parallelization Analysis

## Task Overview
Database optimization to support comments, price history tracking, and multi-language content. This involves creating new tables, adding columns to existing tables, and ensuring optimal query performance through proper indexing.

## Current State Analysis
- **Existing Tables**: categories, vps_products, admins, messages, stats, site_settings, nav_menus, admin_roles, admin_role_assignments, admin_logs
- **Database Connection**: MySQL with connection pooling (mysql2)
- **Migration System**: SQL file-based with init-db.js script

## Parallel Workflows

### Stream A: Database Schema Design & SQL Migration
**Focus**: Create SQL migration scripts for new tables and columns
**Files**:
- `/opt/vps/database/migrations/001_add_comments_table.sql` (new)
- `/opt/vps/database/migrations/002_add_price_history_table.sql` (new)
- `/opt/vps/database/migrations/003_add_translations_support.sql` (new)
- `/opt/vps/database/schema.sql` (update with new schema)

**Tasks**:
1. Design and create comments table schema
   - Fields: id, vps_id, user_id, content, created_at, status
   - Foreign keys to vps_products
   - Indexes on vps_id, user_id, status, created_at
2. Design and create price_history table schema
   - Fields: id, vps_id, price, date, currency
   - Foreign key to vps_products
   - Composite index on (vps_id, date)
3. Add translated_fields column to vps_products
   - JSON column type for flexible translation storage
   - Consider adding translation support to categories table

### Stream B: Database Access Layer Implementation
**Focus**: Update database connection layer and create model functions
**Files**:
- `/opt/vps/server/models/comments.js` (new)
- `/opt/vps/server/models/priceHistory.js` (new)
- `/opt/vps/server/models/translations.js` (new)
- `/opt/vps/server/db.js` (verify connection pooling settings)

**Tasks**:
1. Create comment model with CRUD operations
   - getCommentsByVpsId()
   - createComment()
   - updateCommentStatus()
   - deleteComment()
2. Create price history model
   - trackPriceChange()
   - getPriceHistory()
   - getLatestPrice()
3. Create translation helper functions
   - getTranslatedFields()
   - updateTranslations()
   - getSupportedLanguages()

### Stream C: Migration System Enhancement
**Focus**: Improve migration system to handle incremental updates
**Files**:
- `/opt/vps/server/migrate.js` (new)
- `/opt/vps/database/migrations/.migration-lock` (new)
- Update `/opt/vps/server/init-db.js`

**Tasks**:
1. Create migration runner script
   - Track applied migrations
   - Support rollback functionality
   - Handle migration ordering
2. Create migration tracking table
   - Store migration history
   - Prevent duplicate runs
3. Update init-db.js to use migration system

### Stream D: Performance Testing & Optimization
**Focus**: Test queries and add performance monitoring
**Files**:
- `/opt/vps/server/tests/db-performance.test.js` (new)
- `/opt/vps/server/utils/dbMonitor.js` (new)

**Tasks**:
1. Create performance test suite
   - Test comment queries with large datasets
   - Test price history aggregations
   - Test translation queries
2. Implement query monitoring
   - Log slow queries
   - Track connection pool usage
3. Create optimization recommendations document

## Dependencies Between Streams
- Stream B depends on Stream A completion for table structures
- Stream C can run independently but should be ready before Stream A migrations
- Stream D depends on Streams A and B for testing actual implementations

## Shared Resources
- Database connection pool (read-only access for all streams)
- Environment variables for database configuration
- Docker compose MySQL service

## Risk Mitigation
1. **Backward Compatibility**: Ensure all changes are additive, no breaking changes to existing tables
2. **Data Integrity**: Use transactions for migration scripts
3. **Testing**: Each stream should include unit tests for their components
4. **Documentation**: Update schema documentation as part of each stream

## Completion Criteria
- All migration scripts tested and ready for deployment
- Model functions implemented with full test coverage
- Performance benchmarks established
- Migration system capable of handling future database changes
- Documentation updated with new schema and API references

## Estimated Timeline
- Stream A: 2 hours (schema design and SQL)
- Stream B: 2 hours (model implementation)
- Stream C: 1 hour (migration system)
- Stream D: 1 hour (testing and optimization)
- Total: 6 hours (with 4 hours possible through parallelization)