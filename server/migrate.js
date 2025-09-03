const fs = require('fs').promises;
const path = require('path');
const db = require('./db');

/**
 * 数据库迁移运行器
 */
class MigrationRunner {
  constructor() {
    this.migrationsPath = path.join(__dirname, '../database/migrations');
  }

  /**
   * 确保迁移历史表存在
   */
  async ensureMigrationTable() {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  }

  /**
   * 获取已执行的迁移
   */
  async getExecutedMigrations() {
    const [rows] = await db.query('SELECT filename FROM migrations ORDER BY id');
    return rows.map(row => row.filename);
  }

  /**
   * 执行单个迁移文件
   */
  async executeMigration(filename) {
    const filepath = path.join(this.migrationsPath, filename);
    const sql = await fs.readFile(filepath, 'utf8');
    
    // 开始事务
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      // 分割SQL语句（以分号分隔）
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      // 执行每个语句
      for (const statement of statements) {
        await connection.execute(statement);
      }
      
      // 记录迁移
      await connection.execute(
        'INSERT INTO migrations (filename) VALUES (?)',
        [filename]
      );
      
      await connection.commit();
      console.log(`✅ 执行迁移: ${filename}`);
    } catch (error) {
      await connection.rollback();
      console.error(`❌ 迁移失败 ${filename}:`, error.message);
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * 运行所有未执行的迁移
   */
  async runPendingMigrations() {
    try {
      await this.ensureMigrationTable();
      
      // 获取所有迁移文件
      const files = await fs.readdir(this.migrationsPath);
      const migrationFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort(); // 确保按顺序执行
      
      // 获取已执行的迁移
      const executedMigrations = await this.getExecutedMigrations();
      
      // 找出未执行的迁移
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );
      
      if (pendingMigrations.length === 0) {
        console.log('✅ 没有待执行的迁移');
        return;
      }
      
      console.log(`🔄 发现 ${pendingMigrations.length} 个待执行的迁移`);
      
      // 执行每个迁移
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }
      
      console.log('✅ 所有迁移执行完成');
    } catch (error) {
      console.error('❌ 迁移过程出错:', error);
      throw error;
    }
  }

  /**
   * 回滚最后一个迁移（需要对应的down迁移文件）
   */
  async rollbackLastMigration() {
    const [lastMigration] = await db.query(
      'SELECT filename FROM migrations ORDER BY id DESC LIMIT 1'
    );
    
    if (!lastMigration.length) {
      console.log('没有可回滚的迁移');
      return;
    }
    
    // 这里需要对应的down迁移文件
    console.log('⚠️ 回滚功能需要对应的down迁移文件');
  }
}

// 如果直接运行此文件，执行迁移
if (require.main === module) {
  const runner = new MigrationRunner();
  runner.runPendingMigrations()
    .then(() => {
      console.log('✅ 迁移完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 迁移失败:', error);
      process.exit(1);
    });
}

module.exports = MigrationRunner;