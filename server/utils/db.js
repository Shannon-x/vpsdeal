import mysql from 'mysql2'
import { useRuntimeConfig } from '#imports'

let pool = null

export function getPool() {
  if (!pool) {
    const config = useRuntimeConfig()
    
    pool = mysql.createPool({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbDatabase,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }).promise()
  }
  
  return pool
}