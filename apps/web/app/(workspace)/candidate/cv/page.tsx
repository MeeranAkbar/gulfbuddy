import { WorkspacePage } from '../../../../components/workspace/workspace-page';
import { getCandidateCvAssets } from '../../../../lib/workspace/profile-queries';
import { formatDate, formatLabel } from '../../../../lib/workspace/formatters';

function formatFileSize(bytes: number) {
  if (!bytes) return '0 MB';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function CandidateCvPage() {
  const assets = await getCandidateCvAssets();
  const parsedCount = assets.filter((item) => item.parsingStatus === 'parsed').length;
  const pendingCount = assets.filter((item) => ['pending', 'processing'].includes(item.parsingStatus)).length;

  return (
    <WorkspacePage
      eyebrow="Candidate CV"
      title="Keep CV assets clean, current, and ready for the next application moment."
      description="CV handling should feel secure and intentional. Candidates need to understand which files are current, which are still processing, and how ready their application assets are for the next role."
      actions={[
        { href: '/candidate/applied-jobs', label: 'Applied jobs' },
        { href: '/candidate', label: 'Back to candidate hub', tone: 'secondary' }
      ]}
      metrics={[
        {
          label: 'CV files',
          value: String(assets.length),
          hint: 'Candidates should always know what application assets exist inside the workspace.'
        },
        {
          label: 'Parsed assets',
          value: String(parsedCount),
          hint: 'Parsed CVs can later support stronger profile autofill and easier apply flows.'
        },
        {
          label: 'Still processing',
          value: String(pendingCount),
          hint: 'Uploads in motion should never feel invisible or uncertain.'
        }
      ]}
    >
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <section className="space-y-5">
          {assets.length ? (
            assets.map((asset) => (
              <article key={asset.id} className="gh-card overflow-hidden">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(198,169,112,0.12),transparent_40%),linear-gradient(135deg,var(--surface-alt),var(--surface))] p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                          {asset.fileType}
                        </span>
                        <span className="rounded-full border border-[color:var(--info)]/20 bg-[color:var(--info)]/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--info)]">
                          {formatLabel(asset.parsingStatus)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-ink">{asset.fileName}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          Uploaded {formatDate(asset.createdAt)} / Updated {formatDate(asset.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:w-[19rem]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Asset size</p>
                      <p className="mt-3 text-lg font-semibold tracking-tight text-ink">{formatFileSize(asset.fileSize)}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.35rem] border border-dashed border-[var(--border-default)] bg-[var(--surface-alt)] p-6 text-sm leading-7 text-[var(--text-secondary)]">
              No CV assets yet. This lane is ready to hold a cleaner, application-ready document stack once uploads move through the staging flow.
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">CV posture</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Latest asset</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{assets[0]?.fileType || 'None'}</p>
              </div>
              <div className="rounded-[1.15rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Processing status</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{pendingCount ? 'In motion' : 'Clear'}</p>
              </div>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Why this lane matters</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>CV clarity reduces drop-off at the moment a candidate is finally ready to apply.</p>
              <p>This page should always make it obvious what file exists, what is current, and what the system is still processing.</p>
            </div>
          </section>

          <section className="gh-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">What strong CV handling needs</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>Candidates should be able to tell which file is current, whether parsing finished, and whether the asset is ready for one-click apply flows.</p>
              <p>As runtime flows go live, this lane should become the quiet control panel for application readiness.</p>
            </div>
          </section>
        </aside>
      </div>
    </WorkspacePage>
  );
}
