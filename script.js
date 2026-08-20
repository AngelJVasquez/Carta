/* ==========================================================================
   LÓGICA INTERACTIVA PEDIDA DE MATRIMONIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PERSONALIZACIÓN VÍA URL PARAMETER ---
    const urlParams = new URLSearchParams(window.location.search);
    const customName = urlParams.get('nombre') || urlParams.get('to');
    
    if (customName) {
        const recipientElem = document.getElementById('recipient-name');
        const letterRecipientElem = document.getElementById('letter-recipient');
        if (recipientElem) recipientElem.textContent = `Para: ${customName} ❤️`;
        if (letterRecipientElem) letterRecipientElem.textContent = `${customName}, mi amor,`;
    }

    // --- 2. SINTETIZADOR DE MÚSICA ROMÁNTICA (Web Audio API) ---
    // Garantiza música funcional y romántica sin depender de archivos de audio externos.
    class RomanticMusicSynth {
        constructor() {
            this.ctx = null;
            this.isPlaying = false;
            this.timer = null;
            this.currentNoteIndex = 0;
            
            // Progresión romántica de caja de música (Cánon / Balada suave)
            this.notes = [
                { note: 'C5', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
                { note: 'F4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
                { note: 'E5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'G4', dur: 0.5 },
                { note: 'A4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'G4', dur: 0.5 }
            ];

            this.freqMap = {
                'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
                'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00
            };
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playNote(freq, duration) {
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // Sonido suave estilo campana/caja de música
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration + 0.5);
        }

        start() {
            this.init();
            if (this.isPlaying) return;
            this.isPlaying = true;

            const loop = () => {
                if (!this.isPlaying) return;
                const current = this.notes[this.currentNoteIndex];
                const freq = this.freqMap[current.note];
                
                if (freq) {
                    this.playNote(freq, current.dur);
                }

                this.currentNoteIndex = (this.currentNoteIndex + 1) % this.notes.length;
                this.timer = setTimeout(loop, current.dur * 600);
            };

            loop();
        }

        stop() {
            this.isPlaying = false;
            if (this.timer) clearTimeout(this.timer);
        }

        toggle() {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.start();
            }
            return this.isPlaying;
        }
    }

    const romanticAudio = new RomanticMusicSynth();
    const musicBtn = document.getElementById('music-control');
    const musicText = document.getElementById('music-text');

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            const playing = romanticAudio.toggle();
            if (playing) {
                musicBtn.classList.add('playing');
                musicText.textContent = "Música ON";
            } else {
                musicBtn.classList.remove('playing');
                musicText.textContent = "Música OFF";
            }
        });
    }

    // --- 3. SISTEMA DE PARTÍCULAS CANVAS (Pétalos, Corazones y Fuegos Artificiales) ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor(isFirework = false, x = 0, y = 0) {
            this.isFirework = isFirework;
            this.reset(x, y);
        }

        reset(x = 0, y = 0) {
            if (this.isFirework) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 6 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
                this.size = Math.random() * 12 + 8;
                this.type = Math.random() > 0.5 ? 'heart' : 'sparkle';
                this.color = ['#ff4d6d', '#ff758f', '#d4af37', '#ffffff', '#ff8fa3'][Math.floor(Math.random() * 5)];
            } else {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 12 + 6;
                this.speedY = Math.random() * 1 + 0.4;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.rotation = Math.random() * 360;
                this.rotSpeed = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.type = Math.random() > 0.4 ? 'petal' : 'heart';
                this.color = this.type === 'petal' ? '#e8a598' : '#e63956';
            }
        }

        update() {
            if (this.isFirework) {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.08; // Gravedad
                this.alpha -= this.decay;
            } else {
                this.y += this.speedY;
                this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
                this.rotation += this.rotSpeed;

                if (this.y > height + 20) {
                    this.y = -20;
                    this.x = Math.random() * width;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.isFirework ? Math.max(0, this.alpha) : this.opacity;
            ctx.translate(this.x, this.y);

            if (this.type === 'heart') {
                ctx.scale(this.size / 15, this.size / 15);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-5, -5, -10, 0, 0, 10);
                ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
                ctx.fill();
            } else if (this.type === 'petal') {
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size / 2, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Sparkle
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    const particles = Array.from({ length: 35 }, () => new Particle(false));
    let fireworkParticles = [];

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        // Actualizar y dibujar partículas ambientales
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Actualizar y dibujar fuegos artificiales de celebración
        for (let i = fireworkParticles.length - 1; i >= 0; i--) {
            const fp = fireworkParticles[i];
            fp.update();
            fp.draw();
            if (fp.alpha <= 0) {
                fireworkParticles.splice(i, 1);
            }
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    function triggerFireworks() {
        for (let burst = 0; burst < 5; burst++) {
            setTimeout(() => {
                const rx = Math.random() * (width * 0.8) + (width * 0.1);
                const ry = Math.random() * (height * 0.5) + (height * 0.1);
                for (let i = 0; i < 40; i++) {
                    fireworkParticles.push(new Particle(true, rx, ry));
                }
            }, burst * 250);
        }
    }

    // --- 4. APERTURA DE LA CARTA ---
    const waxSeal = document.getElementById('wax-seal');
    const envelope = document.getElementById('envelope');
    const envelopeStage = document.getElementById('envelope-stage');
    const letterStage = document.getElementById('letter-stage');

    if (waxSeal && envelope) {
        waxSeal.addEventListener('click', () => {
            // 1. Iniciar música de fondo
            romanticAudio.start();
            if (musicBtn) {
                musicBtn.classList.add('playing');
                if (musicText) musicText.textContent = "Música ON";
            }

            // 2. Animación de apertura de la carta
            envelope.classList.add('open');
            waxSeal.style.opacity = '0';
            waxSeal.style.pointerEvents = 'none';

            // 3. Transición de pantallas
            setTimeout(() => {
                envelopeStage.style.opacity = '0';
                envelopeStage.style.transition = 'opacity 0.6s ease';
                
                setTimeout(() => {
                    envelopeStage.style.display = 'none';
                    letterStage.classList.remove('hidden');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 600);
            }, 1000);
        });
    }

    // --- 5. BOTÓN JUGUETÓN "NO" (SE MUEVE AL INTENTAR TOCARLO) ---
    const btnNo = document.getElementById('btn-no');
    const btnContainer = document.getElementById('buttons-container');

    if (btnNo && btnContainer) {
        const moveNoButton = () => {
            const containerRect = btnContainer.getBoundingClientRect();
            const btnRect = btnNo.getBoundingClientRect();

            // Calcular nueva posición dentro de la pantalla
            const maxTranslateX = (window.innerWidth < 450 ? 120 : 200);
            const maxTranslateY = 80;

            const randomX = (Math.random() - 0.5) * maxTranslateX * 2;
            const randomY = (Math.random() - 0.5) * maxTranslateY * 2;

            btnNo.style.position = 'relative';
            btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;
            btnNo.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        };

        btnNo.addEventListener('mouseenter', moveNoButton);
        btnNo.addEventListener('touchstart', (e) => {
            e.preventDefault();
            moveNoButton();
        });
    }

    // --- 6. BOTÓN "¡SÍ, ACEPTO!" Y MODAL DE CELEBRACIÓN ---
    const btnYes = document.getElementById('btn-yes');
    const modal = document.getElementById('celebration-modal');
    const closeModal = document.getElementById('close-modal');
    const replayBtn = document.getElementById('replay-btn');
    const whatsappBtn = document.getElementById('whatsapp-btn');

    if (btnYes && modal) {
        btnYes.addEventListener('click', () => {
            // Disparar fuegos artificiales
            triggerFireworks();
            
            // Configurar enlace de WhatsApp si existe parámetro de nombre
            const loverName = customName || "mi amor";
            const whatsappText = encodeURIComponent(`¡SÍ, ACEPTO CON TODO MI CORAZÓN! ❤️💍 Te amo infinitamente y quiero pasar el resto de mi vida a tu lado.`);
            if (whatsappBtn) {
                whatsappBtn.href = `https://wa.me/?text=${whatsappText}`;
            }

            // Mostrar modal
            modal.classList.remove('hidden');
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (replayBtn && modal) {
        replayBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
