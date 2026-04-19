const mysql = require('mysql2/promise');

async function updateSchema() {
  try {
    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: '193.203.184.230',
      user: 'u670081799_wavenxd',
      password: '>j3am2lU5',
      database: 'u670081799_WaveNxD_DB',
    });

    console.log('✅ Connected to remote MySQL database');

    // Add title column if it doesn't exist
    try {
      await connection.query(
        `ALTER TABLE industries ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT 'Untitled'`
      );
      console.log('✅ Added title column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ title column already exists');
      } else {
        throw err;
      }
    }

    // Add tagline column if it doesn't exist
    try {
      await connection.query(
        `ALTER TABLE industries ADD COLUMN tagline VARCHAR(255)`
      );
      console.log('✅ Added tagline column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ tagline column already exists');
      } else {
        throw err;
      }
    }

    // Add image column if it doesn't exist
    try {
      await connection.query(
        `ALTER TABLE industries ADD COLUMN image VARCHAR(255)`
      );
      console.log('✅ Added image column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️ image column already exists');
      } else {
        throw err;
      }
    }

    console.log('✅ Schema updated successfully');
    await connection.end();

  } catch (error) {
    console.error('❌ Error updating schema:', error.message);
    process.exit(1);
  }
}

updateSchema();
