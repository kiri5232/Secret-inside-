/* =========================================
   HELLO NEIGHBOUR
   FINAL INTERACTION
========================================= */


/* =========================================
   SCREEN SYSTEM
========================================= */

const screens =
  document.querySelectorAll(".screen");


function goTo(id) {

  screens.forEach(screen => {

    screen.classList.toggle(
      "active",
      screen.id === id
    );

  });

}


/* =========================================
   INTRO TYPEWRITER
========================================= */

const introText =
  document.getElementById("introText");

const introNext =
  document.getElementById("introNext");


const introLines = [
  "Hey...",
  "new neighbour."
];


let lineIndex = 0;


function typeLine(text) {

  return new Promise(resolve => {

    let i = 0;

    introText.textContent = "";

    const timer =
      setInterval(() => {

        introText.textContent +=
          text[i];

        i++;

        if (i >= text.length) {

          clearInterval(timer);

          setTimeout(
            resolve,
            850
          );

        }

      }, 95);

  });

}


async function runIntro() {

  await typeLine(
    introLines[0]
  );

  await typeLine(
    introLines[1]
  );

  introNext.classList.remove(
    "hidden"
  );

}


runIntro();


introNext.addEventListener(
  "click",
  () => {

    goTo("intro2");

  }
);


/* =========================================
   GENERIC NEXT BUTTONS
========================================= */

document
  .querySelectorAll("[data-next]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        goTo(
          button.dataset.next
        );

      }
    );

  });


/* =========================================
   GIFT
========================================= */

const giftButton =
  document.getElementById("giftButton");


giftButton.addEventListener(
  "click",
  () => {

    giftButton.style.transform =
      "scale(.85) translateY(15px)";

    setTimeout(() => {

      goTo("letter");

    }, 650);

  }
);


/* =========================================
   LETTER
========================================= */

const envelope =
  document.getElementById("envelope");

const letterContinue =
  document.getElementById("letterContinue");


envelope.addEventListener(
  "click",
  () => {

    envelope.classList.add(
      "open"
    );

  }
);


letterContinue.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    goTo("question");

  }
);


/* =========================================
   QUESTION
========================================= */

const yesBtn =
  document.getElementById("yesBtn");

const noBtn =
  document.getElementById("noBtn");

const questionNote =
  document.getElementById("questionNote");


let noUsed = false;


/* =========================================
   FIRST NO
   playful escape
========================================= */

function moveNoButton() {

  const parent =
    noBtn.parentElement;

  const parentRect =
    parent.getBoundingClientRect();

  const buttonRect =
    noBtn.getBoundingClientRect();


  const maxX =
    Math.max(
      20,
      (parentRect.width -
        buttonRect.width) / 2
    );


  const randomX =
    (Math.random() * 2 - 1) *
    maxX;


  const randomY =
    -(20 +
      Math.random() * 35);


  noBtn.style.transform =
    `translate(${randomX}px, ${randomY}px)`;


  questionNote.textContent =
    "Are are arre! 😭 You can't escape that easily!";


  setTimeout(() => {

    noBtn.style.transform =
      "translate(0,0)";

  }, 900);

}


/* desktop */

noBtn.addEventListener(
  "mouseenter",
  () => {

    if (!noUsed) {

      moveNoButton();

    }

  }
);


/* mobile */

noBtn.addEventListener(
  "touchstart",
  event => {

    if (!noUsed) {

      event.preventDefault();

      moveNoButton();

    }

  },
  { passive: false }
);


/* first actual click */

noBtn.addEventListener(
  "click",
  () => {

    if (!noUsed) {

      noUsed = true;

      noBtn.style.transform =
        "translate(0,0)";

      questionNote.textContent =
        "Okay okay 😭... this time I'm asking seriously.";

      setTimeout(() => {

        goTo("realQuestion");

      }, 700);

    }

  }
);


/* =========================================
   REAL YES
========================================= */

yesBtn.addEventListener(
  "click",
  () => {

    startTree();

  }
);


/* =========================================
   SECOND QUESTION
========================================= */

document
  .getElementById("realYes")
  .addEventListener(
    "click",
    () => {

      startTree();

    }
  );


document
  .getElementById("realNo")
  .addEventListener(
    "click",
    () => {

      goTo("noEnd");

    }
  );


/* =========================================
   TREE
========================================= */

let treeStarted = false;


function startTree() {

  if (treeStarted) return;

  treeStarted = true;

  goTo("tree");

  setTimeout(() => {

    document
      .getElementById("seedMessage")
      .classList.add("show");

  }, 800);


  growTree();

}


/* =========================================
   CANVAS TREE
========================================= */

function growTree() {

  const canvas =
    document.getElementById(
      "treeCanvas"
    );

  const ctx =
    canvas.getContext("2d");


  const DPR =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  function resize() {

    canvas.width =
      window.innerWidth * DPR;

    canvas.height =
      window.innerHeight * DPR;

    ctx.setTransform(
      DPR,
      0,
      0,
      DPR,
      0,
      0
    );

  }


  resize();


  window.addEventListener(
    "resize",
    resize
  );


  const mobile =
    window.innerWidth < 700;


  const baseX =
    window.innerWidth / 2;


  const baseY =
    window.innerHeight * .92;


  /*
    Heart canopy points
  */

  const heartPoints = [];


  for (
    let i = 0;
    i < 480;
    i++
  ) {

    const t =
      Math.random() *
      Math.PI *
      2;


    const scale =
      mobile
        ? 11
        : 17;


    const x =
      16 *
      Math.pow(
        Math.sin(t),
        3
      );


    const y =
      -(
        13 * Math.cos(t) -
        5 * Math.cos(2*t) -
        2 * Math.cos(3*t) -
        Math.cos(4*t)
      );


    const random =
      Math.random() *
      .9 +
      .15;


    heartPoints.push({

      x:
        x *
        scale *
        random,

      y:
        y *
        scale *
        random,

      size:
        2 +
        Math.random() * 4,

      hue:
        315 +
        Math.random() * 55,

      delay:
        5000 +
        Math.random() *
        2800

    });

  }


  /*
    Branch structure
  */

  const branches = [];


  function createBranch(
    x,
    y,
    length,
    angle,
    width,
    depth
  ) {

    const endX =
      x +
      Math.cos(angle) *
      length;

    const endY =
      y +
      Math.sin(angle) *
      length;


    branches.push({

      x1:x,
      y1:y,

      x2:endX,
      y2:endY,

      width,

      depth,

      delay:
        depth *
        450 +
        Math.random()*350

    });


    if (depth <= 0)
      return;


    const count =
      depth > 3 ? 2 : 3;


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const spread =
        .35 +
        Math.random()*.25;


      createBranch(

        endX,
        endY,

        length *
          (.58 +
          Math.random()*.15),

        angle +
          (i -
            (count-1)/2) *
          spread,

        Math.max(
          1.2,
          width*.66
        ),

        depth-1

      );

    }

  }


  createBranch(

    baseX,

    baseY,

    mobile ? 85 : 115,

    -Math.PI/2,

    mobile ? 13 : 18,

    6

  );


  const startTime =
    performance.now();


  const duration =
    8000;


  function render(now) {

    const elapsed =
      now -
      startTime;


    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );


    /*
      Ground glow
    */

    const glow =
      ctx.createRadialGradient(
        baseX,
        baseY,
        0,
        baseX,
        baseY,
        mobile ? 150 : 230
      );


    glow.addColorStop(
      0,
      "rgba(255,90,150,.20)"
    );

    glow.addColorStop(
      1,
      "rgba(255,90,150,0)"
    );


    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
      baseX,
      baseY,
      mobile ? 150 : 230,
      0,
      Math.PI*2
    );

    ctx.fill();


    /*
      branches
    */

    branches.forEach(
      branch => {

        let p =
          (
            elapsed -
            branch.delay
          ) /
          2800;


        p =
          Math.max(
            0,
            Math.min(1,p)
          );


        p =
          1 -
          Math.pow(
            1-p,
            3
          );


        const ex =
          branch.x1 +
          (branch.x2 -
           branch.x1) *
          p;


        const ey =
          branch.y1 +
          (branch.y2 -
           branch.y1) *
          p;


        ctx.strokeStyle =
          branch.depth > 4
          ? "#d98b9d"
          : "#9c526d";


        ctx.lineWidth =
          branch.width;


        ctx.lineCap =
          "round";


        ctx.beginPath();

        ctx.moveTo(
          branch.x1,
          branch.y1
        );

        ctx.lineTo(
          ex,
          ey
        );

        ctx.stroke();

      }
    );


    /*
      Heart leaves
    */

    const canopyProgress =
      Math.max(
        0,
        Math.min(
          1,
          (elapsed-4300) /
          3300
        )
      );


    heartPoints.forEach(
      leaf => {

        if (
          elapsed <
          leaf.delay
        )
          return;


        const local =
          Math.min(
            1,
            (elapsed -
             leaf.delay) /
            1300
          );


        const ease =
          1 -
          Math.pow(
            1-local,
            3
          );


        const x =
          baseX +
          leaf.x *
          ease *
          canopyProgress;


        const y =
          baseY -
          180 +
          leaf.y *
          ease *
          canopyProgress;


        /*
          heart-shaped leaf
        */

        ctx.save();

        ctx.translate(
          x,
          y
        );


        const size =
          leaf.size *
          ease;


        ctx.fillStyle =
          `hsla(
            ${leaf.hue},
            90%,
            65%,
            ${.65 + ease*.3}
          )`;


        ctx.shadowBlur =
          10;


        ctx.shadowColor =
          `hsla(
            ${leaf.hue},
            90%,
            65%,
            .35
          )`;


        ctx.beginPath();


        ctx.moveTo(
          0,
          size*.35
        );


        ctx.bezierCurveTo(
          -size*1.4,
          -size*.55,
          -size*.8,
          -size*1.35,
          0,
          -size*.45
        );


        ctx.bezierCurveTo(
          size*.8,
          -size*1.35,
          size*1.4,
          -size*.55,
          0,
          size*.35
        );


        ctx.fill();

        ctx.restore();

      }
    );


    /*
      Floating petals
    */

    if (
      progress > .65
    ) {

      for (
        let i = 0;
        i < 22;
        i++
      ) {

        const t =
          (now / 2500) +
          i;


        const px =
          baseX +
          Math.sin(t*.7+i) *
          (mobile ? 130 : 240);


        const py =
          window.innerHeight*.42 +
          Math.cos(t+i) *
          170;


        ctx.fillStyle =
          `hsla(
            ${320+i*3},
            90%,
            70%,
            .45
          )`;


        ctx.beginPath();

        ctx.arc(
          px,
          py,
          2.2,
          0,
          Math.PI*2
        );

        ctx.fill();

      }

    }


    if (
      progress < 1
    ) {

      requestAnimationFrame(
        render
      );

    }
    else {

      setTimeout(
        () => {

          document
            .getElementById(
              "treeFinal"
            )
            .classList.add("show");

        },
        700
      );

    }

  }


  requestAnimationFrame(
    render
  );

}
