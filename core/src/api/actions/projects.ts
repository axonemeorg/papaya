import db from 'database/client'
import { ProjectScan } from 'database/schema';
import { sql, and, eq, max } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';



const latestScans = db
  .select()
  .from(ProjectScan)
  .innerJoin(
    db
      .select({
        softwareProjectId: ProjectScan.softwareProjectId,
        latest_dispatched_at: max(ProjectScan.dispatchedAt).as('latest_dispatched_at')
      })
      .from(ProjectScan)
      .groupBy(ProjectScan.softwareProjectId)
      .as('latest_scan'),
    
    (scan, latestScan) =>
      scan.software_project_id.eq(latestScan.software_project_id)
      .and(scan.dispatched_at.eq(latestScan.latest_dispatched_at))
  );

export const _getListProjectsQuery = () => {
    // Get the latest scan timestamp for all projects
    const ProjectScanTimestamps = db.$with(
        .select({
            softwareProjectId: ProjectScan.softwareProjectId,
            dispatchedAt: sql`max(${ProjectScan.dispatchedAt})`,
        })
        .from(ProjectScan)
        .groupBy(ProjectScan.softwareProjectId,)


    const LatestProjectScans = db
        .select()
        .from(ProjectScan)
        .innerJoin(ProjectScanTimestamps.as('asdf')), and(
            ProjectScan.softwareProjectId.getSQL(), 'asdf.test'),
            eq('sps.dispatched_at', 'latest_scans.max_dispatched_at')
        ))

    return projectScanTimestamps.execute()
}


// const _getListProjectsQuery_old = (): Knex.QueryBuilder => {
//     const knex = getKnex();

//     // Define the CTE for the latest scans of each project
//     const latestScans = knex('software_project_scan')
//         .select('software_project_id', knex.raw('MAX(dispatched_at) as max_dispatched_at'))
//         .groupBy('software_project_id')
//         .as('latest_scans');

//     const latestScansCte = dbClient.$with('latest_scans').as(
//         dbClient
//             .select({
//                 software_project_id: ProjectScan.softwareProjectId,
//                 dispatched_at: sql`MAX(${ProjectScan.dispatchedAt}) as max_dispatched_at`,
                
//             })
//             .from(ProjectScan)
//             .groupBy('software_project_id')
//             // .as('latest_scans')
//     );

//     // CTE for details of the latest scans
//     const latestScanDetails = knex('software_project_scan as sps')
//         .select('sps.*')
//         .join(latestScans, function() {
//             this.on('sps.software_project_id', '=', 'latest_scans.software_project_id')
//                 .andOn('sps.dispatched_at', '=', 'latest_scans.max_dispatched_at');
//         })
//         .as('latest_scan_details');

//     // CTE for tags associated with the latest scans
//     const tags = knex('software_project_scan_tag as spt')
//         .select('spt.software_project_scan_id')
//         .select(knex.raw('array_agg(distinct spt.tag) filter (where spt.tag is not null) as tags'))
//         .join(latestScanDetails, 'spt.software_project_scan_id', '=', 'latest_scan_details.software_project_scan_id')
//         .groupBy('spt.software_project_scan_id')
//         .as('tags');

//     // CTE for languages associated with the latest scans
//     const languages = knex('software_project_language as spl')
//         .select('spl.software_project_scan_id')
//         .select(knex.raw('json_agg(json_build_object(\'language_name\', spl.language_name, \'num_lines\', spl.num_lines)) as languages'))
//         .join(latestScanDetails, 'spl.software_project_scan_id', '=', 'latest_scan_details.software_project_scan_id')
//         .groupBy('spl.software_project_scan_id')
//         .as('languages');

//     // Final query assembling all the pieces
//     const projects = knex('software_project as sp')
//         .select('sp.*')
//         .select({
//             last_scan: knex.raw(`
//                 json_build_object(
//                     'software_project_scan_id', latest_scan_details.software_project_scan_id,
//                     'software_project_id', latest_scan_details.software_project_id,
                    
//                     'dispatched_at', latest_scan_details.dispatched_at,
//                     'completed_at', latest_scan_details.completed_at,
//                     'aborted_at', latest_scan_details.aborted_at,
//                     'tags', tags.tags,
//                     'languages', languages.languages
//                 )
//             `)
//         })
//         .leftJoin(latestScanDetails, 'sp.software_project_id', 'latest_scan_details.software_project_id')
//         .leftJoin(tags, 'latest_scan_details.software_project_scan_id', 'tags.software_project_scan_id')
//         .leftJoin(languages, 'latest_scan_details.software_project_scan_id', 'languages.software_project_scan_id')
//         .orderBy('sp.created_at', 'desc');

//     return projects;
// }
