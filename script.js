// --- Game Variables ---
        let currentDiff = 1;
        let currentMode = 'endless';
        let score = 0;
        let lives = 3;
        let timeLeft = 60;
        let gameTimer;
        let currentAnswer = 0;
        let isPlaying = false;

        // --- Theme System ---
        function changeTheme(id, el) {
            document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
            el.classList.add('active');
            const themes = [
                'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
                'linear-gradient(-45deg, #23a6d5, #23d5ab, #076585, #fff)',
                'linear-gradient(-45deg, #833ab4, #fd1d1d, #fcb045)',
                'linear-gradient(-45deg, #11998e, #38ef7d, #000)'
            ];
            document.body.style.background = themes[id-1];
            document.body.style.backgroundSize = "400% 400%";
        }

        // --- Game Logic ---
        function startGame(mode) {
            const name = document.getElementById('player-name').value || "นักคำนวณ";
            currentDiff = parseInt(document.getElementById('difficulty').value);
            currentMode = mode;
            score = 0;
            lives = 3;
            timeLeft = 60;
            isPlaying = true;

            document.getElementById('home-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
            document.getElementById('hud-name').innerText = name;
            
            updateHUD();
            nextQuestion();

            if (mode === 'timer') {
                gameTimer = setInterval(() => {
                    timeLeft--;
                    updateHUD();
                    if (timeLeft <= 0) endGame();
                }, 1000);
            }
        }

        function updateHUD() {
            document.getElementById('hud-score').innerText = score;
            let statusHTML = "";
            if (currentMode === 'survival') {
                statusHTML = `<span class="heart">${'<i class="fas fa-heart"></i>'.repeat(lives)}</span>`;
            } else if (currentMode === 'timer') {
                statusHTML = `<i class="fas fa-stopwatch"></i> ${timeLeft}s`;
            } else {
                statusHTML = `<i class="fas fa-infinity"></i>`;
            }
            document.getElementById('hud-status').innerHTML = statusHTML;
        }

        function nextQuestion() {
            const display = document.getElementById('question-display');
            display.classList.remove('anim-correct', 'anim-wrong');
            document.getElementById('answer-input').value = "";
            document.getElementById('answer-input').focus();

            const q = generateQuestion(currentDiff);
            display.innerText = q.text;
            currentAnswer = q.ans;
        }

        function generateQuestion(diff) {
            let a = Math.floor(Math.random() * 10) + 1;
            let b = Math.floor(Math.random() * 10) + 1;
            let c = Math.floor(Math.random() * 10) + 1;

            switch(diff) {
                case 1: // ง่ายมาก: (a + b)
                    return { text: `(${a} + ${b})`, ans: a + b };
                case 2: // ง่าย: (a * b) - c
                    return { text: `(${a} × ${b}) - ${c}`, ans: (a * b) - c };
                case 3: // กลาง: a² + b
                    return { text: `${a}² + ${b}`, ans: (a * a) + b };
                case 4: // ยาก: √square + a
                    let sq = b * b;
                    return { text: `√${sq} + ${a}`, ans: b + a };
                case 5: // ยากมาก: a! (แค่เลขน้อยๆ)
                    const smallA = Math.floor(Math.random() * 5) + 2; // 2-6
                    let fact = 1;
                    for(let i=1; i<=smallA; i++) fact *= i;
                    return { text: `${smallA}!`, ans: fact };
                default:
                    return { text: `${a} + ${b}`, ans: a + b };
            }
        }

        function submitAnswer() {
            const userAns = parseInt(document.getElementById('answer-input').value);
            const display = document.getElementById('question-display');

            if (userAns === currentAnswer) {
                score += 10 * currentDiff;
                display.classList.add('anim-correct');
                setTimeout(nextQuestion, 500);
            } else {
                display.classList.add('anim-wrong');
                if (currentMode === 'survival') {
                    lives--;
                    if (lives <= 0) setTimeout(endGame, 500);
                }
                setTimeout(() => display.classList.remove('anim-wrong'), 500);
            }
            updateHUD();
        }

        function skipQuestion() {
            if (currentMode === 'survival') lives--;
            if (lives <= 0 && currentMode === 'survival') endGame();
            else nextQuestion();
            updateHUD();
        }

        function endGame() {
            isPlaying = false;
            clearInterval(gameTimer);
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');
            document.getElementById('final-score').innerText = score;
        }

        function goHome() {
            clearInterval(gameTimer);
            document.getElementById('game-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden');
        }
