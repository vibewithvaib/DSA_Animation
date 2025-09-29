import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import problems from '../state/problems.json';
import Editor from '../ui/Editor';
import SimulationPanel from '../ui/SimulationPanel';
import { useSimulationController } from '../simulation/useSimulationController';
import { evaluateUserCode } from '../utils/evaluator';
import { useProgress } from '../state/progress';

export default function Solve() {
  const { problemId } = useParams();
  const problem = useMemo(() => problems.find(p => String(p.id) === String(problemId)), [problemId]);
  const [userCode, setUserCode] = useState(problem?.starterCode || '');
  const [result, setResult] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const controller = useSimulationController(1200);
  const { markSolved } = useProgress();

  if (!problem) return <div>Problem not found.</div>;

  const run = async () => {
    let input = problem.sampleInput;
    if (customInput.trim()) {
      try {
        input = JSON.parse(customInput);
      } catch (e) {
        setResult({ passed: false, output: null, error: 'Invalid custom input JSON' });
        controller.loadSteps([]);
        return;
      }
    }
    const customProblem = { ...problem, sampleInput: input };
    const { passed, output, error, steps } = await evaluateUserCode(userCode, customProblem);
    setResult({ passed, output, error });
    controller.loadSteps(steps || []);
    // Auto-pause on error step
    if ((steps||[]).some(s => s && s.error)) {
      controller.pause();
    }
    if (passed) markSolved(problem.id, problem.categoryId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <h1 className="text-xl font-semibold">{problem.title}</h1>
          <p className="text-slate-300 mt-2 whitespace-pre-wrap">{problem.description}</p>
          <div className="mt-3 text-sm text-slate-400">Sample Input: {JSON.stringify(problem.sampleInput)}</div>
          <div className="text-sm text-slate-400">Sample Output: {JSON.stringify(problem.sampleOutput)}</div>
          <div className="mt-4">
            <label className="block text-xs text-slate-400 mb-1">Custom Input (JSON)</label>
            <textarea value={customInput} onChange={e=>setCustomInput(e.target.value)} rows={4} className="w-full rounded bg-slate-950 border border-slate-800 p-2 text-sm font-mono" placeholder={JSON.stringify(problem.sampleInput)} />
            <div className="text-[11px] text-slate-500 mt-1">Leave empty to use the sample input. Must be valid JSON matching the problem's expected input shape.</div>
          </div>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900">
          <Editor value={userCode} onChange={setUserCode} />
          <div className="flex items-center gap-2 p-3 border-t border-slate-800">
            <button onClick={run} className="px-3 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white text-sm">Run</button>
            {result && (
              <div className="text-sm">
                {result.error ? (
                  <span className="text-red-400">{String(result.error)}</span>
                ) : (
                  <span className={result.passed ? 'text-green-400' : 'text-yellow-400'}>
                    {result.passed ? 'Passed' : 'Output: ' + JSON.stringify(result.output)}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-800 text-xs text-slate-400">
            Tip: You can emit custom simulation steps by accepting a second parameter in your solve function (input, record) and calling record(stepObject). If provided, your steps will drive the animation.
          </div>
        </div>
      </div>
      <div>
        <SimulationPanel controller={controller} />
      </div>
    </div>
  );
}


