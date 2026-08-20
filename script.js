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

    // --- 2. GESTOR DE MÚSICA HÍBRIDO (MP3 Local + Respaldos Sintetizados) ---
    class AudioController {
        constructor() {
            this.audioElem = document.getElementById('bg-music');
            this.synth = new RomanticMusicSynth();
            this.useMP3 = false;
            this.isPlaying = false;
        }

        async start() {
            if (this.isPlaying) return;

            // Intentar reproducir archivo MP3 si existe y está configurado
            if (this.audioElem && this.audioElem.src && !this.audioElem.src.endsWith('.mp3#none')) {
                try {
                    await this.audioElem.play();
                    this.useMP3 = true;
                    this.isPlaying = true;
                    return;
                } catch (err) {
                    console.log("No se pudo cargar/reproducir MP3 local, usando melodia sintetizada de respaldo...", err);
                }
            }

            // Si falla el MP3 o no hay archivo, usar el sintetizador melódico romántico
            this.useMP3 = false;
            this.synth.start();
            this.isPlaying = true;
        }

        stop() {
            this.isPlaying = false;
            if (this.useMP3 && this.audioElem) {
                this.audioElem.pause();
            } else {
                this.synth.stop();
            }
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

    // Sintetizador Polifónico Maestro 6/8: "Perfect" de Ed Sheeran
    class RomanticMusicSynth {
        constructor() {
            this.ctx = null;
            this.isPlaying = false;
            this.timer = null;
            this.tick = 0;

            this.freqMap = {
                'G2': 98.00, 'B2': 123.47, 'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
                'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
                'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F#5': 739.99, 'G5': 783.99
            };

            // Punteo de Guitarra Acústica 6/8 (Compás 6/8: G -> Em -> C -> D)
            this.arpeggioPattern = [
                // G Major (2 compases = 12 corcheas)
                'G2', 'D3', 'G3', 'B3', 'G3', 'D3',  'G2', 'D3', 'G3', 'B3', 'G3', 'D3',
                // E Minor (2 compases = 12 corcheas)
                'E3', 'B3', 'E4', 'G4', 'E4', 'B3',  'E3', 'B3', 'E4', 'G4', 'E4', 'B3',
                // C Major (2 compases = 12 corcheas)
                'C3', 'G3', 'C4', 'E4', 'C4', 'G3',  'C3', 'G3', 'C4', 'E4', 'C4', 'G3',
                // D Major (2 compases = 12 corcheas)
                'D3', 'A3', 'D4', 'F#4', 'D4', 'A3', 'D3', 'A3', 'D4', 'F#4', 'D4', 'A3'
            ];

            // Mapa de voz de Ed Sheeran sincronizado por corcheas exactas (Tick 0 a 95)
            this.vocalRhythmMap = {
                // Verso 1: "I found a love... for me..."
                6: 'D4', 7: 'G4', 8: 'A4', 9: 'B4',
                12: 'B4', 13: 'A4', 14: 'G4', 15: 'E4',
                // "Darling, just dive right in, follow my lead..."
                18: 'D4', 19: 'G4', 20: 'A4', 21: 'B4', 22: 'B4', 23: 'A4', 24: 'G4',
                25: 'G4', 26: 'A4', 27: 'B4', 28: 'G4', 29: 'D4',
                // "Well I found a girl... beautiful and sweet..."
                30: 'D4', 31: 'G4', 32: 'A4', 33: 'B4',
                34: 'B4', 35: 'A4', 36: 'G4', 37: 'E4',
                // "I never knew you were the someone waiting for me..."
                38: 'E4', 39: 'G4', 40: 'A4', 41: 'B4', 42: 'B4', 43: 'A4', 44: 'G4', 45: 'F#4', 46: 'G4',

                // Coro: "Baby, I'm dancing in the dark..."
                48: 'D5', 49: 'D5', 50: 'D5', 51: 'C5', 52: 'B4', 53: 'G4',
                // "...with you between my arms..."
                54: 'D5', 55: 'D5', 56: 'D5', 57: 'C5', 58: 'B4', 59: 'A4', 60: 'G4',
                // "Barefoot on the grass... listening to our favorite song..."
                62: 'D5', 63: 'D5', 64: 'D5', 65: 'C5', 66: 'B4', 67: 'G4',
                68: 'C5', 69: 'B4', 70: 'A4', 71: 'G4', 72: 'A4', 73: 'B4', 74: 'A4', 75: 'G4',
                // "When you said you looked a mess... I whispered underneath my breath..."
                77: 'G4', 78: 'B4', 79: 'D5', 80: 'D5', 81: 'E5', 82: 'D5', 83: 'B4', 84: 'A4', 85: 'G4',
                // "But you heard it, darling... you look perfect tonight..."
                87: 'D5', 88: 'E5', 89: 'D5', 90: 'B4', 91: 'A4', 92: 'G4', 93: 'A4', 94: 'G4'
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

        // Tono de punteo de guitarra acústica cálida
        playGuitarPluck(freq) {
            if (!this.ctx || !freq) return;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(freq * 3.2, now);
            filter.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.5);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.6);
        }

        // Tono de voz cantada brillante de Ed Sheeran
        playVocalNote(freq) {
            if (!this.ctx || !freq) return;
            const now = this.ctx.currentTime;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            // Vibrato ligero de voz
            osc.frequency.linearRampToValueAtTime(freq * 1.003, now + 0.2);
            osc.frequency.linearRampToValueAtTime(freq, now + 0.4);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1600, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.24, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.55);
        }

        start() {
            this.init();
            if (this.isPlaying) return;
            this.isPlaying = true;
            this.tick = 0;

            const totalTicks = 96; // 96 corcheas = 16 compases completos en 6/8
            const tickDurationMs = 310; // 63 BPM en tiempo 6/8 (Perfect)

            const masterClock = () => {
                if (!this.isPlaying) return;

                // 1. Tocar acorde de guitarra 6/8 (Compás en fondo)
                const guitarNote = this.arpeggioPattern[this.tick % 48];
                const guitarFreq = this.freqMap[guitarNote];
                this.playGuitarPluck(guitarFreq);

                // 2. Tocar nota vocal de Ed Sheeran si corresponde en este tick exacto
                const vocalNote = this.vocalRhythmMap[this.tick % totalTicks];
                if (vocalNote) {
                    const vocalFreq = this.freqMap[vocalNote];
                    this.playVocalNote(vocalFreq);
                }

                this.tick++;
                this.timer = setTimeout(masterClock, tickDurationMs);
            };

            masterClock();
        }

        stop() {
            this.isPlaying = false;
            if (this.timer) clearTimeout(this.timer);
        }
    }

    const romanticAudio = new AudioController();
    const musicBtn = document.getElementById('music-control');
    const musicText = document.getElementById('music-text');

    if (musicBtn) {
        musicBtn.addEventListener('click', async () => {
            const playing = romanticAudio.toggle();
            if (playing) {
                musicBtn.classList.add('playing');
                if (musicText) musicText.textContent = "Música ON";
            } else {
                musicBtn.classList.remove('playing');
                if (musicText) musicText.textContent = "Música OFF";
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
