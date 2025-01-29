// fireworks.js
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'fireworks-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '1'; // 确保在顶部图片前显示

    const body = document.querySelector('body');
    const header = document.querySelector('.header');
    body.insertBefore(canvas, header);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];
    const nameElement = document.createElement('div');
    nameElement.id = 'name';
    nameElement.style.position = 'absolute';
    nameElement.style.top = '50%';
    nameElement.style.left = '50%';
    nameElement.style.transform = 'translate(-50%, -50%)';
    nameElement.style.color = 'white';
    nameElement.style.fontSize = '36px';
    nameElement.style.fontFamily = 'Arial, sans-serif';
    nameElement.style.opacity = '0';
    nameElement.style.transition = 'opacity 1s ease-in-out';
    body.appendChild(nameElement);

    let nameShown = false;

    function randomColor() {
        return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.5;
            this.color = randomColor();
            this.speed = Math.random() * 5 + 5;
        }

        update() {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
                return true;
            }
            return false;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        explode() {
            const numParticles = 50;
            for (let i = 0; i < numParticles; i++) {
                const particle = new Particle(this.x, this.y, this.color);
                particles.push(particle);
            }
            if (!nameShown) {
                setTimeout(() => {
                    nameElement.textContent = '张三'; // 可根据需要修改人名
                    nameElement.style.opacity = 1;
                    nameShown = true;
                }, 1000);
            }
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = (Math.random() - 0.5) * 10;
            this.alpha = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.01;
            if (this.alpha <= 0) {
                return true;
            }
            return false;
        }

        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function createFirework() {
        const firework = new Firework();
        fireworks.push(firework);
        setTimeout(createFirework, Math.random() * 2000 + 500);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const firework = fireworks[i];
            firework.draw();
            if (firework.update()) {
                fireworks.splice(i, 1);
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.draw();
            if (particle.update()) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(animate);
    }

    createFirework();
    animate();
});