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