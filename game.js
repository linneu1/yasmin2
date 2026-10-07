const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;


/* =========================
   ELEMENTOS DA INTERFACE
========================= */

const introScreen =
  document.getElementById("introScreen");

const gameContainer =
  document.getElementById("gameContainer");

const endScreen =
  document.getElementById("endScreen");

const startButton =
  document.getElementById("startButton");

const restartButton =
  document.getElementById("restartButton");

const attackButton =
  document.getElementById("attackButton");

const specialButton =
  document.getElementById("specialButton");

const fullscreenButton =
  document.getElementById("fullscreenButton");

const playerHealth =
  document.getElementById("playerHealth");

const enemyHealth =
  document.getElementById("enemyHealth");

const healthText =
  document.getElementById("healthText");

const enemyHealthText =
  document.getElementById("enemyHealthText");

const enemyName =
  document.getElementById("enemyName");

const roundText =
  document.getElementById("roundText");

const message =
  document.getElementById("message");

const endTitle =
  document.getElementById("endTitle");

const endMessage =
  document.getElementById("endMessage");

const endIcon =
  document.getElementById("endIcon");


/* =========================
   TECLAS
========================= */

const keys = {};


/* =========================
   JOGADOR
========================= */

const player = {

  x: 250,
  y: HEIGHT / 2,

  width: 28,
  height: 38,

  hp: 120,
  maxHp: 120,

  speed: 3.4,

  facing: 1,

  attackCooldown: 0,

  attackAnimation: 0,

  specialCooldown: 0,

  invincible: 0

};


/* =========================
   AMIGO
========================= */

const friend = {

  x: 185,
  y: HEIGHT / 2 + 45,

  width: 25,
  height: 34,

  attackCooldown: 0,

  bob: 0

};


/* =========================
   INIMIGOS
========================= */

const enemies = [

  {
    name: "Goblin Travesso",
    hp: 75,
    speed: 1.1,
    damage: 7,
    size: 24,
    color: "#769e4b",
    attackRate: 75
  },

  {
    name: "Lobo Sombrio",
    hp: 100,
    speed: 1.7,
    damage: 9,
    size: 22,
    color: "#626b75",
    attackRate: 55
  },

  {
    name: "Cogumelo Maluco",
    hp: 125,
    speed: .75,
    damage: 11,
    size: 29,
    color: "#c34c61",
    attackRate: 65
  },

  {
    name: "Aranha Gigante",
    hp: 155,
    speed: 1.3,
    damage: 13,
    size: 32,
    color: "#3d3546",
    attackRate: 50
  },

  {
    name: "Cavaleiro da Névoa",
    hp: 200,
    speed: .9,
    damage: 16,
    size: 34,
    color: "#68778c",
    attackRate: 48
  },

  {
    name: "Troll da Floresta",
    hp: 270,
    speed: .65,
    damage: 20,
    size: 40,
    color: "#527444",
    attackRate: 60
  },

  {
    name: "Fantasma Travesso",
    hp: 230,
    speed: 1.45,
    damage: 18,
    size: 31,
    color: "#8d7dc0",
    attackRate: 42
  },

  {
    name: "Dragão da Noite",
    hp: 360,
    speed: .85,
    damage: 24,
    size: 43,
    color: "#783d55",
    attackRate: 38
  },

  {
    name: "Guardião Antigo",
    hp: 480,
    speed: .58,
    damage: 28,
    size: 49,
    color: "#53665b",
    attackRate: 45
  },

  {
    name: "👑 REI DAS SOMBRAS",
    hp: 650,
    speed: .85,
    damage: 32,
    size: 54,
    color: "#572d70",
    attackRate: 32
  }

];

let currentEnemyIndex = 0;
let enemy = null;


/* =========================
   PROJÉTEIS
========================= */

let projectiles = [];

let enemyProjectiles = [];

let particles = [];

let blackHoles = [];

let shockwaves = [];


/* =========================
   CONTROLE
========================= */

let gameRunning = false;
let gameEnded = false;

let lastTime = 0;


/* =========================
   CRIAR INIMIGO
========================= */

function createEnemy() {

  const data =
    enemies[currentEnemyIndex];

  enemy = {

    x: WIDTH - 180,

    y:
      100 +
      Math.random() *
      (HEIGHT - 200),

    hp: data.hp,

    maxHp: data.hp,

    speed: data.speed,

    damage: data.damage,

    size: data.size,

    color: data.color,

    attackRate: data.attackRate,

    attackCooldown: 50,

    hitFlash: 0

  };


  enemyName.textContent =
    data.name;

  roundText.textContent =
    `INIMIGO ${currentEnemyIndex + 1} / ${enemies.length}`;

  message.textContent =
    currentEnemyIndex === 0
      ? "⚔️ Um inimigo apareceu!"
      : "⚔️ Outro inimigo surgiu!";


  player.x = 250;

  player.y = HEIGHT / 2;

  friend.x = 185;

  friend.y =
    HEIGHT / 2 + 45;

}


/* =========================
   COMEÇAR
========================= */

function startGame() {

  currentEnemyIndex = 0;

  player.hp =
    player.maxHp;

  player.x = 250;
  player.y = HEIGHT / 2;

  player.attackCooldown = 0;
  player.specialCooldown = 0;
  player.invincible = 0;

  projectiles = [];
  enemyProjectiles = [];
  particles = [];
  blackHoles = [];
  shockwaves = [];

  gameEnded = false;
  gameRunning = true;

  endScreen.style.display =
    "none";

  introScreen.style.display =
    "none";

  gameContainer.style.display =
    "block";

  specialButton.classList.add(
    "ready"
  );

  createEnemy();

  updateHUD();

}


/* =========================
   MOVIMENTO
========================= */

function updatePlayer(dt) {

  let dx = 0;
  let dy = 0;


  if (
    keys["w"] ||
    keys["W"] ||
    keys["ArrowUp"]
  ) {

    dy--;

  }

  if (
    keys["s"] ||
    keys["S"] ||
    keys["ArrowDown"]
  ) {

    dy++;

  }

  if (
    keys["a"] ||
    keys["A"] ||
    keys["ArrowLeft"]
  ) {

    dx--;

  }

  if (
    keys["d"] ||
    keys["D"] ||
    keys["ArrowRight"]
  ) {

    dx++;

  }


  if (
    dx !== 0 ||
    dy !== 0
  ) {

    const distance =
      Math.hypot(dx, dy);

    player.x +=
      dx / distance *
      player.speed *
      dt;

    player.y +=
      dy / distance *
      player.speed *
      dt;

    if (dx !== 0) {

      player.facing =
        dx > 0 ? 1 : -1;

    }

  }


  player.x =
    Math.max(
      45,
      Math.min(
        WIDTH - 45,
        player.x
      )
    );

  player.y =
    Math.max(
      75,
      Math.min(
        HEIGHT - 55,
        player.y
      )
    );


  if (player.attackCooldown > 0) {

    player.attackCooldown -= dt;

  }

  if (player.attackAnimation > 0) {

    player.attackAnimation -= dt;

  }

  if (player.specialCooldown > 0) {

    player.specialCooldown -= dt;

  }

  if (player.invincible > 0) {

    player.invincible -= dt;

  }

}


/* =========================
   ATAQUE NORMAL
========================= */

function attack() {

  if (
    !gameRunning ||
    gameEnded ||
    player.attackCooldown > 0
  ) {

    return;

  }

  player.attackCooldown =
    25;

  player.attackAnimation =
    12;


  const attackX =
    player.x +
    player.facing * 45;

  const attackY =
    player.y;


  shockwaves.push({

    x: attackX,

    y: attackY,

    radius: 8,

    maxRadius: 42,

    life: 12,

    color: "#fff0b0"

  });


  const distance =
    Math.hypot(
      enemy.x - attackX,
      enemy.y - attackY
    );


  if (
    distance <
    enemy.size + 35
  ) {

    damageEnemy(25);

  }


  /* Pequena ajuda do amigo */

  if (
    friend.attackCooldown <= 0
  ) {

    friendAttack();

  }

}


/* =========================
   AMIGO ATACA
========================= */

function friendAttack() {

  friend.attackCooldown =
    80;

  const dx =
    enemy.x - friend.x;

  const dy =
    enemy.y - friend.y;

  const distance =
    Math.hypot(dx, dy);


  projectiles.push({

    x: friend.x,

    y: friend.y,

    vx:
      dx / distance * 5,

    vy:
      dy / distance * 5,

    damage: 9,

    life: 90,

    color: "#ffd86a",

    friendly: true

  });

}


/* =========================
   BURACO NEGRO
========================= */

function useBlackHole() {

  if (
    !gameRunning ||
    gameEnded ||
    player.specialCooldown > 0
  ) {

    return;

  }


  player.specialCooldown =
    480;

  specialButton.classList.remove(
    "ready"
  );

  message.textContent =
    "🕳️ BURACO NEGRO!";


  const targetX =
    enemy.x;

  const targetY =
    enemy.y;


  blackHoles.push({

    x: targetX,

    y: targetY,

    radius: 12,

    maxRadius: 90,

    life: 150

  });


  /*
    O buraco negro puxa e causa
    vários danos ao longo do tempo.
  */

  createParticles(
    targetX,
    targetY,
    "#b87aff",
    35
  );

}


/* =========================
   DANO NO INIMIGO
========================= */

function damageEnemy(amount) {

  if (!enemy) return;

  enemy.hp -= amount;

  enemy.hitFlash =
    8;

  createParticles(
    enemy.x,
    enemy.y,
    "#ffe47b",
    8
  );


  if (enemy.hp <= 0) {

    enemyDefeated();

  }

}


/* =========================
   INIMIGO DERROTADO
========================= */

function enemyDefeated() {

  createParticles(
    enemy.x,
    enemy.y,
    "#d6a5ff",
    40
  );


  if (
    currentEnemyIndex <
    enemies.length - 1
  ) {

    currentEnemyIndex++;


    /*
      Daniel recupera um pouco
      de vida entre as batalhas.
    */

    player.hp =
      Math.min(
        player.maxHp,
        player.hp + 22
      );


    message.textContent =
      "🌟 Daniel venceu! Prepare-se para o próximo!";


    enemy = null;


    setTimeout(() => {

      if (
        gameRunning &&
        !gameEnded
      ) {

        createEnemy();

      }

    }, 1200);


  } else {

    victory();

  }

}


/* =========================
   VITÓRIA
========================= */

function victory() {

  gameEnded = true;
  gameRunning = false;

  endScreen.style.display =
    "flex";

  endIcon.textContent =
    "🏆";

  endTitle.textContent =
    "DANIEL VENCEU!";

  endMessage.textContent =
    "Daniel e seu amigo salvaram a Floresta Mágica!";

}


/* =========================
   DERROTA
========================= */

function defeat() {

  gameEnded = true;
  gameRunning = false;

  endScreen.style.display =
    "flex";

  endIcon.textContent =
    "💀";

  endTitle.textContent =
    "DANIEL FOI DERROTADO";

  endMessage.textContent =
    "A floresta ainda precisa de você. Tente novamente!";

}


/* =========================
   INIMIGO
========================= */

function updateEnemy(dt) {

  if (
    !enemy ||
    gameEnded
  ) {

    return;

  }


  const dx =
    player.x - enemy.x;

  const dy =
    player.y - enemy.y;

  const distance =
    Math.hypot(dx, dy) || 1;


  /*
    Persegue Daniel.
  */

  if (
    distance >
    enemy.size + 35
  ) {

    enemy.x +=
      dx / distance *
      enemy.speed *
      dt;

    enemy.y +=
      dy / distance *
      enemy.speed *
      dt;

  }


  /*
    Ataque.
  */

  if (
    enemy.attackCooldown > 0
  ) {

    enemy.attackCooldown -= dt;

  }


  if (
    distance <
    enemy.size + 40 &&
    enemy.attackCooldown <= 0
  ) {

    damagePlayer(
      enemy.damage
    );

    enemy.attackCooldown =
      enemy.attackRate;

  }


  /*
    Inimigos avançados também
    lançam ataques à distância.
  */

  if (
    currentEnemyIndex >= 4 &&
    distance > 120 &&
    enemy.attackCooldown <= 0
  ) {

    enemyShoot();

    enemy.attackCooldown =
      enemy.attackRate;

  }


  if (
    enemy.hitFlash > 0
  ) {

    enemy.hitFlash -= dt;

  }

}


/* =========================
   ATAQUE DO INIMIGO
========================= */

function enemyShoot() {

  const dx =
    player.x - enemy.x;

  const dy =
    player.y - enemy.y;

  const distance =
    Math.hypot(dx, dy) || 1;


  enemyProjectiles.push({

    x: enemy.x,

    y: enemy.y,

    vx:
      dx / distance * 4,

    vy:
      dy / distance * 4,

    damage:
      enemies[currentEnemyIndex]
        .damage * .7,

    life: 150,

    color: "#c275e6"

  });

}


/* =========================
   DANO NO JOGADOR
========================= */

function damagePlayer(amount) {

  if (
    player.invincible > 0
  ) {

    return;

  }


  player.hp -= amount;

  player.invincible =
    30;


  createParticles(
    player.x,
    player.y,
    "#ff6868",
    10
  );


  if (
    player.hp <= 0
  ) {

    player.hp = 0;

    defeat();

  }

}


/* =========================
   PROJÉTEIS
========================= */

function updateProjectiles(dt) {

  for (
    const p of projectiles
  ) {

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    p.life -= dt;


    if (!enemy) continue;


    const distance =
      Math.hypot(
        p.x - enemy.x,
        p.y - enemy.y
      );


    if (
      distance <
      enemy.size + 8
    ) {

      damageEnemy(
        p.damage
      );

      p.life = 0;

    }

  }


  projectiles =
    projectiles.filter(
      p =>
        p.life > 0
    );


  /*
    Projéteis inimigos
  */

  for (
    const p
    of enemyProjectiles
  ) {

    p.x +=
      p.vx * dt;

    p.y +=
      p.vy * dt;

    p.life -= dt;


    const distance =
      Math.hypot(
        p.x - player.x,
        p.y - player.y
      );


    if (
      distance < 20
    ) {

      damagePlayer(
        p.damage
      );

      p.life = 0;

    }

  }


  enemyProjectiles =
    enemyProjectiles.filter(
      p =>
        p.life > 0
    );

}


/* =========================
   BURACO NEGRO
========================= */

function updateBlackHoles(dt) {

  for (
    const hole
    of blackHoles
  ) {

    hole.life -= dt;

    hole.radius =
      Math.min(
        hole.maxRadius,
        hole.radius +
        3 * dt
      );


    if (enemy) {

      const dx =
        hole.x - enemy.x;

      const dy =
        hole.y - enemy.y;

      const distance =
        Math.hypot(dx, dy) || 1;


      if (
        distance <
        hole.maxRadius
      ) {

        /*
          Puxa o inimigo.
        */

        enemy.x +=
          dx / distance *
          2.5 *
          dt;

        enemy.y +=
          dy / distance *
          2.5 *
          dt;


        /*
          Dano contínuo.
        */

        if (
          Math.random() < .15
        ) {

          damageEnemy(3);

        }

      }

    }

  }


  blackHoles =
    blackHoles.filter(
      hole =>
        hole.life > 0
    );


  if (
    player.specialCooldown <= 0
  ) {

    specialButton.classList.add(
      "ready"
    );

  }

}


/* =========================
   PARTÍCULAS
========================= */

function createParticles(
  x,
  y,
  color,
  amount
) {

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI *
      2;

    const speed =
      .5 +
      Math.random() * 3;


    particles.push({

      x,
      y,

      vx:
        Math.cos(angle) *
        speed,

      vy:
        Math.sin(angle) *
        speed,

      life:
        20 +
        Math.random() * 30,

      color

    });

  }

}


function updateParticles(dt) {

  for (
    const p
    of particles
  ) {

    p.x +=
      p.vx * dt;

    p.y +=
      p.vy * dt;

    p.vy +=
      .03 * dt;

    p.life -= dt;

  }


  particles =
    particles.filter(
      p =>
        p.life > 0
    );


  if (
    friend.attackCooldown > 0
  ) {

    friend.attackCooldown -= dt;

  }

  friend.bob +=
    .08 * dt;

}


/* =========================
   FLORESTA
========================= */

function drawForest() {

  /*
    Fundo.
  */

  ctx.fillStyle =
    "#173d22";

  ctx.fillRect(
    0,
    0,
    WIDTH,
    HEIGHT
  );


  /*
    Caminho.
  */

  ctx.fillStyle =
    "#355d32";

  ctx.fillRect(
    0,
    HEIGHT / 2 - 55,
    WIDTH,
    110
  );


  /*
    Pedras.
  */

  for (
    let i = 0;
    i < 35;
    i++
  ) {

    const x =
      (i * 173) %
      WIDTH;

    const y =
      65 +
      ((i * 91) %
      (HEIGHT - 120));


    ctx.fillStyle =
      i % 2
        ? "#53684b"
        : "#64765a";

    ctx.fillRect(
      x,
      y,
      9,
      6
    );

  }


  /*
    Árvores.
  */

  for (
    let i = 0;
    i < 18;
    i++
  ) {

    const x =
      20 +
      ((i * 97) %
      (WIDTH - 40));

    const y =
      i % 2 === 0
        ? 55 + (i % 5) * 25
        : HEIGHT - 90 -
          (i % 4) * 25;


    drawTree(
      x,
      y
    );

  }


  /*
    Cogumelos.
  */

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const x =
      40 +
      i * 77;

    const y =
      110 +
      (i % 5) * 75;


    drawMushroom(
      x,
      y
    );

  }


  /*
    Bordas.
  */

  ctx.strokeStyle =
    "#80633b";

  ctx.lineWidth = 6;

  ctx.strokeRect(
    10,
    30,
    WIDTH - 20,
    HEIGHT - 45
  );

}


/* =========================
   ÁRVORE
========================= */

function drawTree(
  x,
  y
) {

  ctx.fillStyle =
    "#573b27";

  ctx.fillRect(
    x - 7,
    y,
    14,
    38
  );


  ctx.fillStyle =
    "#183d22";

  ctx.fillRect(
    x - 30,
    y - 25,
    60,
    35
  );


  ctx.fillStyle =
    "#285b2d";

  ctx.fillRect(
    x - 38,
    y - 8,
    76,
    30
  );

}


/* =========================
   COGUMELO
========================= */

function drawMushroom(
  x,
  y
) {

  ctx.fillStyle =
    "#eadbb5";

  ctx.fillRect(
    x - 4,
    y,
    8,
    13
  );

  ctx.fillStyle =
    "#bd4656";

  ctx.fillRect(
    x - 10,
    y - 6,
    20,
    9
  );

}


/* =========================
   DANIEL
========================= */

function drawPlayer() {

  /*
    Sombra.
  */

  ctx.fillStyle =
    "#102013";

  ctx.fillRect(
    player.x - 17,
    player.y + 19,
    34,
    7
  );


  /*
    Piscar quando recebe dano.
  */

  if (
    player.invincible > 0 &&
    Math.floor(
      player.invincible / 4
    ) % 2 === 0
  ) {

    return;

  }


  ctx.save();

  ctx.translate(
    player.x,
    player.y
  );


  if (
    player.facing === -1
  ) {

    ctx.scale(
      -1,
      1
    );

  }


  /*
    Pernas.
  */

  ctx.fillStyle =
    "#27344e";

  ctx.fillRect(
    -10,
    12,
    8,
    13
  );

  ctx.fillRect(
    3,
    12,
    8,
    13
  );


  /*
    Corpo.
  */

  ctx.fillStyle =
    "#315b91";

  ctx.fillRect(
    -13,
    -8,
    26,
    25
  );


  /*
    Cabeça.
  */

  ctx.fillStyle =
    "#d8b58c";

  ctx.fillRect(
    -12,
    -28,
    24,
    21
  );


  /*
    Cabelo.
  */

  ctx.fillStyle =
    "#38271d";

  ctx.fillRect(
    -13,
    -31,
    27,
    8
  );

  ctx.fillRect(
    -13,
    -25,
    6,
    8
  );


  /*
    Olho.
  */

  ctx.fillStyle =
    "#201712";

  ctx.fillRect(
    5,
    -21,
    4,
    4
  );


  /*
    O RISCO NO OLHO.
  */

  ctx.strokeStyle =
    "#542b29";

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    3,
    -27
  );

  ctx.lineTo(
    10,
    -17
  );

  ctx.stroke();


  /*
    Braços.
  */

  ctx.fillStyle =
    "#d8b58c";

  ctx.fillRect(
    12,
    -5,
    9,
    7
  );


  /*
    Ataque.
  */

  if (
    player.attackAnimation > 0
  ) {

    ctx.fillStyle =
      "#f5e6a8";

    ctx.fillRect(
      20,
      -8,
      25,
      7
    );

  }


  ctx.restore();


  /*
    Nome.
  */

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 13px monospace";

  ctx.fillStyle =
    "#f2d66c";

  ctx.fillText(
    "DANIEL",
    player.x,
    player.y - 38
  );

  ctx.textAlign =
    "left";

}


/* =========================
   AMIGO
========================= */

function drawFriend() {

  const y =
    friend.y +
    Math.sin(
      friend.bob
    ) * 3;


  /*
    Sombra.
  */

  ctx.fillStyle =
    "#102013";

  ctx.fillRect(
    friend.x - 14,
    y + 18,
    28,
    5
  );


  /*
    Corpo.
  */

  ctx.fillStyle =
    "#a65b3d";

  ctx.fillRect(
    friend.x - 11,
    y - 5,
    22,
    22
  );


  /*
    Cabeça.
  */

  ctx.fillStyle =
    "#d9b98c";

  ctx.fillRect(
    friend.x - 10,
    y - 23,
    20,
    18
  );


  /*
    Chapéu.
  */

  ctx.fillStyle =
    "#d6a94e";

  ctx.fillRect(
    friend.x - 14,
    y - 26,
    28,
    5
  );


  ctx.fillStyle =
    "#241914";

  ctx.fillRect(
    friend.x - 6,
    y - 17,
    3,
    3
  );

  ctx.fillRect(
    friend.x + 4,
    y - 17,
    3,
    3
  );


  ctx.textAlign =
    "center";

  ctx.font =
    "bold 10px monospace";

  ctx.fillStyle =
    "#fff1b5";

  ctx.fillText(
    "AMIGO",
    friend.x,
    y - 32
  );

  ctx.textAlign =
    "left";

}


/* =========================
   INIMIGO
========================= */

function drawEnemy() {

  if (!enemy) return;


  ctx.fillStyle =
    "#111";

  ctx.fillRect(
    enemy.x -
      enemy.size,

    enemy.y +
      enemy.size,

    enemy.size * 2,
    7
  );


  ctx.fillStyle =
    enemy.hitFlash > 0
      ? "#fff"
      : enemy.color;


  ctx.fillRect(
    enemy.x -
      enemy.size,

    enemy.y -
      enemy.size,

    enemy.size * 2,

    enemy.size * 2
  );


  /*
    Olhos.
  */

  ctx.fillStyle =
    "#ffdf72";

  ctx.fillRect(
    enemy.x -
      enemy.size * .5,

    enemy.y -
      enemy.size * .3,

    6,
    6
  );

  ctx.fillRect(
    enemy.x +
      enemy.size * .3,

    enemy.y -
      enemy.size * .3,

    6,
    6
  );


  /*
    Nome.
  */

  ctx.textAlign =
    "center";

  ctx.font =
    "bold 13px monospace";

  ctx.fillStyle =
    "#f1dfae";

  ctx.fillText(
    enemies[currentEnemyIndex].name,
    enemy.x,
    enemy.y -
      enemy.size -
      20
  );


  /*
    Barra de vida.
  */

  ctx.fillStyle =
    "#301515";

  ctx.fillRect(
    enemy.x - 45,
    enemy.y -
      enemy.size -
      13,
    90,
    7
  );

  ctx.fillStyle =
    "#d34b47";

  ctx.fillRect(
    enemy.x - 45,
    enemy.y -
      enemy.size -
      13,

    90 *
      Math.max(
        0,
        enemy.hp /
          enemy.maxHp
      ),

    7
  );


  ctx.textAlign =
    "left";

}


/* =========================
   BURACO NEGRO VISUAL
========================= */

function drawBlackHoles() {

  for (
    const hole
    of blackHoles
  ) {

    const gradient =
      ctx.createRadialGradient(
        hole.x,
        hole.y,
        2,
        hole.x,
        hole.y,
        hole.radius
      );


    gradient.addColorStop(
      0,
      "#050009"
    );

    gradient.addColorStop(
      .55,
      "#180525"
    );

    gradient.addColorStop(
      .8,
      "#823bb5"
    );

    gradient.addColorStop(
      1,
      "rgba(140,60,190,0)"
    );


    ctx.fillStyle =
      gradient;

    ctx.beginPath();

    ctx.arc(
      hole.x,
      hole.y,
      hole.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();


    /*
      Estrelas sendo sugadas.
    */

    for (
      let i = 0;
      i < 8;
      i++
    ) {

      const angle =
        performance.now() /
        500 +
        i;

      const radius =
        hole.radius *
        (.7 + (i % 3) * .15);


      ctx.fillStyle =
        "#d7a7ff";

      ctx.fillRect(
        hole.x +
          Math.cos(angle) *
          radius,

        hole.y +
          Math.sin(angle) *
          radius,

        3,
        3
      );

    }

  }

}


/* =========================
   PROJÉTEIS
========================= */

function drawProjectiles() {

  for (
    const p
    of projectiles
  ) {

    ctx.fillStyle =
      p.color;

    ctx.fillRect(
      p.x - 6,
      p.y - 6,
      12,
      12
    );

  }


  for (
    const p
    of enemyProjectiles
  ) {

    ctx.fillStyle =
      p.color;

    ctx.fillRect(
      p.x - 7,
      p.y - 7,
      14,
      14
    );

  }

}


/* =========================
   PARTÍCULAS
========================= */

function drawParticles() {

  for (
    const p
    of particles
  ) {

    ctx.fillStyle =
      p.color;

    ctx.fillRect(
      p.x,
      p.y,
      5,
      5
    );

  }

}


/* =========================
   GOLPES
========================= */

function updateShockwaves(dt) {

  for (
    const s
    of shockwaves
  ) {

    s.radius +=
      4 * dt;

    s.life -= dt;

  }


  shockwaves =
    shockwaves.filter(
      s =>
        s.life > 0
    );

}


function drawShockwaves() {

  for (
    const s
    of shockwaves
  ) {

    ctx.strokeStyle =
      s.color;

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.arc(
      s.x,
      s.y,
      s.radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();

  }

}


/* =========================
   HUD
========================= */

function updateHUD() {

  const playerPercent =
    Math.max(
      0,
      player.hp /
        player.maxHp
    ) * 100;


  playerHealth.style.width =
    `${playerPercent}%`;


  healthText.textContent =
    `${Math.ceil(player.hp)} / ${player.maxHp}`;


  if (enemy) {

    const enemyPercent =
      Math.max(
        0,
        enemy.hp /
          enemy.maxHp
      ) * 100;


    enemyHealth.style.width =
      `${enemyPercent}%`;


    enemyHealthText.textContent =
      `${Math.ceil(enemy.hp)} / ${enemy.maxHp}`;

  }

}


/* =========================
   LOOP
========================= */

function update(dt) {

  if (
    !gameRunning ||
    gameEnded
  ) {

    return;

  }


  updatePlayer(dt);

  updateEnemy(dt);

  updateProjectiles(dt);

  updateBlackHoles(dt);

  updateParticles(dt);

  updateShockwaves(dt);

  updateHUD();

}


function draw() {

  drawForest();

  drawBlackHoles();

  drawShockwaves();

  drawProjectiles();

  drawParticles();

  drawFriend();

  drawEnemy();

  drawPlayer();

}


function gameLoop(time) {

  const dt =
    Math.min(
      2,
      (time - lastTime) /
        16.67 || 1
    );


  lastTime =
    time;


  update(dt);

  draw();


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================
   TECLADO
========================= */

window.addEventListener(
  "keydown",
  event => {

    keys[event.key] = true;


    if (
      event.code ===
      "Space"
    ) {

      event.preventDefault();

      attack();

    }


    if (
      event.key.toLowerCase() ===
      "q"
    ) {

      useBlackHole();

    }


    if (
      event.key.toLowerCase() ===
      "r" &&
      gameEnded
    ) {

      startGame();

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    keys[event.key] = false;

  }
);


/* =========================
   BOTÕES
========================= */

startButton.addEventListener(
  "click",
  startGame
);


restartButton.addEventListener(
  "click",
  startGame
);


attackButton.addEventListener(
  "click",
  attack
);


specialButton.addEventListener(
  "click",
  useBlackHole
);


/* =========================
   CONTROLES MOBILE
========================= */

document
  .querySelectorAll(
    ".movement button"
  )
  .forEach(button => {

    const key =
      button.dataset.key;


    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        keys[key] = true;

      }
    );


    button.addEventListener(
      "pointerup",
      () => {

        keys[key] = false;

      }
    );


    button.addEventListener(
      "pointercancel",
      () => {

        keys[key] = false;

      }
    );


    button.addEventListener(
      "pointerleave",
      () => {

        keys[key] = false;

      }
    );

  });


/* =========================
   TELA CHEIA
========================= */

fullscreenButton.addEventListener(
  "click",
  async () => {

    try {

      if (
        !document.fullscreenElement
      ) {

        await document
          .documentElement
          .requestFullscreen();

      } else {

        await document
          .exitFullscreen();

      }

    } catch (error) {

      console.log(
        "Tela cheia indisponível",
        error
      );

    }

  }
);


/* =========================
   INÍCIO
========================= */

requestAnimationFrame(
  gameLoop
);
