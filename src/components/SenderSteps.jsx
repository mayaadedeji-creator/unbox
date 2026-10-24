import './SenderSteps.css';

const STEPS = ['Address', 'Fill', 'Preview', 'Share'];

// Header for the gift maker's pages: "① Address — ② Fill — ③ Preview — ④ Share" plus a title.
export default function SenderSteps({ step, title, subtitle }) {
  return (
    <div className="sender-header">
      <ol className="sender-steps">
        {STEPS.map((name, i) => {
          const n = i + 1;
          const state = n < step ? 'is-done' : n === step ? 'is-current' : '';
          return (
            <li key={name} className={state} aria-current={n === step ? 'step' : undefined}>
              <span className="sender-step-dot">{n < step ? '✓' : n}</span>
              {name}
            </li>
          );
        })}
      </ol>
      <h1>{title}</h1>
      {subtitle && <p className="sender-subtitle">{subtitle}</p>}
    </div>
  );
}
