(function () {
  const root = document.querySelector('[data-omics-demo]');
  const kicker = document.querySelector('[data-omics-kicker]');
  const title = document.querySelector('[data-omics-title]');
  const body = document.querySelector('[data-omics-body]');
  const copy = document.querySelector('.omics-demo-copy');
  const steps = Array.from(document.querySelectorAll('.omics-demo-step'));
  const visuals = Array.from(document.querySelectorAll('[data-omics-visual]'));
  const nextButton = document.querySelector('[data-omics-next]');
  const prevButton = document.querySelector('[data-omics-prev]');
  const sequenceLayers = Array.from(document.querySelectorAll('[data-sequence-layer]'));

  if (!root || !kicker || !title || !body || !copy) {
    return;
  }

  const demoTiming = {
    stateDurationMs: 5200,
    textFadeMs: 220,
    rotationSpeed: 0.014,
    sequenceTickMs: 900,
    sequenceHighlightMs: 650
  };

  const demoStates = [
    {
      key: 'dna',
      visual: 'dna',
      kicker: 'DNA sequencing',
      title: 'From DNA to medicine.',
      body: 'Sequencing turns inherited code into readable data.'
    },
    {
      key: 'rna',
      visual: 'rna',
      kicker: 'RNA expression',
      title: 'Activity becomes visible.',
      body: 'RNA shows which parts of the genome are active in a cell, tissue, or disease state.'
    },
    {
      key: 'protein',
      visual: 'protein',
      kicker: 'Protein consequence',
      title: 'Molecules become function.',
      body: 'Protein structure and interaction reveal how molecular variation can change biological systems.'
    },
    {
      key: 'disease',
      visual: 'disease',
      kicker: 'Clinical interpretation',
      title: 'Evidence becomes judgement.',
      body: 'Molecular signals become useful when they are connected to phenotype, mechanism, and uncertainty.'
    },
    {
      key: 'medicine',
      visual: 'medicine',
      kicker: 'Therapeutic systems',
      title: 'Biology becomes medicine.',
      body: 'The strongest systems connect discovery, diagnosis, and therapeutic design into one coherent path.'
    }
  ];

  const moleculeConfig = {
    margin: 11,
    span: 29,
    strandStroke: 3,
    ballPadding: 5,
    ballDiameter: 7,
    strandCount: 25,
    zoom: 1.85,
    strandColor: 'rgba(23, 23, 32, 0.42)',
    colours: [
      'rgba(23, 23, 32, 0.94)',
      'rgba(55, 58, 68, 0.86)',
      'rgba(112, 118, 130, 0.80)',
      'rgba(205, 209, 218, 0.86)'
    ]
  };

  let activeStateIndex = 0;
  let autoTimer = null;
  const scenes = [];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function setFixedTextHeights() {
    const originalKicker = kicker.textContent;
    const originalTitle = title.textContent;
    const originalBody = body.textContent;

    const currentKickerMin = kicker.style.minHeight;
    const currentTitleMin = title.style.minHeight;
    const currentBodyMin = body.parentElement ? body.parentElement.style.minHeight : '';

    let maxKickerHeight = 0;
    let maxTitleHeight = 0;
    let maxBodyHeight = 0;

    kicker.style.minHeight = '0px';
    title.style.minHeight = '0px';

    if (body.parentElement) {
      body.parentElement.style.minHeight = '0px';
    }

    demoStates.forEach(function (state) {
      kicker.textContent = state.kicker;
      title.textContent = state.title;
      body.textContent = state.body;

      maxKickerHeight = Math.max(maxKickerHeight, kicker.offsetHeight);
      maxTitleHeight = Math.max(maxTitleHeight, title.offsetHeight);
      maxBodyHeight = Math.max(maxBodyHeight, body.offsetHeight);
    });

    kicker.textContent = originalKicker;
    title.textContent = originalTitle;
    body.textContent = originalBody;

    kicker.style.minHeight = currentKickerMin;
    title.style.minHeight = currentTitleMin;

    if (body.parentElement) {
      body.parentElement.style.minHeight = currentBodyMin;
    }

    kicker.style.minHeight = `${Math.ceil(maxKickerHeight)}px`;
    title.style.minHeight = `${Math.ceil(maxTitleHeight)}px`;

    if (body.parentElement) {
      body.parentElement.style.minHeight = `${Math.ceil(maxBodyHeight)}px`;
    }
  }

  function renderTextState(index, animate) {
    activeStateIndex = (index + demoStates.length) % demoStates.length;
    const state = demoStates[activeStateIndex];

    function applyState() {
      kicker.textContent = state.kicker;
      title.textContent = state.title;
      body.textContent = state.body;

      steps.forEach(function (step, stepIndex) {
        step.classList.toggle('is-active', stepIndex === activeStateIndex);
      });

      visuals.forEach(function (visual) {
        visual.classList.toggle('is-active', visual.dataset.omicsVisual === state.visual);
      });
    }

    if (!animate) {
      applyState();
      return;
    }

    copy.classList.add('is-changing');

    window.setTimeout(function () {
      applyState();

      window.requestAnimationFrame(function () {
        copy.classList.remove('is-changing');
      });
    }, demoTiming.textFadeMs);
  }

  function goToState(index, userDriven) {
    renderTextState(index, true);

    if (userDriven) {
      restartAutoTimer();
    }
  }

  function nextState(userDriven) {
    goToState(activeStateIndex + 1, userDriven);
  }

  function prevState() {
    goToState(activeStateIndex - 1, true);
  }

  function restartAutoTimer() {
    if (autoTimer) {
      window.clearInterval(autoTimer);
      autoTimer = null;
    }

    if (!reduceMotion) {
      autoTimer = window.setInterval(function () {
        nextState(false);
      }, demoTiming.stateDurationMs);
    }
  }

  function buildSequenceLayer(layer) {
    const alphabet = (layer.dataset.alphabet || 'ATGC').split('');
    const cellCount = window.matchMedia('(max-width: 767.98px)').matches ? 196 : 324;

    layer.innerHTML = '';

    for (let i = 0; i < cellCount; i += 1) {
      const span = document.createElement('span');
      span.textContent = alphabet[i % alphabet.length];
      span.style.opacity = String(getEdgeOpacity(i, cellCount));
      layer.appendChild(span);
    }

    layer.__omicsAlphabet = alphabet;
  }

  function getEdgeOpacity(index, cellCount) {
    const cols = window.matchMedia('(max-width: 767.98px)').matches ? 14 : 18;
    const rows = Math.ceil(cellCount / cols);
    const row = Math.floor(index / cols);
    const col = index % cols;
    const rowDepth = Math.min(row, rows - 1 - row);
    const colDepth = Math.min(col, cols - 1 - col);
    const edgeDepth = Math.min(rowDepth, colDepth);

    if (edgeDepth === 0) return 0.08;
    if (edgeDepth === 1) return 0.14;
    if (edgeDepth === 2) return 0.22;
    return 0.34;
  }

  function mutateSequenceLayer(layer) {
    const alphabet = layer.__omicsAlphabet || (layer.dataset.alphabet || 'ATGC').split('');
    const cells = Array.from(layer.querySelectorAll('span'));
    const mutationCount = Math.max(1, Math.round(cells.length * 0.025));
    const used = new Set();

    for (let i = 0; i < mutationCount; i += 1) {
      let index = Math.floor(Math.random() * cells.length);

      while (used.has(index)) {
        index = Math.floor(Math.random() * cells.length);
      }

      used.add(index);

      const cell = cells[index];
      const current = cell.textContent;
      let next = current;

      while (next === current) {
        next = randomItem(alphabet);
      }

      cell.textContent = next;
      cell.classList.add('is-changing');

      window.setTimeout(function () {
        cell.classList.remove('is-changing');
      }, demoTiming.sequenceHighlightMs);
    }
  }

  function startSequenceLayers() {
    sequenceLayers.forEach(buildSequenceLayer);

    if (!reduceMotion) {
      window.setInterval(function () {
        sequenceLayers.forEach(mutateSequenceLayer);
      }, demoTiming.sequenceTickMs);
    }
  }

  function randomColour() {
    return randomItem(moleculeConfig.colours);
  }

  function buildMolecule(canvas, mode) {
    if (!canvas || !window.Zdog) {
      return null;
    }

    const { Illustration, TAU, Shape, Anchor } = window.Zdog;
    const yStart = -(((moleculeConfig.strandCount - 1) * moleculeConfig.margin) / 2);

    const scene = new Illustration({
      element: canvas,
      dragRotate: true,
      resize: true,
      zoom: moleculeConfig.zoom
    });

    const strandTemplate = new Shape({
      stroke: moleculeConfig.strandStroke,
      color: moleculeConfig.strandColor,
      path: [
        { x: -moleculeConfig.span },
        { x: moleculeConfig.span }
      ]
    });

    const singleStrandTemplate = new Shape({
      stroke: moleculeConfig.strandStroke,
      color: moleculeConfig.strandColor,
      path: [
        { x: -moleculeConfig.span * 0.7 },
        { x: moleculeConfig.span * 0.7 }
      ]
    });

    const ballTemplate = new Shape({
      color: randomColour(),
      stroke: moleculeConfig.ballDiameter * 2,
      translate: {
        x: -(moleculeConfig.ballDiameter + moleculeConfig.span + moleculeConfig.ballPadding)
      }
    });

    const rootAnchor = new Anchor({
      addTo: scene
    });

    Array.from({ length: moleculeConfig.strandCount }).forEach(function (_, index) {
      const y = yStart + index * moleculeConfig.margin;
      const rotation = (TAU / moleculeConfig.strandCount) * index;

      if (mode === 'rna') {
        const strand = singleStrandTemplate.copy({
          addTo: rootAnchor,
          rotate: {
            y: rotation
          },
          translate: {
            y,
            x: Math.sin(rotation) * 18
          }
        });

        ballTemplate.copy({
          addTo: strand,
          color: randomColour(),
          translate: {
            x: moleculeConfig.span * 0.72
          }
        });

        return;
      }

      const strand = strandTemplate.copy({
        addTo: rootAnchor,
        rotate: {
          y: rotation
        },
        translate: {
          y
        }
      });

      ballTemplate.copy({
        addTo: strand,
        color: randomColour()
      });

      ballTemplate.copy({
        addTo: strand,
        color: randomColour(),
        translate: {
          x: moleculeConfig.ballDiameter + moleculeConfig.span + moleculeConfig.ballPadding
        }
      });
    });

    if (mode === 'disease') {
      rootAnchor.scale = {
        x: 0.92,
        y: 0.92,
        z: 0.92
      };
      rootAnchor.rotate = {
        z: 0.22
      };
    }

    if (mode === 'medicine') {
      rootAnchor.scale = {
        x: 0.78,
        y: 0.78,
        z: 0.78
      };
      rootAnchor.rotate = {
        z: -0.18
      };
    }

    scenes.push({
      scene,
      mode
    });

    return scene;
  }

  function buildMolecules() {
    buildMolecule(document.querySelector('[data-omics-canvas="dna"]'), 'dna');
    buildMolecule(document.querySelector('[data-omics-canvas="rna"]'), 'rna');
    buildMolecule(document.querySelector('[data-omics-canvas="disease"]'), 'disease');
    buildMolecule(document.querySelector('[data-omics-canvas="medicine"]'), 'medicine');
  }

  function animate() {
    scenes.forEach(function (entry) {
      if (!reduceMotion) {
        entry.scene.rotate.y -= demoTiming.rotationSpeed;
        entry.scene.rotate.x = Math.sin(Date.now() * 0.00035) * 0.07;
      }

      entry.scene.updateRenderGraph();
    });

    if (!reduceMotion) {
      window.requestAnimationFrame(animate);
    }
  }

  function onResize() {
    setFixedTextHeights();
    sequenceLayers.forEach(buildSequenceLayer);
  }

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      nextState(true);
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', prevState);
  }

  renderTextState(0, false);
  setFixedTextHeights();
  startSequenceLayers();
  buildMolecules();
  restartAutoTimer();
  animate();

  window.addEventListener('resize', onResize);
})();
