// Evaluate user code safely-ish in a Function sandbox.
// For simulations, we instrument two problems: Bubble Sort and DFS.

function simulateBubbleSort(array) {
  const steps = [];
  const a = array.slice();
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 1; i < a.length; i++) {
      steps.push({ type: 'bubble', array: a.slice(), compare: [i - 1, i], swapped: false, explain: `Compare a[${i-1}] and a[${i}]` });
      if (a[i - 1] > a[i]) {
        const t = a[i - 1];
        a[i - 1] = a[i];
        a[i] = t;
        swapped = true;
        steps.push({ type: 'bubble', array: a.slice(), compare: [i - 1, i], swapped: true, explain: `Swap a[${i-1}] and a[${i}]` });
      }
    }
  }
  return { steps, output: a };
}

function layoutNodes(n) {
  // simple circle layout
  const cx = 200, cy = 120, R = 90;
  return Array.from({ length: n }, (_, i) => {
    const theta = (2 * Math.PI * i) / n;
    return { x: Math.round(cx + R * Math.cos(theta)), y: Math.round(cy + R * Math.sin(theta)) };
  });
}

function simulateDFS(graph) {
  const { n, edges, start } = graph;
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  for (const list of adj) list.sort((a, b) => a - b);
  const visited = Array(n).fill(false);
  const order = [];
  const steps = [];
  const nodes = layoutNodes(n);

  function pushStep(active) {
    steps.push({ type: 'dfs', nodes, edges, active, visited: order.slice(), explain: `Visit node ${active} and recurse on its neighbors` });
  }

  (function dfs(u) {
    visited[u] = true;
    order.push(u);
    pushStep(u);
    for (const v of adj[u]) if (!visited[v]) dfs(v);
  })(start);

  return { steps, output: order };
}

const MAX_STEPS = 5000;
const MAX_RUNTIME_MS = 3000;

export async function evaluateUserCode(code, problem) {
  try {
    const fn = new Function(`${code}; return typeof solve==='function'? solve: null;`);
    const solve = fn();
    if (typeof solve !== 'function') {
      return { passed: false, output: null, error: 'No function solve found', steps: [] };
    }

    // Allow user-instrumented steps via second parameter `record`
    const userSteps = [];
    let errorTriggered = null;
    const start = Date.now();
    const recorder = {
      record(step) {
        if (!step || typeof step !== 'object') return;
        userSteps.push(step);
        if (userSteps.length > MAX_STEPS) throw new Error(`Too many steps (> ${MAX_STEPS}). Possible infinite loop.`);
        if (Date.now() - start > MAX_RUNTIME_MS) throw new Error('Execution time limit exceeded.');
      },
      watch(vars) {
        if (typeof vars !== 'object') return;
        userSteps.push({ type: problem.simType, explain: 'Watch variables', watch: vars });
      },
      assert(condition, message = 'Assertion failed') {
        if (!condition) {
          const err = { type: problem.simType, error: true, explain: message };
          userSteps.push(err);
          errorTriggered = message;
          throw new Error(message);
        }
      },
      error(message = 'Runtime error') {
        const err = { type: problem.simType, error: true, explain: message };
        userSteps.push(err);
        errorTriggered = message;
        throw new Error(message);
      }
    };

    // Determine by simType for exact visualization
    let userOutput;
    switch (problem.simType) {
      case 'bubble': {
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        const sim = userSteps.length ? { steps: userSteps, output: null } : simulateBubbleSort(problem.sampleInput);
        const expected = sim.output ?? simulateBubbleSort(problem.sampleInput).output;
        const steps = sim.steps;
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'insertion': {
        const arr = problem.sampleInput.slice();
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        if (userSteps.length) {
          const expected = arr.slice().sort((a,b)=>a-b);
          const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
          return { passed, output: userOutput, expected, error: null, steps: userSteps };
        }
        const steps = [];
        for (let i = 1; i < arr.length; i++) {
          let j = i - 1, key = arr[i];
          steps.push({ type: 'insertion', array: arr.slice(), i, j, keyIndex: i, explain: `Pick key=a[${i}], shift larger elements right` });
          while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            steps.push({ type: 'insertion', array: arr.slice(), i, j, keyIndex: i, explain: `Shift a[${j+1}] to a[${j+2}]` });
          }
          arr[j + 1] = key;
          steps.push({ type: 'insertion', array: arr.slice(), i, j: j + 1, keyIndex: j + 1, explain: `Insert key at position ${j+1}` });
        }
        const expected = arr;
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'selection': {
        const a = problem.sampleInput.slice();
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        if (userSteps.length) {
          const expected = a.slice().sort((x,y)=>x-y);
          const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
          return { passed, output: userOutput, expected, error: null, steps: userSteps };
        }
        const steps = [];
        for (let i = 0; i < a.length - 1; i++) {
          let min = i;
          steps.push({ type: 'selection', array: a.slice(), i, minIndex: min, scanning: i, explain: `Assume a[${i}] is current min` });
          for (let j = i + 1; j < a.length; j++) {
            steps.push({ type: 'selection', array: a.slice(), i, minIndex: min, scanning: j, explain: `Scan j=${j}, update min if a[j]<a[min]` });
            if (a[j] < a[min]) min = j;
          }
          if (min !== i) {
            const t = a[i]; a[i] = a[min]; a[min] = t;
            steps.push({ type: 'selection', array: a.slice(), i, minIndex: min, scanning: min, explain: `Swap a[${i}] and a[${min}]` });
          }
        }
        const expected = a;
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'dfs': {
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        const sim = userSteps.length ? { steps: userSteps, output: null } : simulateDFS(problem.sampleInput);
        const expected = sim.output ?? simulateDFS(problem.sampleInput).output;
        const steps = sim.steps;
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'bfs': {
        const { n, edges, start } = problem.sampleInput;
        const adj = Array.from({ length: n }, () => []);
        for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
        for (const list of adj) list.sort((a, b) => a - b);
        const nodes = layoutNodes(n);
        const steps = [];
        const vis = Array(n).fill(false);
        const q = [start]; vis[start] = true;
        const visitedOrder = [];
        function pushStep(active) {
          steps.push({ type: 'bfs', nodes, edges, active, visited: visitedOrder.slice(), queue: q.slice(), explain: `Process ${active}, enqueue its unvisited neighbors` });
        }
        pushStep(start);
        while (q.length) {
          const u = q.shift(); visitedOrder.push(u); pushStep(u);
          for (const v of adj[u]) if (!vis[v]) { vis[v] = true; q.push(v); pushStep(u); }
        }
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        const finalSteps = userSteps.length ? userSteps : steps;
        // compute expected BFS order
        const expected = (function refBFS(){
          const vis2 = Array(n).fill(false), q2=[start], ord=[]; vis2[start]=true; for(;q2.length;){ const u=q2.shift(); ord.push(u); for(const v of adj[u]) if(!vis2[v]){ vis2[v]=true; q2.push(v); } } return ord; })();
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps: finalSteps };
      }
      case 'two_sum': {
        const { nums, target } = problem.sampleInput;
        const steps = [];
        const map = new Map();
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        if (userSteps.length) {
          // compute expected pair
          const ref = (function(){ const m=new Map(); for(let i=0;i<nums.length;i++){ const need=target-nums[i]; if(m.has(need)) return [m.get(need), i]; m.set(nums[i], i);} return []; })();
          const passed = JSON.stringify(userOutput) === JSON.stringify(ref);
          return { passed, output: userOutput, expected: ref, error: null, steps: userSteps };
        }
        for (let i = 0; i < nums.length; i++) {
          const need = target - nums[i];
          steps.push({ type: 'two_sum', nums: nums.slice(), i, checking: need, mapKeys: Array.from(map.keys()), explain: `i=${i}, need=${need}. Check map for need.` });
          if (map.has(need)) break;
          map.set(nums[i], i);
          steps.push({ type: 'two_sum', nums: nums.slice(), i, checking: need, mapKeys: Array.from(map.keys()), explain: `Put nums[i]=${nums[i]} in map` });
        }
        const expected = (function(){ const m=new Map(); for(let i=0;i<nums.length;i++){ const need=target-nums[i]; if(m.has(need)) return [m.get(need), i]; m.set(nums[i], i);} return []; })();
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'sliding_window': {
        const s = problem.sampleInput;
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(s, recorder)) : await Promise.resolve(solve(s));
        if (userSteps.length) {
          const expected = (function(){ const set=new Set(); let l=0,b=0; for(let r=0;r<s.length;r++){ while(set.has(s[r])){ set.delete(s[l++]); } set.add(s[r]); b=Math.max(b,r-l+1);} return b; })();
          const passed = userOutput === expected;
          return { passed, output: userOutput, expected, error: null, steps: userSteps };
        }
        const steps = [];
        const set = new Set();
        let l = 0, best = 0;
        for (let r = 0; r < s.length; r++) {
          while (set.has(s[r])) { set.delete(s[l]); l++; steps.push({ type: 'sliding_window', s, l, r: r-1, best, explain: `Duplicate '${s[r]}' detected. Move left to ${l}` }); }
          set.add(s[r]);
          best = Math.max(best, r - l + 1);
          steps.push({ type: 'sliding_window', s, l, r, best, explain: `Expand right to ${r}. Best=${best}` });
        }
        const expected = (function(){ const set=new Set(); let l=0,b=0; for(let r=0;r<s.length;r++){ while(set.has(s[r])){ set.delete(s[l++]); } set.add(s[r]); b=Math.max(b,r-l+1);} return b; })();
        const passed = userOutput === expected;
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'dp_fib': {
        const n = problem.sampleInput;
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(n, recorder)) : await Promise.resolve(solve(n));
        if (userSteps.length) {
          const expected = (function(){ if(n<=1) return n; let a=0,b=1; for(let i=2;i<=n;i++){ const c=a+b; a=b; b=c; } return b; })();
          const passed = userOutput === expected;
          return { passed, output: userOutput, expected, error: null, steps: userSteps };
        }
        const dp = Array(n + 1).fill(0); dp[1] = 1;
        const steps = [{ type: 'dp_fib', dp: dp.slice(), highlight: 1, explain: `Initialize dp[0]=0, dp[1]=1` }];
        for (let i = 2; i <= n; i++) { dp[i] = dp[i-1] + dp[i-2]; steps.push({ type: 'dp_fib', dp: dp.slice(), highlight: i, explain: `dp[${i}]=dp[${i-1}]+dp[${i-2}]` }); }
        const expected = dp[n];
        const passed = userOutput === expected;
        return { passed, output: userOutput, expected, error: null, steps };
      }
      case 'hanoi': {
        const n = problem.sampleInput;
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(n, recorder)) : await Promise.resolve(solve(n));
        if (userSteps.length) {
          const expected = (function(){ const mv=[]; (function go(k,a,b,c){ if(k===0) return; go(k-1,a,c,b); mv.push([a,c]); go(k-1,b,a,c); })(n,'A','B','C'); return mv; })();
          const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
          return { passed, output: userOutput, expected, error: null, steps: userSteps };
        }
        // Build steps of pegs state
        const pegs = [Array.from({ length: n }, (_, i) => n - i), [], []];
        const steps = [{ type: 'hanoi', pegs: pegs.map(s => s.slice()), explain: `Initial state with ${n} disks on A` }];
        function moveDisk(from, to) {
          const disk = pegs[from].pop();
          pegs[to].push(disk);
          const pegName = ['A','B','C'];
          steps.push({ type: 'hanoi', pegs: pegs.map(s => s.slice()), explain: `Move disk from ${pegName[from]} to ${pegName[to]}` });
        }
        // Re-run moves using the classical recursion to mirror output
        (function go(k, a, b, c) {
          if (k === 0) return;
          go(k - 1, a, c, b);
          moveDisk(a.charCodeAt(0)-65, c.charCodeAt(0)-65);
          go(k - 1, b, a, c);
        })(n, 'A', 'B', 'C');
        const expected = (function(){ const mv=[]; (function go(k,a,b,c){ if(k===0) return; go(k-1,a,c,b); mv.push([a,c]); go(k-1,b,a,c); })(n,'A','B','C'); return mv; })();
        const passed = JSON.stringify(userOutput) === JSON.stringify(expected);
        return { passed, output: userOutput, expected, error: null, steps };
      }
      default: {
        userOutput = solve.length >= 2 ? await Promise.resolve(solve(problem.sampleInput, recorder)) : await Promise.resolve(solve(problem.sampleInput));
        const passed = JSON.stringify(userOutput) === JSON.stringify(problem.sampleOutput);
        return { passed, output: userOutput, error: null, steps: userSteps };
      }
    }

  } catch (error) {
    // Surface any recorded steps and append an error step for clarity
    const steps = [];
    // Try to include any partial user steps captured before the error
    // eslint-disable-next-line no-undef
    if (typeof userSteps !== 'undefined' && Array.isArray(userSteps)) steps.push(...userSteps);
    steps.push({ type: (typeof problem !== 'undefined' ? problem.simType : 'unknown'), error: true, explain: String(error && error.message ? error.message : error) });
    return { passed: false, output: null, error, steps };
  }
}


