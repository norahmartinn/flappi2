console.log("El archivo JavaScript se ha cargado correctamente");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const birdImage = document.getElementById('birdImage');
const jumpSound = document.getElementById('jumpSound');
const selectionScreen = document.getElementById('selectionScreen');

// Variable para controlar si el juego ha iniciado
let gameStarted = false;

// Configuración del pájaro
const bird = {
    x: 50,
    y: 300,
    width: 40,  // Ajusta esto al ancho de tu imagen
    height: 30, // Ajusta esto al alto de tu imagen
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

// Configuración de los tubos
const pipes = [];
const pipeWidth = 50;
const pipeGap = 150;

// Función para seleccionar el pájaro e iniciar el juego
function selectBird(birdSrc) {
    console.log("Pájaro seleccionado:", birdSrc);
    
    // Cargar la imagen del pájaro seleccionado
    birdImage.src = birdSrc;
    
    // Manejar error si la imagen no existe, usar bird.png como fallback
    birdImage.onerror = function() {
        console.log("No se encontró", birdSrc, "usando bird.png");
        birdImage.src = 'bird.png';
    };
    
    // Esperar a que la imagen se cargue antes de iniciar el juego
    birdImage.onload = function() {
        console.log("Imagen cargada, iniciando juego");
        
        // Ocultar pantalla de selección
        selectionScreen.style.display = 'none';
        
        // Mostrar canvas del juego
        canvas.style.display = 'block';
        
        // Iniciar el juego
        gameStarted = true;
        gameLoop();
    };
}

// Función para dibujar el pájaro
function drawBird() {
    ctx.drawImage(birdImage, bird.x - bird.width / 2, bird.y - bird.height / 2, bird.width, bird.height);
}

// Función para dibujar los tubos
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

// Función para actualizar el estado del juego
function update() {
    if (!gameStarted) return;
    
    // Actualizar posición del pájaro
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generar nuevos tubos
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const pipeY = Math.random() * (canvas.height - pipeGap);
        pipes.push({
            x: canvas.width,
            top: pipeY,
            bottom: pipeY + pipeGap
        });
    }

    // Mover tubos
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    // Eliminar tubos fuera de la pantalla
    if (pipes[0] && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }

    // Detectar colisiones
    pipes.forEach(pipe => {
        if (
            bird.x + bird.width / 2 > pipe.x &&
            bird.x - bird.width / 2 < pipe.x + pipeWidth &&
            (bird.y - bird.height / 2 < pipe.top || bird.y + bird.height / 2 > pipe.bottom)
        ) {
            // Colisión detectada, reiniciar juego
            bird.y = 300;
            bird.velocity = 0;
            pipes.length = 0;
        }
    });

    // Mantener el pájaro dentro del canvas
    if (bird.y + bird.height / 2 > canvas.height) {
        bird.y = canvas.height - bird.height / 2;
        bird.velocity = 0;
    }
}

// Función principal del juego
function gameLoop() {
    if (!gameStarted) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    update();
    drawPipes();
    drawBird();
    
    requestAnimationFrame(gameLoop);
}

// Modifica el evento para hacer saltar al pájaro y reproducir el sonido
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && gameStarted) {
        bird.velocity = bird.jump;
        playJumpSound();
    }
});

// Función para reproducir el sonido de salto
function playJumpSound() {
    jumpSound.currentTime = 0; // Reinicia el audio al principio
    jumpSound.play().catch(error => console.log("Error al reproducir el sonido:", error));
}

// El juego no se inicia automáticamente, espera a que se seleccione un pájaro
