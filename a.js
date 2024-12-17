async function findNumberFast(gameNumber) {
    const binaryStartTime12 = new Date().getTime(); // 전체 탐색 시작 시간
    console.log(`Binary search started at: ${new Date(binaryStartTime12).toISOString()}`);

    let min = 1;
    let max = 9999;

    const _passwd = document.querySelector('.passwd').value;
    const _studentId = document.querySelector('.studentId').value;

    console.log('Starting number search...');
    console.log(`Initial range: min = ${min}, max = ${max}`);

    // 1. 초기 난수 설정 및 범위 축소
    const sampleCount = 10; // 샘플 개수 (조정 가능)
    const rangeSize = Math.ceil((max - min + 1) / sampleCount); // 샘플 구간 크기
    const guesses = Array.from({ length: sampleCount }, (_, i) => min + i * rangeSize);

    console.log(`Generated initial guesses: ${guesses}`);
    
    const results = await Promise.all(
        guesses.map(guess => sendGuess(guess, _passwd, _studentId))
    );

    // 초기 샘플링 결과 처리
    for (let i = 0; i < results.length; i++) {
        const guess = guesses[i];
        const result = results[i];
        console.log(`Sampling #${i + 1}: Guess = ${guess}, Result = ${result}`);

        if (result === "정답입니다.") {
            console.log(`Correct! The number is ${guess}`);
            findnum.value = guess;
            document.getElementById('go').click();
            updateResultsTable(gameNumber, (new Date().getTime() - binaryStartTime12) / 1000, guess);
            return;
        } else if (result === "정답보다 작습니다.") {
            min = guess + 1; // 최소값 갱신
        } else if (result === "정답보다 큽니다." && guess < max) {
            max = guess - 1; // 최대값 갱신, 주어진 숫자보다 클 때만 갱신
        }
    }

    console.log(`After sampling: min = ${min}, max = ${max}`);

    // 2. 이진탐색 단계
    const binaryStartTime = new Date().getTime();
    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        console.log(`Guessing mid = ${mid}`);
        const isCorrect = await sendGuess(mid, _passwd, _studentId);

        if (isCorrect === "정답입니다.") {
            console.log(`Correct! The number is ${mid}`);
            findnum.value = mid;
            document.getElementById('go').click();
            const binaryEndTime12 = new Date().getTime(); // 총 탐색 끝 시간
            console.log(`총 Binary search duration: ${(binaryEndTime12 - binaryStartTime12) / 1000} seconds`);
            updateResultsTable(gameNumber, (binaryEndTime12 - binaryStartTime12) / 1000, mid);
            return;
        } else if (isCorrect === "정답보다 작습니다.") {
            min = mid + 1;
        } else if (isCorrect === "정답보다 큽니다." && mid < max) {
            max = mid - 1;
        }
    }
}
async function findNumberFast() {
    const binaryStartTime12 = new Date().getTime();
    console.log(`Binary search started at: ${new Date(binaryStartTime12).toISOString()}`);

    let min = 1;
    let max = 9999;

    const _passwd = document.querySelector('.passwd').value;
    const _studentId = document.querySelector('.studentId').value;

    console.log('Starting number search...');
    console.log(`Initial range: min = ${min}, max = ${max}`);

    // 고정된 숫자 배열
    const fixedGuesses = [1000, 2500, 4000, 6000, 8000];
    console.log(`Fixed guesses: ${fixedGuesses}`);

    // 고정된 숫자 순차 처리
    for (let i = 0; i < fixedGuesses.length; i++) {
        const guess = fixedGuesses[i];
        const result = await sendGuess(guess, _passwd, _studentId);

        console.log(`Fixed guess #${i + 1}: Guess = ${guess}, Result = ${result}`);

        if (result === "정답입니다.") {
            console.log(`Correct! The number is ${guess}`);
            findnum.value = guess;
            document.getElementById('go').click();
            return;
        } else if (result === "정답보다 작습니다.") {
            min = Math.max(min, guess + 1);
        } else if (result === "정답보다 큽니다.") {
            max = Math.min(max, guess - 1);
        }
    }

    console.log(`After fixed guesses: min = ${min}, max = ${max}`);

    // 이진탐색 단계
    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        console.log(`Guessing mid = ${mid}`);
        const result = await sendGuess(mid, _passwd, _studentId);

        if (result === "정답입니다.") {
            console.log(`Correct! The number is ${mid}`);
            findnum.value = mid;
            document.getElementById('go').click();
            return;
        } else if (result === "정답보다 작습니다.") {
            min = mid + 1;
        } else if (result === "정답보다 큽니다.") {
            max = mid - 1;
        }
    }
}
