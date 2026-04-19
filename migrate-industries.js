const fs = require('fs');
const mysql = require('mysql2/promise');

async function migrateIndustriesToSQL() {
  try {
    // Read the JSON file
    const filePath = './industries.json';
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const industriesData = JSON.parse(fileContent);

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: '193.203.184.230',
      user: 'u670081799_wavenxd',
      password: '>j3am2lU5',
      database: 'u670081799_WaveNxD_DB',
    });

    console.log('✅ Connected to remote MySQL database');

    // Clear existing data
    await connection.query('DELETE FROM industry_application_papers');
    await connection.query('DELETE FROM industry_applications');
    await connection.query('DELETE FROM industries');
    console.log('🧹 Cleared existing data');

    let industriesCount = 0;
    let applicationsCount = 0;
    let papersCount = 0;

    // Process each industry
    for (const industry of industriesData) {
      // Insert industry
      const [industryResult] = await connection.execute(
        `INSERT INTO industries (name, slug, is_active) 
         VALUES (?, ?, ?)`,
        [
          industry.title,
          industry.slug,
          industry.isActive ? 1 : 0,
        ]
      );

      const industryId = industryResult.insertId;
      industriesCount++;
      console.log(`📌 Industry: ${industry.title} (ID: ${industryId})`);

      // Process applications
      if (industry.applications && Array.isArray(industry.applications)) {
        for (const app of industry.applications) {
          const [appResult] = await connection.execute(
            `INSERT INTO industry_applications 
             (industry_id, title, slug, description, image) 
             VALUES (?, ?, ?, ?, ?)`,
            [
              industryId,
              app.title,
              app.slug || '',
              app.description || '',
              app.image || '',
            ]
          );

          const appId = appResult.insertId;
          applicationsCount++;
          console.log(`  ├─ Application: ${app.title}`);

          // Process technical papers
          if (app.technicalPapers && Array.isArray(app.technicalPapers)) {
            for (const paper of app.technicalPapers) {
              await connection.execute(
                `INSERT INTO industry_application_papers 
                 (application_id, title, link) 
                 VALUES (?, ?, ?)`,
                [appId, paper.title || '', paper.link || paper.fileUrl || '']
              );
              papersCount++;
              console.log(`    └─ Paper: ${paper.title}`);
            }
          }
        }
      }
    }

    console.log('\n✅ Migration Complete!');
    console.log(`   📍 Industries imported: ${industriesCount}`);
    console.log(`   📄 Applications imported: ${applicationsCount}`);
    console.log(`   📋 Technical papers imported: ${papersCount}`);

    await connection.end();
    console.log('\n✨ Database connection closed');
  } catch (error) {
    console.error('❌ Migration Error:', error.message);
    process.exit(1);
  }
}

migrateIndustriesToSQL();
