/* =========================================
   HELLO, NEIGHBOUR
   Interactive Experience
========================================= */


/* =========================================
   SCENE SYSTEM
========================================= */

const scenes = [
  ...document.querySelectorAll(".scene")
];

let currentScene = "intro";

function showScene(id) {

  scenes.forEach(scene => {
    scene.classList.toggle(
      "active",
      scene.id === id
    );
  });

  currentScene = id;
}


/* =========================================
   NORMAL NAVIGATION
========================================= */

document
  .querySelectorAll("[data-next]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const nextScene =
        button.dataset.next;

      showScene(nextScene);

    });

  });


/* =========================================
   GIFT ANIMATION
========================================= */

const gift =
  document.querySelector(".gift");

if (gift) {

  gift.addEventListener("click", () => {

    gift.animate(
      [
        {
          transform: "scale(1)"
        },
        {
          transform:
            "scale(1.12) rotate(-2deg)"
        },
        {
          transform: "scale(0)"
        }
      ],
      {
        duration: 700,
        easing:
          "cubic-bezier(.2,.8,.2,1)"
      }
    );

    setTimeout(() => {

      showScene("letterScene");

    }, 550);

  });

}


/* =========================================
   LETTER OPENING
========================================= */

const envelope =
  document.querySelector("#envelope");

const tapHint =
  document.querySelector(".tap-hint");


if (envelope) {

  envelope.addEventListener("click", () => {

    if (
      !envelope.classList.contains("open")
    ) {

      envelope.classList.add("open");

      if (tapHint) {

        tapHint.textContent = "";

      }

    }

  });

}


/* =========================================
   YES / NO SYSTEM
========================================= */

const yesButton =
  document.querySelector("#yes");

const noButton =
  document.querySelector("#no");


let noJokeActive = true;


/* =========================================
   PLAYFUL NO BUTTON
========================================= */

if (noButton) {

  noButton.addEventListener(
    "mouseenter",
    () => {

      if (!noJokeActive) return;

      const x =
        Math.random() * 90 - 45;

      const y =
        Math.random() * 50 - 25;

      noButton.style.transform =
        `translate(${x}px, ${y}px)`;

    }
  );


  noButton.addEventListener(
    "click",
    () => {

      /*
        First NO click is just a joke.
        After this both YES and NO
        work normally.
      */

      if (noJokeActive) {

        noJokeActive = false;

        noButton.style.transform =
          "translate(0,0)";

        noButton.textContent =
          "No, really";

        const tinyText =
          document.querySelector(".tiny");

        if (tinyText) {

          tinyText.textContent =
            "Okay okay 😭 I was just messing around. This time, choose whatever you actually want.";

        }

        return;

      }


      /*
        Genuine NO
      */

      showScene("noScene");

    }
  );

}


/* =========================================
   YES
========================================= */

if (yesButton) {

  yesButton.addEventListener(
    "click",
    () => {

      showScene("treeScene");

      startTree();

    }
  );

}


/* =========================================
   TREE SYSTEM
========================================= */

function startTree() {

  const canvas =
    document.querySelector("#treeCanvas");

  if (!canvas) return;


  const ctx =
    canvas.getContext("2d");


  const pixelRatio =
    window.devicePixelRatio || 1;


  /* ---------------------------------------
     Canvas Resize
  --------------------------------------- */

  function resizeCanvas() {

    canvas.width =
      window.innerWidth *
      pixelRatio;

    canvas.height =
      window.innerHeight *
      pixelRatio;

    ctx.setTransform(
      pixelRatio,
      0,
      0,
      pixelRatio,
      0,
      0
    );

  }


  resizeCanvas();


  window.addEventListener(
    "resize",
    resizeCanvas
  );


  /* ---------------------------------------
     Tree Branch Data
  --------------------------------------- */

  const branches = [];


  /*
    Creates the structure of the tree
    recursively.
  */

  function createBranch(
    x,
    y,
    length,
    angle,
    depth
  ) {

    if (depth < 0) return;


    branches.push({

      x,
      y,

      length,

      angle,

      depth,

      delay:
        Math.random() * 900 +
        depth * 180

    });


    if (depth > 0) {

      const endX =
        x +
        Math.cos(angle) *
        length;

      const endY =
        y +
        Math.sin(angle) *
        length;


      /*
        Left branch
      */

      createBranch(

        endX,
        endY,

        length * 0.72,

        angle -
          0.42 -
          Math.random() * 0.22,

        depth - 1

      );


      /*
        Right branch
      */

      createBranch(

        endX,
        endY,

        length * 0.68,

        angle +
          0.43 +
          Math.random() * 0.22,

        depth - 1

      );

    }

  }


  /* ---------------------------------------
     Generate Tree
  --------------------------------------- */

  createBranch(

    window.innerWidth / 2,

    window.innerHeight * 0.92,

    145,

    -Math.PI / 2,

    7

  );


  /* =======================================
     ANIMATION
  ======================================= */

  const startTime =
    performance.now();


  const duration =
    6500;


  function animateTree(time) {

    const progress =
      Math.min(
        1,
        (time - startTime) /
        duration
      );


    /*
      Smooth easing
    */

    const eased =
      1 -
      Math.pow(
        1 - progress,
        3
      );


    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );


    ctx.lineCap =
      "round";


    /* -------------------------------------
       Draw branches
    ------------------------------------- */

    for (const branch of branches) {

      let branchProgress =

        (
          time -
          startTime -
          branch.delay
        ) /

        (duration * 0.62);


      branchProgress =
        Math.max(
          0,
          Math.min(
            1,
            branchProgress
          )
        );


      if (
        branchProgress <= 0
      ) {

        continue;

      }


      branchProgress =
        1 -
        Math.pow(
          1 - branchProgress,
          3
        );


      const currentLength =

        branch.length *
        branchProgress;


      const endX =

        branch.x +
        Math.cos(
          branch.angle
        ) *
        currentLength;


      const endY =

        branch.y +
        Math.sin(
          branch.angle
        ) *
        currentLength;


      /* -----------------------------------
         Branch color
      ----------------------------------- */

      ctx.strokeStyle =

        `rgba(
          ${105 + branch.depth * 12},
          ${82 + branch.depth * 14},
          ${55 + branch.depth * 8},
          0.85
        )`;


      ctx.lineWidth =
        Math.max(
          1,
          branch.depth * 0.85
        );


      ctx.beginPath();

      ctx.moveTo(
        branch.x,
        branch.y
      );

      ctx.lineTo(
        endX,
        endY
      );

      ctx.stroke();


      /* -----------------------------------
         Leaves
      ----------------------------------- */

      if (
        branch.depth <= 2 &&
        branchProgress > 0.85
      ) {

        ctx.fillStyle =

          `hsla(
            ${(branch.x + branch.y) % 360},
            55%,
            70%,
            0.78
          )`;


        ctx.beginPath();


        ctx.ellipse(

          endX,
          endY,

          5 +
            branchProgress * 3,

          3 +
            branchProgress * 2,

          branch.angle,

          0,
          Math.PI * 2

        );


        ctx.fill();

      }

    }


    /* -------------------------------------
       Continue animation
    ------------------------------------- */

    if (progress < 1) {

      requestAnimationFrame(
        animateTree
      );

    }

    else {

      createFinalParticles();

    }

  }


  requestAnimationFrame(
    animateTree
  );


  /* =======================================
     FINAL FLOATING PARTICLES
  ======================================= */

  function createFinalParticles() {

    for (
      let i = 0;
      i < 45;
      i++
    ) {

      const x =
        window.innerWidth / 2 +
        (Math.random() - 0.5) *
        380;


      const y =
        window.innerHeight * 0.45 +
        Math.random() *
        230;


      ctx.fillStyle =

        `hsla(
          ${Math.random() * 360},
          60%,
          70%,
          0.55
        )`;


      ctx.beginPath();

      ctx.arc(

        x,
        y,

        2 +
          Math.random() * 3,

        0,
        Math.PI * 2

      );

      ctx.fill();

    }

  }

}
