import 'dotenv/config';
import { createClient } from '@libsql/client';
import prisma from '../src/lib/prisma.js';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('🚀 Starting full migration to Turso...');

  // 1. Setup Clients
  const localClient = createClient({
    url: 'file:prisma/dev.db',
  });

  try {
    // 2. Apply Schema to Turso
    console.log('📝 Applying schema to Turso...');
    const schemaSql = fs.readFileSync('schema.sql', 'utf8');
    
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      let retries = 3;
      while (retries > 0) {
        try {
          await prisma.$executeRawUnsafe(statement);
          break; // Success
        } catch (err) {
          if (err.message.includes('already exists')) break;
          
          console.warn(`   ⚠️ Attempt failed (${retries} retries left): ${err.message}`);
          retries--;
          if (retries === 0) {
             console.error(`   ❌ Failed to execute statement after 3 attempts.`);
          } else {
             await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 200)); // Delay between statements
    }
    console.log('   ✅ Schema application phase finished.');

    // 3. Define Tables in order (parents first)
    const tables = ['Admin', 'Santri', 'Absensi', 'Keuangan', 'Galeri', 'Prestasi'];

    for (const table of tables) {
      console.log(`📦 Migrating table: ${table}...`);
      
      const localData = await localClient.execute(`SELECT * FROM ${table}`);
      console.log(`   Found ${localData.rows.length} rows in local.`);

      if (localData.rows.length === 0) continue;

      const modelName = table.charAt(0).toLowerCase() + table.slice(1);
      
      let successCount = 0;
      for (const row of localData.rows) {
        const data = { ...row };
        
        // Convert integer/string timestamps to Date objects for Prisma
        if (data.createdAt) {
          data.createdAt = new Date(data.createdAt);
        }

        let retries = 3;
        while (retries > 0) {
          try {
            await prisma[modelName].upsert({
              where: { id: row.id },
              update: data,
              create: data
            });
            successCount++;
            break;
          } catch (err) {
            console.warn(`   ⚠️ Row ${row.id} attempt failed (${retries} retries left): ${err.message}`);
            retries--;
            if (retries === 0) {
              console.error(`   ❌ Error inserting row ${row.id} in ${table}:`, err.message);
            } else {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay between rows
      }
      
      console.log(`   ✅ Finished ${table} (${successCount}/${localData.rows.length} rows)`);
    }

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await localClient.close();
    await prisma.$disconnect();
  }
}

migrate();

