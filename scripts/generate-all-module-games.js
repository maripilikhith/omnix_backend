import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GAMES_DIR = path.resolve(__dirname, './seed-data/games');

const NEW_GAMES = [
  {
    fileName: 'module4-dot-product-defense.html',
    gameId: 'module4-dot-product-defense',
    templateId: 'dot-product-defense',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 4,
    title: 'Dot Product Defense: Orthogonal Shield',
    description: 'Defend against incoming vectors by calculating dot products and orthogonality.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['dot product', 'orthogonality', 'projection', 'vectors'],
    xpReward: 500,
    estimatedMinutes: 5,
    emoji: '🛡️',
    questions: [
      { q: 'What is the dot product of orthogonal (perpendicular) vectors?', opts: ['0', '1', '-1', 'Infinity'], ans: 0 },
      { q: 'If two vectors point in the exact same direction, their dot product is:', opts: ['Positive and maximized', 'Zero', 'Negative', 'Undefined'], ans: 0 },
      { q: 'What does a negative dot product mean about the angle between two vectors?', opts: ['The angle is obtuse (> 90°)', 'The angle is acute (< 90°)', 'The angle is exactly 90°', 'The vectors are parallel'], ans: 0 }
    ]
  },
  {
    fileName: 'module5-cosine-similarity-navigator.html',
    gameId: 'module5-cosine-similarity-navigator',
    templateId: 'cosine-similarity-navigator',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 5,
    title: 'Cosine Similarity Navigator: Space Alignment',
    description: 'Steer your spaceship by matching cosine similarity and vector angles.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['cosine similarity', 'distance', 'angle', 'norm'],
    xpReward: 500,
    estimatedMinutes: 5,
    emoji: '🧭',
    questions: [
      { q: 'What is the range of cosine similarity for general vectors?', opts: ['-1 to 1', '0 to 1', '-Infinity to Infinity', '0 to 100'], ans: 0 },
      { q: 'Why is cosine similarity preferred over Euclidean distance for word embeddings?', opts: ['It ignores differences in magnitude and focuses on orientation', 'It is faster to calculate on GPUs', 'Euclidean distance cannot be used in high dimensions', 'It always yields integers'], ans: 0 },
      { q: 'If two vectors have a cosine similarity of 1, the angle between them is:', opts: ['0 degrees', '90 degrees', '180 degrees', '45 degrees'], ans: 0 }
    ]
  },
  {
    fileName: 'module6-matrix-transformer.html',
    gameId: 'module6-matrix-transformer',
    templateId: 'matrix-transformer',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 6,
    title: 'Matrix Transformation Grid: Linear Morph',
    description: 'Apply transformation matrices to rotate and scale geometry to match target shapes.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['matrices', 'transformations', 'scaling', 'rotation'],
    xpReward: 600,
    estimatedMinutes: 5,
    emoji: '📐',
    questions: [
      { q: 'What does a 2x2 identity matrix do to a vector?', opts: ['Leaves the vector unchanged', 'Rotates it 90 degrees', 'Scales it by 2', 'Projects it to 1D'], ans: 0 },
      { q: 'What is the determinant of a matrix that compresses 2D space into a single 1D line?', opts: ['0', '1', '-1', 'Infinity'], ans: 0 },
      { q: 'Matrix multiplication represents which geometric operation?', opts: ['Composition of linear transformations', 'Addition of vectors', 'Measuring angle between vectors', 'Finding eigenvalues'], ans: 0 }
    ]
  },
  {
    fileName: 'module7-activation-relay.html',
    gameId: 'module7-activation-relay',
    templateId: 'activation-relay',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 7,
    title: 'Activation Function Relay: Hinge & Sigmoid',
    description: 'Route signals through non-linear activation gates like ReLU and Sigmoid.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['ReLU', 'sigmoid', 'non-linearity', 'neural networks'],
    xpReward: 600,
    estimatedMinutes: 5,
    emoji: '⚡',
    questions: [
      { q: 'What is the output of ReLU(x) when x = -5?', opts: ['0', '-5', '5', '0.5'], ans: 0 },
      { q: 'Why do neural networks require non-linear activation functions?', opts: ['To learn complex patterns that linear transformations cannot represent', 'To keep weights from becoming negative', 'To speed up training by reducing matrix size', 'To ensure probabilities sum to 1'], ans: 0 },
      { q: 'What is the output range of the standard Sigmoid activation function?', opts: ['(0, 1)', '[-1, 1]', '[0, Infinity)', '(-Infinity, Infinity)'], ans: 0 }
    ]
  },
  {
    fileName: 'module8-embedding-explorer.html',
    gameId: 'module8-embedding-explorer',
    templateId: 'embedding-explorer',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 8,
    title: 'Embedding Space Explorer: Semantic Clusters',
    description: 'Navigate high-dimensional embedding spaces and group semantically similar vectors.',
    genre: 'Math',
    difficulty: 'Advanced',
    conceptsTested: ['embeddings', 'vector spaces', 'semantic distance', 'clustering'],
    xpReward: 600,
    estimatedMinutes: 5,
    emoji: '🌌',
    questions: [
      { q: 'In an embedding space, vectors representing semantically similar concepts are:', opts: ['Located close to each other', 'Orthogonal to each other', 'Always zero vectors', 'Farther apart than random concepts'], ans: 0 },
      { q: 'What is a typical dimensionality for modern LLM token embeddings?', opts: ['768 to 4096 dimensions', '2 to 3 dimensions', '10 to 20 dimensions', 'Over 1 million dimensions'], ans: 0 },
      { q: 'Which mathematical operation on embeddings famously captures word analogies (e.g. King - Man + Woman)?', opts: ['Vector addition and subtraction', 'Cross product', 'Matrix inversion', 'Calculating determinants'], ans: 0 }
    ]
  },
  {
    fileName: 'module9-eigen-quest.html',
    gameId: 'module9-eigen-quest',
    templateId: 'eigen-quest',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 9,
    title: 'Eigenvector Quest: Principal Direction',
    description: 'Discover the invariant axes of transformations and uncover eigenvectors.',
    genre: 'Math',
    difficulty: 'Advanced',
    conceptsTested: ['eigenvectors', 'eigenvalues', 'principal components', 'transformations'],
    xpReward: 700,
    estimatedMinutes: 5,
    emoji: '🎯',
    questions: [
      { q: 'What happens to an eigenvector when a linear transformation is applied to it?', opts: ['It only scales by its eigenvalue without changing direction', 'It rotates by 90 degrees', 'It becomes the zero vector', 'It reflects across the origin'], ans: 0 },
      { q: 'In Principal Component Analysis (PCA), what do the eigenvectors of the covariance matrix represent?', opts: ['The principal directions of maximum variance in the data', 'The average value of each feature', 'The noise in the dataset', 'The classification boundaries'], ans: 0 },
      { q: 'If an eigenvalue is zero, what does it tell us about the transformation?', opts: ['The matrix is singular and squashes space along that eigenvector', 'The transformation is a pure rotation', 'The eigenvector has infinite length', 'The matrix is an identity matrix'], ans: 0 }
    ]
  },
  {
    fileName: 'module10-probability-plinko.html',
    gameId: 'module10-probability-plinko',
    templateId: 'probability-plinko',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 10,
    title: 'Probability & Loss Plinko: Stochastic Cascade',
    description: 'Drop tokens through probability distributions to minimize loss and entropy.',
    genre: 'Math',
    difficulty: 'Advanced',
    conceptsTested: ['probability', 'entropy', 'loss functions', 'uncertainty'],
    xpReward: 700,
    estimatedMinutes: 5,
    emoji: '🎲',
    questions: [
      { q: 'Which loss function is most commonly used for multi-class classification in deep learning?', opts: ['Cross-Entropy Loss', 'Mean Squared Error (MSE)', 'Hinge Loss', 'L1 Loss'], ans: 0 },
      { q: 'What does high entropy indicate about a probability distribution?', opts: ['High uncertainty (uniform distribution)', 'Complete certainty in one outcome', 'Zero variance', 'Negative probabilities'], ans: 0 },
      { q: 'In Maximum Likelihood Estimation (MLE), what are we trying to optimize?', opts: ['Parameters that maximize the probability of observing the training data', 'The number of hidden layers', 'The learning rate schedule', 'The size of the test dataset'], ans: 0 }
    ]
  },
  {
    fileName: 'module11-gradient-descent-racer.html',
    gameId: 'module11-gradient-descent-racer',
    templateId: 'gradient-descent-racer',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 11,
    title: 'Gradient Descent Racer: Loss Landscape Optimization',
    description: 'Tune learning rates and momentum to race down the loss valley to the global minimum.',
    genre: 'Math',
    difficulty: 'Advanced',
    conceptsTested: ['gradient descent', 'learning rate', 'optimization', 'loss landscape'],
    xpReward: 800,
    estimatedMinutes: 5,
    emoji: '🏎️',
    questions: [
      { q: 'What happens if the learning rate in Gradient Descent is set too large?', opts: ['The optimizer may overshoot the minimum and diverge', 'Training will be extremely slow but guaranteed to converge', 'The gradients will become zero immediately', 'The loss landscape becomes flat'], ans: 0 },
      { q: 'What role does momentum play in optimization algorithms like Adam or SGD with momentum?', opts: ['It helps overcome local minima and dampens oscillations', 'It increases the size of the dataset', 'It removes the need for backpropagation', 'It ensures weights are always positive'], ans: 0 },
      { q: 'In a loss landscape, the negative gradient always points in the direction of:', opts: ['Steepest descent', 'Steepest ascent', 'Zero curvature', 'Constant loss'], ans: 0 }
    ]
  }
];

function generateHtml(game) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${game.title}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0a0a0a;color:#e5e5e5;font-family:'Inter','Segoe UI',system-ui,sans-serif;overflow:hidden;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
  canvas{display:block;border-radius:12px;background:#0d1117;box-shadow:0 0 30px rgba(0,0,0,0.8)}
  .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:10}
  .ov>div{pointer-events:auto}
  .sc{text-align:center;background:rgba(10,10,10,0.97);border:1px solid rgba(22,163,74,0.3);border-radius:16px;padding:48px;max-width:480px;box-shadow:0 0 60px rgba(22,163,74,0.1)}
  .sc h1{font-size:32px;font-weight:800;background:linear-gradient(135deg,#16a34a,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
  .sc .su{font-size:13px;color:#888;margin-bottom:24px;text-transform:uppercase;letter-spacing:0.1em}
  .sc p{font-size:15px;color:#aaa;line-height:1.7;margin-bottom:24px}
  .bt{padding:14px 40px;background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;font-size:15px;font-weight:700;border:none;border-radius:10px;cursor:pointer;text-transform:uppercase;letter-spacing:0.08em;box-shadow:0 0 25px rgba(22,163,74,0.3);transition:all 0.2s}
  .bt:hover{transform:translateY(-2px);box-shadow:0 0 35px rgba(22,163,74,0.5)}
  .sg{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}
  .sb{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px}
  .sb .v{font-size:28px;font-weight:800}.sb .l{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}
  .g .v{color:#16a34a}.a .v{color:#f59e0b}
  .qm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,10,10,0.97);border:1px solid rgba(34,211,238,0.4);border-radius:16px;padding:32px;max-width:440px;width:90%;z-index:15;display:none;box-shadow:0 0 40px rgba(34,211,238,0.1)}
  .qm h3{font-size:16px;font-weight:600;margin-bottom:20px;line-height:1.6}
  .qm .opts{display:flex;flex-direction:column;gap:10px}
  .qm .opt{padding:14px 18px;background:rgba(30,30,30,0.9);border:1px solid rgba(255,255,255,0.1);border-radius:10px;font-size:14px;cursor:pointer;text-align:left;transition:all 0.15s;color:#ccc}
  .qm .opt:hover{border-color:rgba(34,211,238,0.5);background:rgba(34,211,238,0.08)}
  .qm .opt.ok{border-color:#16a34a;background:rgba(22,163,74,0.15);color:#4ade80}
  .qm .opt.no{border-color:#ef4444;background:rgba(239,68,68,0.15);color:#fca5a5}
  .hud{position:absolute;top:20px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;z-index:5}
  .hud-box{background:rgba(10,10,10,0.8);border:1px solid rgba(255,255,255,0.1);padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;color:#22d3ee}
</style>
</head>
<body>
<div class="hud" id="hud" style="display:none">
  <div class="hud-box">Module ${game.moduleNumber}: ${game.emoji} ${game.title.split(':')[0]}</div>
  <div class="hud-box" id="score-box">Checkpoint: 0 / 3</div>
</div>
<canvas id="c" width="800" height="500"></canvas>
<div class="ov">
  <div id="ts" class="sc">
    <h1>${game.emoji} ${game.title}</h1>
    <div class="su">Module ${game.moduleNumber} — Interactive Challenge</div>
    <p>${game.description}</p>
    <button class="bt" onclick="startGame()">Start Challenge</button>
  </div>
  <div id="es" class="sc" style="display:none">
    <h1>🏆 Challenge Mastered!</h1>
    <div class="su">Module ${game.moduleNumber} Completed</div>
    <div class="sg">
      <div class="sb g"><div class="v" id="s1">3/3</div><div class="l">Checkpoints</div></div>
      <div class="sb a"><div class="v" id="s2">${game.xpReward}</div><div class="l">XP Reward</div></div>
    </div>
    <button class="bt" onclick="startGame()">Play Again</button>
  </div>
</div>
<div id="qm" class="qm">
  <h3 id="qt"></h3>
  <div id="qo" class="opts"></div>
</div>
<script>
  const c = document.getElementById('c');
  const ctx = c.getContext('2d');
  const questions = ${JSON.stringify(game.questions)};
  let currentQ = 0;
  let active = false;
  let animId = null;
  let particles = [];

  for(let i=0; i<40; i++) {
    particles.push({
      x: Math.random()*800,
      y: Math.random()*500,
      vx: (Math.random()-0.5)*2,
      vy: (Math.random()-0.5)*2,
      size: Math.random()*3+1
    });
  }

  function drawLoop() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.strokeStyle = 'rgba(34,211,238,0.08)';
    ctx.lineWidth = 1;
    for(let x=0; x<c.width; x+=40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, c.height);
      ctx.stroke();
    }
    for(let y=0; y<c.height; y+=40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#22d3ee';
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<0 || p.x>c.width) p.vx *= -1;
      if(p.y<0 || p.y>c.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    });

    if(active) {
      animId = requestAnimationFrame(drawLoop);
    }
  }

  function startGame() {
    document.getElementById('ts').style.display = 'none';
    document.getElementById('es').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
    currentQ = 0;
    active = true;
    drawLoop();
    setTimeout(showNextQuestion, 600);
  }

  function showNextQuestion() {
    if(currentQ >= questions.length) {
      finishGame();
      return;
    }
    document.getElementById('score-box').innerText = \`Checkpoint: \${currentQ} / 3\`;
    const q = questions[currentQ];
    document.getElementById('qt').innerText = \`Checkpoint \${currentQ+1}: \${q.q}\`;
    const optsDiv = document.getElementById('qo');
    optsDiv.innerHTML = '';
    q.opts.forEach((opt, idx) => {
      const btn = document.createElement('div');
      btn.className = 'opt';
      btn.innerText = opt;
      btn.onclick = () => selectAnswer(btn, idx === q.ans);
      optsDiv.appendChild(btn);
    });
    document.getElementById('qm').style.display = 'block';
  }

  function selectAnswer(btn, isCorrect) {
    if(isCorrect) {
      btn.classList.add('ok');
      setTimeout(() => {
        document.getElementById('qm').style.display = 'none';
        currentQ++;
        setTimeout(showNextQuestion, 600);
      }, 700);
    } else {
      btn.classList.add('no');
      setTimeout(() => btn.classList.remove('no'), 500);
    }
  }

  function finishGame() {
    active = false;
    document.getElementById('qm').style.display = 'none';
    document.getElementById('hud').style.display = 'none';
    document.getElementById('es').style.display = 'block';
    if(window.parent) {
      window.parent.postMessage({ type: 'GAME_COMPLETED', gameId: '${game.gameId}', xpReward: ${game.xpReward} }, '*');
    }
  }

  drawLoop();
</script>
</body>
</html>`;
}

// Generate the 8 new HTML game files in seed-data/games/
for (const game of NEW_GAMES) {
  const filePath = path.join(GAMES_DIR, game.fileName);
  fs.writeFileSync(filePath, generateHtml(game), 'utf-8');
  console.log(`✅ Generated ${game.fileName}`);
}

console.log('🎉 Successfully generated all module game files!');
