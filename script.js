document.addEventListener('DOMContentLoaded', () => {
    const quizImage = document.getElementById('quiz-image');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const resultDiv = document.getElementById('result');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const nextButton = document.getElementById('next-button');

    let currentScore = 0;
    let questions = []; // �S�Ă̖����i�[����z��
    let currentQuestion = null; // ���ݕ\�����̖��I�u�W�F�N�g
    let timer;
    let timeLeft = 30;

    /**
     * ���f�[�^��ǂݍ��ފ֐�
     */
    async function loadQuestions() {
        try {
            // questions.json���t�F�b�`���ēǂݍ���
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            questions = await response.json();
            if (questions.length === 0) {
                alert('��肪����܂���Bquestions.json���m�F���Ă��������B');
                return false;
            }
            return true;
        } catch (error) {
            console.error('���̓ǂݍ��ݒ��ɃG���[���������܂���:', error);
            alert('���̓ǂݍ��݂Ɏ��s���܂����B');
            return false;
        }
    }

    /**
     * �X�R�A���X�V����֐�
     * @param {number} change - �X�R�A�̑����l
     */
    function updateScore(change) {
        currentScore += change;
        scoreDisplay.textContent = `�X�R�A: ${currentScore}`;
    }

    /**
     * �^�C�}�[���J�n����֐�
     */
    function startTimer() {
        clearInterval(timer); // �����̃^�C�}�[���N���A
        timeLeft = 30;
        timerDisplay.textContent = `�c�莞��: ${timeLeft}�b`;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `�c�莞��: ${timeLeft}�b`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitAnswer(true); // ���Ԑ؂�Ŏ����I�ɉ𓚂��o
            }
        }, 1000);
    }

    /**
     * ���́i�����_���ȁj����\������֐�
     */
    function displayNextQuestion() {
        if (questions.length === 0) {
            resultDiv.textContent = '��肪����܂���B';
            submitButton.style.display = 'none';
            nextButton.style.display = 'none';
            return;
        }

        // �����_���ɖ���I��
        const randomIndex = Math.floor(Math.random() * questions.length);
        currentQuestion = questions[randomIndex];

        quizImage.src = currentQuestion.image_path;
        answerInput.value = '';
        resultDiv.textContent = '';
        resultDiv.className = ''; // �N���X�����Z�b�g
        submitButton.style.display = 'block';
        nextButton.style.display = 'none';
        answerInput.focus();
        startTimer(); // �V������肪���[�h���ꂽ��^�C�}�[���ĊJ
    }

    /**
     * �𓚂��o����֐�
     * @param {boolean} isTimeUp - ���Ԑ؂�ɂ���o���ǂ���
     */
    function submitAnswer(isTimeUp = false) {
        if (!currentQuestion) {
            return; // ��肪���[�h����Ă��Ȃ��ꍇ�͉������Ȃ�
        }

        clearInterval(timer); // �𓚒�o�܂��͎��Ԑ؂�Ń^�C�}�[���~
        const userAnswer = answerInput.value.trim(); // �O��̋󔒂��폜
        const correctAnswer = currentQuestion.name;

        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        const scoreChange = isCorrect ? 10 : -5;

        if (isCorrect) {
            resultDiv.textContent = '�����I';
            resultDiv.className = 'correct';
        } else {
            let message = '�s����... ';
            if (isTimeUp) {
                message = '���Ԑ؂�I';
            }
            resultDiv.textContent = `${message}�����́u${correctAnswer}�v�ł����B`;
            resultDiv.className = 'incorrect';
        }
        updateScore(scoreChange);

        submitButton.style.display = 'none';
        nextButton.style.display = 'block';
    }

    // �C�x���g���X�i�[�̐ݒ�
    submitButton.addEventListener('click', () => submitAnswer(false));
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && submitButton.style.display !== 'none') { // �𓚃{�^�����\������Ă��鎞�̂�Enter�ŉ�
            submitAnswer(false);
        }
    });
    nextButton.addEventListener('click', displayNextQuestion);

    // �A�v���P�[�V�����̏�����
    async function initializeQuiz() {
        const questionsLoaded = await loadQuestions();
        if (questionsLoaded) {
            displayNextQuestion();
        }
    }

    initializeQuiz();
});