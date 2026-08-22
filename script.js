document.addEventListener('DOMContentLoaded', () => {
    // --- State & DOM Elements ---
    let currentIntroIndex = 0;
    let noClickCount = 0;

    const introTexts = [
        "Hey...",
        "Hey... \nnew neighbour.",
        "I made something \njust for you."
    ];

    const introTextEl = document.getElementById('intro-text');
    const heartIcon = document.getElementById('heart-icon');
    const nextIntroBtn = document.getElementById('next-intro-btn');

    const screenIntro = document.getElementById('screen-intro');
    const screenGift = document.getElementById('screen-gift');
    const giftBox = document.getElementById('gift-box');

    const screenLetter = document.getElementById('screen-letter');
    const envelope = document.getElementById('envelope');
    const letterContent = document.getElementById('letter-content');
    const continueToQuestionBtn = document.getElementById('continue-to-question-btn');

    const screenQuestion = document.getElementById('screen-question');
    const questionSubtitle = document.getElementById('question-subtitle');
    const questionTitle = document.getElementById('question-title');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    const screenFinal = document.getElementById('screen-final');
    const seed = document.getElementById('seed');
    const treeStage = document.getElementById('tree-stage');
    const finalMessage = document.getElementById('final-message');
    const successHeader = document.getElementById('success-header');

    // --- 1. Intro Sequence (Screens 1 to 3) ---
    function typeText(text, index = 0) {
        if (index === 0) introTextEl.innerHTML = "";
        
        if (index < text.length) {
            const char = text.charAt(index) === '\n' ? '<br>' : text.charAt(index);
            introTextEl.innerHTML += char;
            setTimeout(() => typeText(text, index + 1), 70);
        } else {
            heartIcon.classList.remove('hidden');
            nextIntroBtn.classList.remove('hidden');
        }
    }

    typeText(introTexts[currentIntroIndex]);

    nextIntroBtn.addEventListener('click', () => {
        currentIntroIndex++;
        if (currentIntroIndex < introTexts.length) {
            heartIcon.classList.add('hidden');
            nextIntroBtn.classList.add('hidden');
            typeText(introTexts[currentIntroIndex]);
        } else {
            // Move to Screen 4 (Gift)
            switchScreen(screenIntro, screenGift);
        }
    });

    // --- 2. Gift Screen (Screen 4) ---
    giftBox.addEventListener('click', () => {
        switchScreen(screenGift, screenLetter);
    });

    // --- 3. Letter Screen (Screens 5 & 6) ---
    envelope.addEventListener('click', () => {
        envelope.classList.add('hidden');
        letterContent.classList.remove('hidden');
    });

    continueToQuestionBtn.addEventListener('click', () => {
        switchScreen(screenLetter, screenQuestion);
    });

    // --- 4. Question & Runaway No Button (Screens 7, 8, 9) ---
    function moveNoButton() {
        const padding = 50;
        const maxX = window.innerWidth - noBtn.offsetWidth - padding;
        const maxY = window.innerHeight - noBtn.offsetHeight - padding;

        const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
        const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${randomX}px`;
        noBtn.style.top = `${randomY}px`;
    }

    // Dodging on hover/touch
    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    noBtn.addEventListener('click', () => {
        noClickCount++;
        moveNoButton();

        if (noClickCount === 1) {
            // Screen 8 Text
            questionSubtitle.innerText = "Arre arre arre! 😜";
            questionTitle.innerText = "You can't escape that easily!";
        } else if (noClickCount >= 2) {
            // Screen 9 Text
            questionSubtitle.innerText = "Okay okay... Seriously?";
            questionTitle.innerText = "Do you really not want to be friends? 🥺";
        }
    });

    // --- 5. Yes Clicked & Tree Growth (Screens 10, 11, 12) ---
    yesBtn.addEventListener('click', () => {
        switchScreen(screenQuestion, screenFinal);
        
        // Tree Growth Sequence
        setTimeout(() => {
            seed.classList.remove('hidden');
            seed.innerText = "🌱";
            
            setTimeout(() => {
                treeStage.innerText = "🪴";
                
                setTimeout(() => {
                    treeStage.innerText = "🌳";
                    
                    setTimeout(() => {
                        treeStage.innerText = "🌸🌳🌸"; // Heart/Pink Tree aesthetic
                        
                        // Show final message (Screen 12)
                        setTimeout(() => {
                            successHeader.classList.add('hidden');
                            treeStage.classList.add('hidden');
                            finalMessage.classList.remove('hidden');
                        }, 1200);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 500);
    });

    // Helper Function to Switch Screens smoothly
    function switchScreen(fromScreen, toScreen) {
        fromScreen.classList.remove('active');
        fromScreen.classList.add('hidden');
        toScreen.classList.remove('hidden');
        toScreen.classList.add('active');
    }
});
      
