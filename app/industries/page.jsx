import IndustriesClient from './IndustriesClient';
import pool from '../lib/db';

async function getIndustries() {
  const [industries] = await pool.query(
    `SELECT *
     FROM industries
     WHERE is_active = TRUE
     ORDER BY created_at DESC`
  );

  const industriesWithApplications = await Promise.all(
    industries.map(async (industry) => {
      const [applications] = await pool.query(
        `SELECT *
         FROM industry_applications
         WHERE industry_id = ?`,
        [industry.id]
      );

      const appsWithPapers = await Promise.all(
        applications.map(async (application) => {
          const [papers] = await pool.query(
            `SELECT title, link
             FROM industry_application_papers
             WHERE application_id = ?`,
            [application.id]
          );

          return {
            ...application,
            _id: String(application.id),
            technicalPapers: papers,
          };
        })
      );

      return {
        ...industry,
        _id: String(industry.id),
        isActive: Boolean(industry.is_active),
        createdAt: industry.created_at?.toISOString?.() ?? industry.created_at,
        updatedAt: industry.updated_at?.toISOString?.() ?? industry.updated_at,
        applications: appsWithPapers,
      };
    })
  );

  return industriesWithApplications;
}

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <IndustriesClient industries={industries} />
    </section>
  );
}
