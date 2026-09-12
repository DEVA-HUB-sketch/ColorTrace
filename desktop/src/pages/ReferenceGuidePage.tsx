export default function ReferenceGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-secondaryText">Reference</p>
        <h2 className="mt-1 text-3xl font-semibold text-primaryText">Reference Card Guide</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm text-secondaryText">
          This guide describes the current project-supported reference-card workflow in the desktop frontend. Scientific calibration, CV detection, and model inference remain unavailable until those backend and mobile integrations are added.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">Why the reference card is required</h3>
          <ul className="mt-4 space-y-3 text-sm text-secondaryText">
            <li>• Used to standardise colour observation across captures.</li>
            <li>• Provides fixed known colours for calibration.</li>
            <li>• Supports alignment and perspective correction.</li>
            <li>• Helps identify capture quality issues such as glare or misalignment.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-primaryText">How to place it</h3>
          <ul className="mt-4 space-y-3 text-sm text-secondaryText">
            <li>• Keep the reference colour card fully visible within the capture area.</li>
            <li>• Ensure the card is flat and aligned with the test reaction.</li>
            <li>• Keep lighting uniform and avoid glare.</li>
            <li>• Hold the camera steadily to minimise motion blur.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-primaryText">Current frontend status</h3>
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-secondaryText">
          Visual explanation of ArUco markers and known colour references will be displayed here in a future computer-vision integration step.
        </div>
      </div>
    </div>
  );
}
