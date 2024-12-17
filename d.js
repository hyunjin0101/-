async function find() {
    let min = 0;
    let max = 10000;
    let attempts = 0;

    const _passwd = document.querySelector('.passwd').value
    const _studentId = document.querySelector('.studentId').value
    //const _gussNum = document.querySelector('#game input').value

    // 1. 랜덤 샘플링으로 초기 범위 축소
    for (let i = 0; i < 3; i++) { // 3번 랜덤 추측
        const randomGuess = Math.floor(Math.random() * (max - min + 1)) + min;
        attempts++;

        console.log(`Attempt #${attempts}: Random guess ${randomGuess}`);
        let guess = document.getElementById("guess");
        guess.value = randomGuess;
        document.getElementById('go').click();
        const param = new URLSearchParams({
            /* passwd: _registerForm.querySelector('.passwd').value,
            studentId: _registerForm.querySelector('.studentId').value, */
            passwd:_passwd,
            studentId:_studentId,
            num: randomGuess
        });

        try {
            const response = await fetch(`${base_url}/find_hl?${param}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': 'DtqBzT4O'
                    }
            });

            const data = await response.json();
            console.log(data);

            if (data.info === "Correct") {
                console.log(`Correct! The number is ${randomGuess}`);
                console.log(`Total attempts: ${attempts}`);
                return;
            } else if (data.info === "Higher") {
                min = randomGuess + 1;
            } else if (data.info === "Lower") {
                max = randomGuess - 1;
            }
        } catch (error) {
            console.error("Error fetching API:", error);
            return;
        }
    }
        
    // 2. 이진 탐색으로 정답 찾기
    while(min <= max) {
        const mid = Math.floor((min + max) / 2);
        attempts++;

        console.log(`Attempt #${attempts}: Guessing ${mid}`);
                    
        let guess = document.getElementById("guess");
        guess.value = mid;
        document.getElementById('go').click();
        const param = new URLSearchParams({
            passwd: _passwd,
            studentId: _studentId,
            num: mid
        });

        try {
            const response = await fetch(`${base_url}/find_hl?${param}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': 'DtqBzT4O'
                    }
            });

            const data = await response.json();
            console.log(data);

            if (data.info === "Correct") {
                console.log(`Correct! The number is ${mid}`);
                console.log(`Total attempts: ${attempts}`);
                break;
            } else if (data.info === "Higher") {
                min = mid + 1;
            } else if (data.info === "Lower") {
                max = mid - 1;
            }
        } catch (error) {
            console.error("Error fetching API:", error);
            break;
        }
    }
}
async function findNumberFast(gameNumber) {
    const binaryStartTime12 = new Date().getTime(); // 전체 탐색 시작 시간
    console.log(`Binary search started at: ${new Date(binaryStartTime12).toISOString()}`);

    let min = 1;
    let max = 9999;

    const _passwd = document.querySelector('.passwd').value;
    const _studentId = document.querySelector('.studentId').value;

    console.log('Starting number search...');
    console.log(`Initial range: min = ${min}, max = ${max}`);

    // 1. 초기 난수 생성 (5000 이하를 3구간으로 나눔)
    const lowerBound = Math.floor(5000 / 3); // 첫 구간 상한선
    const middleBound = Math.floor(5000 * 2 / 3); // 두 번째 구간 상한선
    const sampleCountPerSegment = 3; // 각 구간에서 생성할 난수 개수
    const guesses = [];

    // 첫 구간 난수 생성
    for (let i = 0; i < sampleCountPerSegment; i++) {
        guesses.push(Math.floor(Math.random() * lowerBound) + min);
    }

    // 두 번째 구간 난수 생성
    for (let i = 0; i < sampleCountPerSegment; i++) {
        guesses.push(Math.floor(Math.random() * (middleBound - lowerBound)) + lowerBound + 1);
    }

    // 세 번째 구간 난수 생성
    for (let i = 0; i < sampleCountPerSegment; i++) {
        guesses.push(Math.floor(Math.random() * (5000 - middleBound)) + middleBound + 1);
    }

    console.log(`Generated initial guesses: ${guesses}`);

    // 2. 난수 순차 처리
    for (let i = 0; i < guesses.length; i++) {
        const guess = guesses[i];
        const result = await sendGuess(guess, _passwd, _studentId); // 순차 처리

        console.log(`Sampling #${i + 1}: Guess = ${guess}, Result = ${result}`);

        if (result === "정답입니다.") {
            console.log(`Correct! The number is ${guess}`);
            findnum.value = guess;
            document.getElementById('go').click();
            updateResultsTable(gameNumber, (new Date().getTime() - binaryStartTime12) / 1000, guess);
            return;
        } else if (result === "정답보다 작습니다.") {
            min = Math.max(min, guess + 1); // 최소값 갱신
        } else if (result === "정답보다 큽니다.") {
            max = Math.min(max, guess - 1); // 최대값 갱신
        }
    }

    console.log(`After sampling: min = ${min}, max = ${max}`);

    // 3. 이진탐색 단계
    const binaryStartTime = new Date().getTime();
    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        console.log(`Guessing mid = ${mid}`);
        const result = await sendGuess(mid, _passwd, _studentId); // 순차 처리

        if (result === "정답입니다.") {
            console.log(`Correct! The number is ${mid}`);
            findnum.value = mid;
            document.getElementById('go').click();
            const binaryEndTime12 = new Date().getTime(); // 총 탐색 끝 시간
            console.log(`총 Binary search duration: ${(binaryEndTime12 - binaryStartTime12) / 1000} seconds`);
            updateResultsTable(gameNumber, (binaryEndTime12 - binaryStartTime12) / 1000, findnum.value);
            return;
        } else if (result === "정답보다 작습니다.") {
            min = mid + 1; // 범위 축소
        } else if (result === "정답보다 큽니다.") {
            max = mid - 1; // 범위 축소
        }
    }
}
