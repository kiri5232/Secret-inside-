/**
 * HELLO, NEIGHBOUR — Interactive Digital Experience
 * Modular Vanilla JS Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config & State Engine
  const CONFIG = {
    apiEndpoint: '/api/response',
    storageKey: 'hello_neighbour_response'
  };

  const state = {
    currentScene: 'scene-intro',
    audioActive: false,
    hasAttemptedNo: false,
    responseGiven: null,
    audioCtx: null
  };

  // DOM Elements
  const DOM = {
    cursor: document.getElementById('custom-cursor'),
    audioBtn: document.getElementById('audio-toggle'),
    canvas: document.getElementById('tree-canvas'),
    // Scenes
    scenes: {
      intro: document.getElementById('scene-intro'),
      gift: document.getElementById('scene-gift'),
      letter: document.getElementById('scene-letter'),
      question: document.getElementById('scene-question'),
      noPath: document.getElementById('scene-no-path'),
      yesPath: document.getElementById('scene-yes-path')
    },
    // Scene 1
    introOrb: document.getElementById('intro-orb'),
    introT1: document.getElementById('intro-t1'),
    introT2: document.getElementById('intro-t2'),
    introT3: document.getElementById('intro-t3'),
    btnIntroContinue: document.getElementById('btn-intro-continue'),
    // Scene 2
    giftBox: document.getElementById('gift-box'),
    giftInstruction: document.getElementById('gift-instruction'),
    giftMsg1: document.getElementById('gift-msg-1'),
    giftMsg2: document.getElementById('gift-msg-2'),
    btnGiftContinue: document.getElementById('btn-gift-continue'),
    // Scene 3
    letterCard: document.getElementById('letter-card'),
    btnLetterContinue: document.getElementById('btn-letter-continue'),
    // Scene 4/5
    qIntro: document.getElementById('q-intro'),
    qMain: document.getElementById('q-main'),
    qButtons: document.getElementById('q-buttons'),
    fakeoutText: document.getElementById('fakeout-text'),
    btnYes: document.getElementById('btn-yes'),
    btnNo: document.getElementById('btn-no'),
    // Scene 7
    treeMsg1: document.getElementById('tree-msg-1'),
    treeMsg2: document.getElementById('tree-msg-2')
  };

  /* ==========================================================================
     CUSTOM CURSOR
     ========================================================================== */
  if (matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      DOM.cursor.style.left = `${e.clientX}px`;
      DOM.cursor.style.top = `${e.clientY}px`;
    });
  } else {
    DOM.cursor.style.display = 'none';
  }

  /* ==========================================================================
     AMBIENT AUDIO ENGINE (Web Audio API Synthesizer - Zero External Files)
     ========================================================================== */
  function initAudio() {
    if (state.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    state.audioCtx = new AudioContext();

    // Gentle ambient pad generator
    const osc1 = state.audioCtx.createOscillator();
    const osc2 = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(110, state.audioCtx.currentTime); // A2
    osc2.frequency.setValueAtTime(164.81, state.audioCtx.currentTime); // E3

    gain.gain.setValueAtTime(0.01, state.audioCtx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(state.audioCtx.destination);

    osc1.start();
    osc2.start();
    state.ambientGain = gain;
  }

  DOM.audioBtn.addEventListener('click', () => {
    initAudio();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }

    state.audioActive = !state.audioActive;
    DOM.audioBtn.classList.toggle('playing', state.audioActive);

    if (state.audioGain) {
      state.ambientGain.gain.setTargetAtTime(
        state.audioActive ? 0.03 : 0.0001,
        state.audioCtx.currentTime,
        0.5
      );
    }
  });

  /* ==========================================================================
     SCENE TRANSITION SYSTEM
     ========================================================================== */
  function switchScene(targetSceneId) {
    Object.keys(DOM.scenes).forEach((key) => {
      const scene = DOM.scenes[key];
      if (scene.id === targetSceneId) {
        scene.classList.add('active');
        state.currentScene = targetSceneId;
      } else {
        scene.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     SCENE 1: CINEMATIC INTRO FLOW
     ========================================================================== */
  function runIntroSequence() {
    setTimeout(() => {
      DOM.introOrb.classList.add('expanded');
    }, 600);

    setTimeout(() => {
      DOM.introT1.classList.add('visible');
    }, 1800);

    setTimeout(() => {
      DOM.introT2.classList.add('visible');
    }, 3200);

    setTimeout(() => {
      DOM.introT3.classList.add('visible');
    }, 4800);

    setTimeout(() => {
      DOM.btnIntroContinue.classList.add('visible');
    }, 6000);
  }

  DOM.btnIntroContinue.addEventListener('click', () => {
    switchScene('scene-gift');
  });

  /* ==========================================================================
     SCENE 2: THE GIFT INTERACTION
     ========================================================================== */
  DOM.giftBox.addEventListener('click', openGift);
  DOM.giftBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openGift();
  });

  function openGift() {
    if (DOM.giftBox.classList.contains('opened')) return;

    DOM.giftBox.classList.add('opened');
    DOM.giftInstruction.style.opacity = '0';

    // Particle burst on canvas
    triggerGiftBurst();

    setTimeout(() => {
      DOM.giftMsg1.classList.add('visible');
    }, 800);

    setTimeout(() => {
      DOM.giftMsg2.classList.add('visible');
    }, 2200);

    setTimeout(() => {
      DOM.btnGiftContinue.classList.add('visible');
    }, 3600);
  }

  DOM.btnGiftContinue.addEventListener('click', () => {
    switchScene('scene-letter');
  });

  /* ==========================================================================
     SCENE 3: LETTER REVEAL
     ========================================================================== */
  DOM.letterCard.addEventListener('click', openLetter);
  DOM.letterCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openLetter();
  });

  function openLetter() {
    if (!DOM.letterCard.classList.contains('closed')) return;

    DOM.letterCard.classList.remove('closed');
    DOM.letterCard.classList.add('open');

    const lines = DOM.letterCard.querySelectorAll('.line');
    lines.forEach((line, index) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, 400 + index * 600);
    });

    setTimeout(() => {
      DOM.btnLetterContinue.classList.add('visible');
    }, 400 + lines.length * 600 + 400);
  }

  DOM.btnLetterContinue.addEventListener('click', () => {
    switchScene('scene-question');
    runQuestionSequence();
  });

  /* ==========================================================================
     SCENE 4 & 5: FRIENDSHIP QUESTION & PLAYFUL FAKE-OUT
     ========================================================================== */
  function runQuestionSequence() {
    setTimeout(() => DOM.qIntro.classList.add('visible'), 400);
    setTimeout(() => DOM.qMain.classList.add('visible'), 1600);
    setTimeout(() => DOM.qButtons.classList.add('visible'), 2800);
  }

  // Playful NO interaction
  DOM.btnNo.addEventListener('mouseenter', handleNoInteraction);
  DOM.btnNo.addEventListener('touchstart', handleNoInteraction, { passive: true });

  function handleNoInteraction() {
    if (!state.hasAttemptedNo) {
      state.hasAttemptedNo = true;

      // Translate NO button randomly
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 80;
      DOM.btnNo.style.transform = `translate(${x}px, ${y}px)`;

      setTimeout(() => {
        DOM.qIntro.style.display = 'none';
        DOM.qMain.style.display = 'none';
        DOM.fakeoutText.style.display = 'block';
        DOM.fakeoutText.classList.add('visible');

        // Reset NO button position after joke
        setTimeout(() => {
          DOM.btnNo.style.transform = 'translate(0, 0)';
        }, 1200);
      }, 400);
    }
  }

  DOM.btnNo.addEventListener('click', () => {
    recordResponse('no');
    switchScene('scene-no-path');
    runNoPathSequence();
  });

  DOM.btnYes.addEventListener('click', () => {
    recordResponse('yes');
    switchScene('scene-yes-path');
    startTreeGrowthSequence();
  });

  /* ==========================================================================
     NO PATH SEQUENCE
     ========================================================================== */
  function runNoPathSequence() {
    const texts = DOM.scenes.noPath.querySelectorAll('.fade-text');
    texts.forEach((txt, idx) => {
      setTimeout(() => txt.classList.add('visible'), 600 + idx * 1200);
    });
  }

  /* ==========================================================================
     CANVAS ENGINE: GIFT BURST & PROCEDURAL TREE ANIMATION (YES PATH)
     ========================================================================== */
  const ctx = DOM.canvas.getContext('2d');
  let width, height;

  function resizeCanvas() {
    width = DOM.canvas.width = window.innerWidth;
    height = DOM.canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Burst Particles for Gift Opening
  let particles = [];

  function triggerGiftBurst() {
    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
        size: 2 + Math.random() * 3
      });
    }
  }

  function renderParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 192, 141, ${p.life})`;
      ctx.fill();
    }
  }

  // Procedural Tree Growth System
  let treeBranches = [];
  let treeGrowing = false;
  let growthProgress = 0;

  class Branch {
    constructor(startX, startY, angle, length, depth) {
      this.startX = startX;
      this.startY = startY;
      this.angle = angle;
      this.length = length;
      this.depth = depth;
      this.currentLength = 0;
      this.endX = startX;
      this.endY = startY;
      this.subBranches = [];
      this.leaves = [];
      this.spawned = false;
    }

    update() {
      if (this.currentLength < this.length) {
        this.currentLength += (this.length - this.currentLength) * 0.03 + 0.2;
        this.endX = this.startX + Math.cos(this.angle) * this.currentLength;
        this.endY = this.startY + Math.sin(this.angle) * this.currentLength;

        // Generate leaves on tip
        if (this.depth <= 2 && this.currentLength >= this.length * 0.8 && this.leaves.length === 0) {
          for (let i = 0; i < 3; i++) {
            this.leaves.push({
              x: this.endX + (Math.random() - 0.5) * 12,
              y: this.endY + (Math.random() - 0.5) * 12,
              size: 0,
              maxSize: 3 + Math.random() * 4,
              color: Math.random() > 0.4 ? 'rgba(226, 192, 141, ' : 'rgba(163, 201, 168, '
            });
          }
        }
      } else if (!this.spawned && this.depth > 0) {
        this.spawned = true;
        const numBranches = 2;
        for (let i = 0; i < numBranches; i++) {
          const newAngle = this.angle + (Math.random() - 0.5) * 0.8;
          const newLength = this.length * (0.68 + Math.random() * 0.15);
          this.subBranches.push(new Branch(this.endX, this.endY, newAngle, newLength, this.depth - 1));
        }
      }

      this.subBranches.forEach(b => b.update());
      this.leaves.forEach(l => {
        if (l.size < l.maxSize) l.size += 0.05;
      });
    }

    draw(context) {
      context.beginPath();
      context.moveTo(this.startX, this.startY);
      context.lineTo(this.endX, this.endY);
      context.strokeStyle = `rgba(240, 240, 243, ${0.15 + (this.depth / 6) * 0.6})`;
      context.lineWidth = Math.max(1, this.depth * 1.5);
      context.lineCap = 'round';
      context.stroke();

      this.subBranches.forEach(b => b.draw(context));
      this.leaves.forEach(l => {
        context.beginPath();
        context.arc(l.x, l.y, l.size, 0, Math.PI * 2);
        context.fillStyle = `${l.color}0.6)`;
        context.fill();
      });
    }
  }

  function startTreeGrowthSequence() {
    treeGrowing = true;
    const trunkLength = Math.min(height * 0.22, 130);
    treeBranches.push(new Branch(width / 2, height, -Math.PI / 2, trunkLength, 5));

    setTimeout(() => {
      DOM.treeMsg1.classList.add('visible');
    }, 4500);

    setTimeout(() => {
      DOM.treeMsg2.classList.add('visible');
    }, 6500);
  }

  // Animation Loop (60fps optimized)
  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    renderParticles();

    if (treeGrowing) {
      treeBranches.forEach(branch => {
        branch.update();
        branch.draw(ctx);
      });
    }

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);

  /* ==========================================================================
     RESPONSE & BACKEND INTEGRATION
     ========================================================================== */
  function recordResponse(choice) {
    state.responseGiven = choice;
    const payload = {
      response: choice,
      timestamp: new Date().toISOString(),
      sessionId: 'neigh_' + Math.random().toString(36).substring(2, 9)
    };

    // Save locally
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(payload));

    // Optional Backend Sync
    if (navigator.onLine) {
      fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {
        // Silent fallback to local-only mode
      });
    }
  }

  // Start Intro Sequence
  runIntroSequence();
});
    
