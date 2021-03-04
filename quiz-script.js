const startButton = document.getElementById('play');
const nextButton = document.getElementById('next-btn')
const restartButton = document.getElementById('restart-btn')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer')
const startElement = document.getElementById('start-page')
const gameElement = document.getElementById('play-game')
const endElement = document.getElementById('game-end')
const winnings = document.getElementById('winning-section')
const child = document.getElementById('show-winnings')
const alert = document.getElementById('alert')
const fiftyButton = document.getElementById('fifty')
const phoneButton = document.getElementById('phone')
const audienceButton = document.getElementById('audience')
const audienceVoters = document.getElementById('audience-vote')
const gameSound = document.getElementById('play-sound')
const endSound = document.getElementById('end-sound')
const audienceSound = document.getElementById('audience-sound')
const phoneSound = document.getElementById('phone-sound')
const fiftySound = document.getElementById('fifty-sound')
const correctAnswerSound = document.getElementById('correct-sound')
const failedSound = document.getElementById('failed-sound')

let shuffledQuestions, currentQuestionIndex, currentWinningIndex
let winningMessage
let score = 0;

startButton.addEventListener('click', startGame)

function startGame(){
    endSound.pause(); audienceSound.pause(); phoneSound.pause(); fiftySound.pause(); correctAnswerSound.pause(); failedSound.pause()
    gameSound.play()
    for(let i=0; i<15; i++){    /*Remove any classlist indicating colors on the winnings*/
        winnings.children[i].classList.remove('correctly')
        winnings.children[i].classList.remove('wrongly')
    } 
    startElement.classList.add('hide')
    gameElement.classList.remove('hide')
    endElement.classList.add('hide')
    generateQuestion()
}

function generateQuestion(){
    nextButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.floor(Math.random()-0.5)) /*using Array.sort to generate a sorted array each time*/
    currentQuestionIndex = 0
    currentWinningIndex = 14
    showQuestion(shuffledQuestions[currentQuestionIndex])
    
}

function showQuestion(question){
    questionElement.innerHTML= question.question;
    question.answers.forEach(answer => {
        const newButton = document.createElement('button') /*create a new button elements for the answers*/
        newButton.classList.add('btn')
        newButton.innerHTML = answer.text
        if(answer.correct){
            newButton.dataset.correct = answer.correct /*check if the answer is right or wrong */
        }
        answerButtonsElement.appendChild(newButton)
        newButton.addEventListener('click', checkAnswer)
    })
}

function checkAnswer(ans){
    const selectedButton = ans.target;
    const answer = selectedButton.dataset.correct /*Chechinkg if the answer is right or wrong using data attributes*/
    
    const totalWinnings = document.createElement('div') /*create a new elements to represent total winnings for the answers*/
    
    if (answer && score <16 && shuffledQuestions.length > currentQuestionIndex + 1){/*Chech if the answer is correct or wrong and if there are still questions unanswered*/
        gameSound.pause(); endSound.pause(); audienceSound.pause(); phoneSound.pause(); fiftySound.pause(); failedSound.pause()
        correctAnswerSound.play()
        selectedButton.classList.add('correct')
        winnings.children[currentWinningIndex].classList.add('correctly')
        score++
        setTimeout(nextquestion, 6000)
    } else if (!answer) {
        gameSound.pause(); endSound.pause(); audienceSound.pause(); phoneSound.pause(); fiftySound.pause(); correctAnswerSound.pause();
        failedSound.play()
        selectedButton.classList.add('wrong')
        winnings.children[currentWinningIndex].classList.add('wrongly')
        //Looping through the answers button

        Array.from(answerButtonsElement.children).forEach(button =>{
            setStatusClass(button, button.dataset.correct)
        })
        /*Create a winning Message at the end of the game with the amount won*/
    
        if(score<5){
            winningMessage = document.createTextNode(`So poor! You are going home with $0. Absolutely Nothing!! Try again next time`)
        } else if (score<10){
            winningMessage = document.createTextNode(`You did well! You are walking home with $1,000`)
        } else if (score <14){
            winningMessage = document.createTextNode(`Fantastic!! You are taking home $32000. Enjoy!!!`)
        }
        else {
            winningMessage = document.createTextNode('')
        }
        totalWinnings.appendChild(winningMessage)
        endElement.insertBefore(totalWinnings, child) 
        setTimeout(gameOver, 6000)
    }
    else {
        selectedButton.classList.add('correct')
        winnings.children[currentWinningIndex].classList.add('correctly')
        setTimeout(gameOver, 6000)
    }
    if (score === 15) {
        winningMessage = document.createTextNode(`Congratulations, You got all questions Correctly! You are going home with a Whooping $1 Million`)
        totalWinnings.appendChild(winningMessage)
        endElement.insertBefore(totalWinnings, child) 
        setTimeout(gameOver, 6000)
    } 
}

function setStatusClass(element, correct){
    // clearStatusClass(element)
    if(correct){
        element.classList.add('correct')
    } 
}


function nextquestion(){
    currentQuestionIndex++
    currentWinningIndex--
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
}

function resetState(){
    while(answerButtonsElement.firstChild){ /*Remove previous answers*/
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
    alert.classList.remove('show')
    audienceVoters.classList.remove('show')
}

function gameOver(){
    gameSound.pause(); audienceSound.pause(); phoneSound.pause(); fiftySound.pause(); correctAnswerSound.pause(); failedSound.pause()
    endSound.play()
    gameElement.classList.add('hide')
    endElement.classList.remove('hide')
}



restartButton.addEventListener('click', restartGame)

function restartGame(){
    score = 0
    winningMessage.remove()  /*Remove the winning message everytime restart button is clicked so a new one can be printed at the end of the game*/
    resetState()
    fiftyButton.addEventListener('click', fiftyFifty, {once: true}) /*So your fiftyFity lifeline can be active again*/
    phoneButton.addEventListener('click', callFriend, {once: true} )
    audienceButton.addEventListener('click', askAudience, {once: true})
    startGame()
}

function checkWinnings(){
    for (let i=winnings.children.length-1; i>=0; i--){
        winnings.children[i].classList.add('correct')
    }
}

//LifeLines

fiftyButton.addEventListener('click', fiftyFifty, {once: true})
phoneButton.addEventListener('click', callFriend, {once: true} )
audienceButton.addEventListener('click', askAudience, {once: true})

function fiftyFifty() {
    gameSound.pause(); endSound.pause(); audienceSound.pause(); phoneSound.pause(); correctAnswerSound.pause(); failedSound.pause()
    fiftySound.play()
    let rand = Math.floor(Math.random()*3)
    let newArr = [] //Create a new array to push 2 wrongs options into
    audienceVoters.classList.remove('show')
    alert.classList.remove('show')
    for (let i=0; i<2; i++){
        for (let j=0; j<4; j++){
            if(!answerButtonsElement.children[j].dataset.correct && newArr.length<2){
                newArr.push(answerButtonsElement.children[j]) 
            }
        }
    }
    for (let i=0; i<newArr.length; i++){
        newArr[i].classList.add('nothing')   
    }
}

function callFriend(){
    gameSound.pause(); endSound.pause(); audienceSound.pause(); fiftySound.pause(); correctAnswerSound.pause(); failedSound.pause()
    phoneSound.play()
    audienceVoters.classList.remove('show')
    alert.classList.add('show')
    for (let i=0; i<4; i++){
        if(answerButtonsElement.children[i].dataset.correct){
            answer = answerButtonsElement.children[i].innerText
            //create an array of possible answer and generate a random one
            friendsAnswer = [`Did you bother reading the question? \n This is just so easy I can't believe you called me for this.\n The answer is definitely ${answer}`,
                             `I'm not so sure but I think the answer is ${answer}`,
                             `You called me for this? The answer is ${answer}`,
                             `Sorry Pal but I'm lost here, I have no idea. Goodluck!`,
                             `I'm 60% sure the answer is ${answer}`   
                            ]
            alert.innerHTML =  friendsAnswer[Math.floor(Math.random()*friendsAnswer.length)]
        }
    }  
}

function askAudience(){
    gameSound.pause(); endSound.pause(); phoneSound.pause(); fiftySound.pause(); correctAnswerSound.pause(); failedSound.pause()
    audienceSound.play()
    alert.classList.remove('show')
    audienceVoters.classList.add('show')
    let A = document.getElementById('a')
    let B = document.getElementById('b')
    let C = document.getElementById('c')
    let D = document.getElementById('d')
    let correctHeight = ['150px', '120px', '165px', '110px', '145px'] //Create an array of height so you can have a random value
    let wrongHeight = ['30px', '20px', '90px', '45px', '80px', '25px', '40px', '100px', '85px', '55px', '43px']

    if (answerButtonsElement.children[0].dataset.correct){
        A.style.height = correctHeight[Math.floor(Math.random()*correctHeight.length)]
        B.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        C.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        D.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
    }
    else if (answerButtonsElement.children[1].dataset.correct){
        A.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        B.style.height = correctHeight[Math.floor(Math.random()*correctHeight.length)]
        C.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        D.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
    }
    else if (answerButtonsElement.children[2].dataset.correct){
        A.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        B.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        C.style.height = correctHeight[Math.floor(Math.random()*correctHeight.length)]
        D.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
    }
    else if (answerButtonsElement.children[3].dataset.correct){
        A.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        B.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        C.style.height = wrongHeight[Math.floor(Math.random()*wrongHeight.length)]
        D.style.height = correctHeight[Math.floor(Math.random()*correctHeight.length)]
    }
}
 
const questions = [
    {
        question: 'How many ethnic groups do we have in Nigeria?',
        answers:[
            {text: 'A.  400', correct: false},
            {text: 'B.  250', correct: true},
            {text: 'C.  79', correct: false},
            {text: 'D.  120', correct: false}
        ]
    },
    {
        question: 'Who is the current chief of justices of Nigeria?',
        answers:[
            {text: 'A.  Aliko Dangote', correct: false},
            {text: 'B.  Babagana Kingigbe', correct: false},
            {text: 'C. Tanko Mohammed', correct: true},
            {text: 'D. Jojo Armani', correct: false}
        ]
    },
    {
        question: 'In Nigeria, democracy day is now celebrated on?',
        answers:[
            {text: 'A.  Feb 14', correct: false},
            {text: 'B.  Aug 29', correct: false},
            {text: 'C.  Sep 9', correct: false},
            {text: 'D.  June 12', correct: true}
        ]
    },
    {
        question: 'Which is the most populated country in the world?',
        answers:[
            {text: 'A.  USA', correct: false},
            {text: 'B.  China', correct: true},
            {text: 'C.  Nigeria', correct: false},
            {text: 'D.  Chile', correct: false}
        ]
    },
    {
        question: 'Which is the second largest continent in the world?',
        answers:[
            {text: 'A.  Asia', correct: false},
            {text: 'B.  Antartica', correct: false},
            {text: 'C.  Africa', correct: true},
            {text: 'D.  Europe', correct: false}
        ]
    },
    {
        question: 'Who was the first Nigerian female psychiatrist?',
        answers:[
            {text: 'A.  Dr. Flora Kuti', correct: false},
            {text: 'B.  Dr. Gabriella Eros', correct: false},
            {text: 'C.  Dr. Mercy Chinwe', correct: false},
            {text: 'D.  Dr. Bertha Johnson', correct: true}
        ]
    },

    {
        question: 'The hottest region in the world is called?',
        answers:[
            {text: 'A.  Grand Cayon', correct: false},
            {text: 'B.  Sahara Desert', correct: true},
            {text: 'C.  Mount Everest', correct: false},
            {text: 'D.  Ekosodin', correct: false}
        ]
    },
    {
        question: 'Which African country first gained independence?',
        answers:[
            {text: 'A.  Nigeria', correct: false},
            {text: 'B.  Ghana', correct: false},
            {text: 'C. Liberia', correct: true},
            {text: 'D. Botswana', correct: false}
        ]
    },
    {
        question: 'Who is Nigeria’s current speaker of House of Representatives?',
        answers:[
            {text: 'A.  Jojo Armani', correct: false},
            {text: 'B.  David Mark', correct: false},
            {text: 'C.  Ishiaka Benson', correct: false},
            {text: 'D.  Femi Gbajabiamila', correct: true}
        ]
    },
    {
        question: 'Who was the first writer of English Dictionary in the world?',
        answers:[
            {text: 'A.  Mr. Oxford Kent', correct: false},
            {text: 'B.  Mr. Samuel Johnson', correct: true},
            {text: 'C.  Mr. George Ofogba', correct: false},
            {text: 'D.  Mr. Brown Davies', correct: false}
        ]
    },
    {
        question: 'Who was the first President of Nigeria?',
        answers:[
            {text: 'A.  Muhhamadu Buhari', correct: false},
            {text: 'B.  Olusegun Obasanjo', correct: false},
            {text: 'C.  Nnamdi Azikiwe', correct: true},
            {text: 'D.  Christian Aifuwa', correct: false}
        ]
    },
    {
        question: 'Blue in the Nigerian Police flag represents?',
        answers:[
            {text: 'A.  Bail is not free', correct: false},
            {text: 'B.  Unity & Faith, Peace & Progress', correct: false},
            {text: 'C.  Oga drop something for fuel', correct: false},
            {text: 'D.  Love, loyalty and unity', correct: true}
        ]
    },


    {
        question: 'The first awarded Archbishop in Africa?',
        answers:[
            {text: 'A.  Pope John Paul II', correct: false},
            {text: 'B.  Benson Andrew Idahosa', correct: true},
            {text: 'C.  Andrew Jefferson', correct: false},
            {text: 'D.  Claudia Bright', correct: false}
        ]
    },
    {
        question: 'The separation of powers is simply meant for?',
        answers:[
            {text: 'A.  Checks and Balances', correct: true},
            {text: 'B.  Peace and Progress', correct: false},
            {text: 'C.  Sharing the loot', correct: false},
            {text: 'D.  Dictatorship', correct: false}
        ]
    },
    {
        question: 'What is a 70 years anniversary called?',
        answers:[
            {text: 'A.  Golden Jubillee', correct: false},
            {text: 'B.  Silver Jubillee', correct: false},
            {text: 'C.  Plastic Jubillee', correct: false},
            {text: 'D.  Platinum Jubillee', correct: true}
        ]
    },
    {
        question: 'What does the acronym ICAO stand for?',
        answers:[
            {text: 'A.  Ican Assitance Organisation', correct: false},
            {text: 'B.  International Civil Aviation Organisation', correct: true},
            {text: 'C.  International Civil Ammenesty Organisation', correct: false},
            {text: 'D.  Independent Certified Architect Organisation', correct: false}
        ]
    },
    
    {
        question: 'Who was the first Nigerian female psychiatrist?',
        answers:[
            {text: 'A.  Mr. C. W. Duncan', correct: true},
            {text: 'B.  Mr. Bala Mohammed', correct: false},
            {text: 'C.  Mr Jimoh Ibrahim', correct: false},
            {text: 'D.  Mr. Calabar Johnson', correct: false}
        ]
    },

    {
        question: 'Who is the current Sultan of Sokoto caliphate?',
        answers:[
            {text: 'A.  Sanusi Lamido', correct: false},
            {text: 'B.  Muhammadu Salad Abubakar', correct: true},
            {text: 'C.  Ibrahim Abubakar', correct: false},
            {text: 'D.  Nuhu Ribadu', correct: false}
        ]
    },
    {
        question: 'Who is the current Governor of Central Bank of Nigeria?',
        answers:[
            {text: 'A.  Mughalo Akinyemi', correct: false},
            {text: 'B.  Ngozi Ewela', correct: false},
            {text: 'C.  Godwin Emefiele', correct: true},
            {text: 'D.  Sanusi Lamido', correct: false}
        ]
    },
    {
        question: 'What does the acronym ECOMOG means?',
        answers:[
            {text: 'A.  Economic Community Monitoring Group', correct: true},
            {text: 'B.  Eastern Coast Money Gurus', correct: false},
            {text: 'C.  Economic Community of Men Of God', correct: false},
            {text: 'D.  Eastern Continuity Ministry of Granite', correct: false}
        ]
    },
    {
        question: 'Which is the highest mountain in Africa?',
        answers:[
            {text: 'A.  Mount Everest', correct: false},
            {text: 'B.  Mount Kilimanjaro', correct: true},
            {text: 'C.  Mount Sinai', correct: false},
            {text: 'D.  Mount Olympus', correct: false}
        ]
    },
    {
        question: 'When did Nigeria break diplomatic relations with Israel?',
        answers:[
            {text: 'A.  1916', correct: false},
            {text: 'B.  2001', correct: false},
            {text: 'C.  1972', correct: true},
            {text: 'D.  1990', correct: false}
        ]
    },
    {
        question: 'What country does Nigeria share borders within the West?',
        answers:[
            {text: 'A.  Libya', correct: false},
            {text: 'B.  Isihor', correct: false},
            {text: 'C.  Ghana', correct: false},
            {text: 'D.  Benin Republic', correct: true}
        ]
    },
    {
        question: 'Which continent is the smallest in the world?',
        answers:[
            {text: 'A.  Madagascar', correct: false},
            {text: 'B.  Australia', correct: true},
            {text: 'C.  Venezuala', correct: false},
            {text: 'D.  Brazil', correct: false}
        ]
    },
    {
        question: 'What agency is the Economic Commission for Africa part of?',
        answers:[
            {text: 'A.  JUPEB', correct: false},
            {text: 'B.  G20', correct: false},
            {text: 'C. UN', correct: true},
            {text: 'D. ISIS', correct: false}
        ]
    },
    {
        question: 'What region was created by the facilitation of the NCNC?',
        answers:[
            {text: 'A.  South-West Region', correct: false},
            {text: 'B.  North-East Region', correct: false},
            {text: 'C.  South-South Region', correct: false},
            {text: 'D.  Mid-West Region', correct: true}
        ]
    },
    {
        question: 'For what reason was Nigeria suspended from the Commonwealth in 1995?',
        answers:[
            {text: 'A.  Political Reasons', correct: true},
            {text: 'B.  War', correct: false},
            {text: 'C.  Lack of Funding', correct: false},
            {text: 'D.  Communism', correct: false}
        ]
    },
    {
        question: 'Who was the first Senate President of Nigeria?',
        answers:[
            {text: 'A.  Olusegun Agagu', correct: false},
            {text: 'B.  David Mark', correct: false},
            {text: 'C.  Dr. Nnamdi Azikiwe', correct: true},
            {text: 'D.  Ibrahim Babangida', correct: false}
        ]
    },
    {
        question: 'Who was the first governor-general of colonial Nigeria?',
        answers:[
            {text: 'A.  Lord Senedote', correct: false},
            {text: 'B.  Lord Thompson', correct: false},
            {text: 'C.  Lord Fedrick', correct: false},
            {text: 'D.  Lord Lugard', correct: true}
        ]
    },

    {
        question: 'People who live by selling labour in the Marxist theory are called?',
        answers:[
            {text: 'A.  Marxist', correct: false},
            {text: 'B.  Proletariats', correct: true},
            {text: 'C.  Faccists', correct: false},
            {text: 'D.  Communist', correct: false}
        ]
    },
    {
        question: 'Who formed the first political party in Nigeria?',
        answers:[
            {text: 'A.  Nnamdi Azikiwe', correct: false},
            {text: 'B.  Ajayi Crowther', correct: false},
            {text: 'C.  Herbert Macaulay', correct: true},
            {text: 'D.  Eze Bulubulu', correct: false}
        ]
    },
    {
        question: 'When did the Duke and Duchess of Sussex leave the royal family?',
        answers:[
            {text: 'A.  March 1981', correct: false},
            {text: 'B.  June 1992', correct: false},
            {text: 'C.  August 2000', correct: false},
            {text: 'D.  January 2020', correct: true}
        ]
    },
    {
        question: 'When was paper currency introduced in Nigeria?',
        answers:[
            {text: 'A.  1960', correct: false},
            {text: 'B.  1918', correct: true},
            {text: 'C.  1971', correct: false},
            {text: 'D.  1890', correct: false}
        ]
    },
    {
        question: 'How many Local Government Areas are in Nigeria?',
        answers:[
            {text: 'A.  419', correct: false},
            {text: 'B.  1,182', correct: false},
            {text: 'C.  774', correct: true},
            {text: 'D.  640', correct: false}
        ]
    },
    {
        question: 'Which state in Nigeria has the largest number of Local Government Areas?',
        answers:[
            {text: 'A.  Delta', correct: false},
            {text: 'B.  Kogi', correct: false},
            {text: 'C.  Kastina', correct: false},
            {text: 'D.  Kano', correct: true}
        ]
    },


    {
        question: 'TWhat does the term MDG stands for?',
        answers:[
            {text: 'A.  Managing Director General', correct: false},
            {text: 'B.  Millennium Development Goals', correct: true},
            {text: 'C.  Most Decorated Girl', correct: false},
            {text: 'D.  Make Dodo and Groundnut', correct: false}
        ]
    },
    {
        question: 'When did the Federal Military Government abolish the four regions?',
        answers:[
            {text: 'A.  1966', correct: true},
            {text: 'B.  2015', correct: false},
            {text: 'C.  1991', correct: false},
            {text: 'D.  1979', correct: false}
        ]
    },
    {
        question: 'How many countries constitute the Economic Community of West African States?',
        answers:[
            {text: 'A.  24', correct: false},
            {text: 'B.  8', correct: false},
            {text: 'C.  90', correct: false},
            {text: 'D.  16', correct: true}
        ]
    },
    {
        question: 'Which country was the last to win independence from colonial rule?',
        answers:[
            {text: 'A.  Burundi', correct: false},
            {text: 'B.  Angola', correct: true},
            {text: 'C.  Cameroun', correct: false},
            {text: 'D.  India', correct: false}
        ]
    },
    
    {
        question: 'A country made up of semi-autonomous units is called.',
        answers:[
            {text: 'A.  Confederation', correct: true},
            {text: 'B.  Republic', correct: false},
            {text: 'C.  Communist', correct: false},
            {text: 'D.  Banana Republic', correct: false}
        ]
    },

    {
        question: 'What system of Government is political power inherited?',
        answers:[
            {text: 'A.  Faccism', correct: false},
            {text: 'B.  Monarchy', correct: true},
            {text: 'C.  Democracy', correct: false},
            {text: 'D.  Communism', correct: false}
        ]
    },
    {
        question: 'How many states were created by General Yakubu Gowon in Nigeria, May 1967?',
        answers:[
            {text: 'A.  24', correct: false},
            {text: 'B.  19', correct: false},
            {text: 'C.  12', correct: true},
            {text: 'D.  14', correct: false}
        ]
    },
    {
        question: 'Who was the first Executive President of Nigeria?',
        answers:[
            {text: 'A.  Alhaji Shehu Shagari', correct: true},
            {text: 'B.  Dr Nnamdi Azikiwe', correct: false},
            {text: 'C.  Olusegun Obasanjo', correct: false},
            {text: 'D.  Okotie Eboh', correct: false}
        ]
    },
    {
        question: 'When was facebook founded?',
        answers:[
            {text: 'A.  2001', correct: false},
            {text: 'B.  2004', correct: true},
            {text: 'C.  2009', correct: false},
            {text: 'D.  1998', correct: false}
        ]
    },
    {
        question: 'How many regional divisions does Africa have?',
        answers:[
            {text: 'A.  18', correct: false},
            {text: 'B.  9', correct: false},
            {text: 'C.  6', correct: true},
            {text: 'D.  12', correct: false}
        ]
    },
    {
        question: 'Who was the longest serving senate President of Nigeria?',
        answers:[
            {text: 'A.  Rochas Okorocha', correct: false},
            {text: 'B.  James Manager', correct: false},
            {text: 'C.  Folorunsho Adebayo', correct: false},
            {text: 'D.  David Mark', correct: true}
        ]
    },
    {
        question: 'Who is the current Prime Minister of the United Kingdom?',
        answers:[
            {text: 'A.  John Shaw', correct: false},
            {text: 'B.  Boris Johnson', correct: true},
            {text: 'C.  Theodore Bondi', correct: false},
            {text: 'D.  Theresa May', correct: false}
        ]
    },
    {
        question: 'Who is the current Secretary-General of the United Nations?',
        answers:[
            {text: 'A.  Fred Guzman', correct: false},
            {text: 'B.  Sepp Blatter', correct: false},
            {text: 'C.  Antonio Guterres', correct: true},
            {text: 'D.  Jojo Armani', correct: false}
        ]
    },
    {
        question: 'When was the United Nations Organisation formed?',
        answers:[
            {text: 'A.  1900', correct: false},
            {text: 'B.  1875', correct: false},
            {text: 'C.  1930', correct: false},
            {text: 'D.  1945', correct: true}
        ]
    },
    {
        question: 'The first woman to become a governor in Nigeria is?',
        answers:[
            {text: 'A.  Mrs. Bobrisky', correct: false},
            {text: 'B.  Mrs. Virginia Etiaba', correct: true},
            {text: 'C.  Mrs. Stephanie Obiaju', correct: false},
            {text: 'D.  Mrs. Dora Akunyili', correct: false}
        ]
    },
    {
        question: 'Who is the current INEC Chairman?',
        answers:[
            {text: 'A.  Prof Edekele Michael', correct: false},
            {text: 'B.  Prof Maurice Iwu', correct: false},
            {text: 'C.  Prof. Mahmood Yakubu', correct: true},
            {text: 'D.  Atahiru Jega', correct: false}
        ]
    },
    {
        question: 'Who was the first female Brigadier in Nigeria?',
        answers:[
            {text: 'A.  Catherine Adams', correct: false},
            {text: 'B.  Jennifer Eruns', correct: false},
            {text: 'C.  Vanessa Obiaju', correct: false},
            {text: 'D.  Ronke Kale', correct: true}
        ]
    },

    {
        question: 'Who is the current Chairman of UN?',
        answers:[
            {text: 'A.  Boris Johnson', correct: false},
            {text: 'B.  Bankie Moore', correct: true},
            {text: 'C.  Ngozi Ewela', correct: false},
            {text: 'D.  Michael Biden', correct: false}
        ]
    },
    {
        question: 'Which state has the highest percentage of contribution to oil revenue in Nigeria?',
        answers:[
            {text: 'A.  Edo', correct: false},
            {text: 'B.  Rivers', correct: false},
            {text: 'C.  Delta', correct: true},
            {text: 'D.  Bayelsa', correct: false}
        ]
    },
    {
        question: 'When was the first refinery in Nigeria built?',
        answers:[
            {text: 'A.  1987', correct: false},
            {text: 'B.  1904', correct: false},
            {text: 'C.  1990', correct: false},
            {text: 'D.  1965', correct: true}
        ]
    },
    {
        question: 'When was the Federal Capital Territory created?',
        answers:[
            {text: 'A.  March 1984', correct: false},
            {text: 'B.  Feb 1976', correct: true},
            {text: 'C.  August 1990', correct: false},
            {text: 'D.  Dec 1982', correct: false}
        ]
    },
    {
        question: 'Who was Nigeria’s First Military Head of State?',
        answers:[
            {text: 'A.  General Agunyi Ironsi', correct: false},
            {text: 'B.  General Olusegun Obasanjo', correct: false},
            {text: 'C.  General Yakubu Gowon', correct: true},
            {text: 'D.  General Muhhamadu Buhari', correct: false}
        ]
    },
    {
        question: 'Who was known as the King of Afro beat in Nigeria?',
        answers:[
            {text: 'A.  Femi Anikulapo Kuti', correct: false},
            {text: 'B.  Burna Boy', correct: false},
            {text: 'C.  Davido', correct: false},
            {text: 'D.  Fela Anikulapo Kuti', correct: true}
        ]
    },


    {
        question: 'How was Sir Dele Giwa killed?',
        answers:[
            {text: 'A.  Apple', correct: false},
            {text: 'B.  Letter Bomb', correct: true},
            {text: 'C.  Armed Robbery', correct: false},
            {text: 'D.  Coup', correct: false}
        ]
    },
    {
        question: 'When was the Central Bank of Nigeria established?',
        answers:[
            {text: 'A.  1958', correct: true},
            {text: 'B.  1963', correct: false},
            {text: 'C.  1990', correct: false},
            {text: 'D.  1914', correct: false}
        ]
    },
    {
        question: 'Who was the first Sultan of Sokoto?',
        answers:[
            {text: 'A.  Atiku Abubakar', correct: false},
            {text: 'B.  Mohammed Ibrahim', correct: false},
            {text: 'C.  Sanusi Lamido Sanusi', correct: false},
            {text: 'D.  Shehu Usman Danfodio', correct: true}
        ]
    },
    {
        question: 'When did the first world war take place?',
        answers:[
            {text: 'A.  1945-1950', correct: false},
            {text: 'B.  1914-1919', correct: true},
            {text: 'C.  1932-1940', correct: false},
            {text: 'D.  1960-1963', correct: false}
        ]
    },
    
    {
        question: 'Which is the second most populated country in the world?',
        answers:[
            {text: 'A.  India', correct: true},
            {text: 'B.  United Kingdom', correct: false},
            {text: 'C.  USA', correct: false},
            {text: 'D.  Nigeria', correct: false}
        ]
    },

    {
        question: 'When did the Nigerian civil war begin?',
        answers:[
            {text: 'A.  1972', correct: false},
            {text: 'B.  1967', correct: true},
            {text: 'C.  1963', correct: false},
            {text: 'D.  1965', correct: false}
        ]
    },
    {
        question: 'The award of honour GCFR is meant for?',
        answers:[
            {text: 'A.  Ministers', correct: false},
            {text: 'B.  Lawyers', correct: false},
            {text: 'C.  Head of States', correct: true},
            {text: 'D.  Comedians', correct: false}
        ]
    },
    {
        question: 'What is the motto of the Nigerian Police?',
        answers:[
            {text: 'A.  The police are your friend', correct: true},
            {text: 'B.  Park your car', correct: false},
            {text: 'C.  You go follow us reach station', correct: false},
            {text: 'D.  Wetin you dey use hangouts do', correct: false}
        ]
    },
    {
        question: 'When did the second world war take place?',
        answers:[
            {text: 'A.  1950-1955', correct: false},
            {text: 'B.  1939-1945', correct: true},
            {text: 'C.  1994-1999', correct: false},
            {text: 'D.  1962-1967', correct: false}
        ]
    },
    {
        question: 'What does the red eagle on the Nigerian coat of arms depict?',
        answers:[
            {text: 'A.  Flight', correct: false},
            {text: 'B.  Courage', correct: false},
            {text: 'C.  Strength', correct: true},
            {text: 'D.  Peace', correct: false}
        ]
    },
    {
        question: 'What does the colour yellow in the Nigerian police flag signify?',
        answers:[
            {text: 'A.  Humility', correct: false},
            {text: 'B.  Bucaneers', correct: false},
            {text: 'C.  Gallantness', correct: false},
            {text: 'D.  Discipline and resourcefulness', correct: true}
        ]
    },
    {
        question: 'Who is Nigeria’s current minister of finance?',
        answers:[
            {text: 'A.  Babagana Kingigbe', correct: false},
            {text: 'B.  Zainab Ahmed', correct: true},
            {text: 'C.  Maurice Iwu', correct: false},
            {text: 'D.  Babatunde Fashola', correct: false}
        ]
    },
    {
        question: 'Who was the first secretary general of United Nations Organisations?',
        answers:[
            {text: 'A.  Sepp Morales, Switzerland', correct: false},
            {text: 'B.  Trevor Chandler, USA', correct: false},
            {text: 'C.  Tryg Velie, Norway', correct: true},
            {text: 'D.  Abiss Abbass, Belgium', correct: false}
        ]
    },
    {
        question: 'How many senators make up the national assembly of Nigeria?',
        answers:[
            {text: 'A.  72', correct: false},
            {text: 'B.  84', correct: false},
            {text: 'C.  220', correct: false},
            {text: 'D.  109', correct: true}
        ]
    },
    {
        question: 'How many senatorial districts are the 36 states divided into',
        answers:[
            {text: 'A.  3', correct: true},
            {text: 'B.  5', correct: false},
            {text: 'C.  2', correct: false},
            {text: 'D.  4', correct: false}
        ]
    },
    {
        question: 'How many members does the house of representative of Nigeria have?',
        answers:[
            {text: 'A.  118', correct: false},
            {text: 'B.  222', correct: false},
            {text: 'C.  360', correct: true},
            {text: 'D.  401', correct: false}
        ]
    },
    {
        question: 'Which is the highest mountain in the world?',
        answers:[
            {text: 'A.  Mount Sinai', correct: false},
            {text: 'B.  Mount Olympus', correct: false},
            {text: 'C.  Mount Kilimanjaro', correct: false},
            {text: 'D.  Mount Everest', correct: true}
        ]
    },

    {
        question: 'Who were the first Europeans to come to West Africa?',
        answers:[
            {text: 'A.  Frenchs', correct: false},
            {text: 'B.  Portuguese', correct: true},
            {text: 'C.  Germans', correct: false},
            {text: 'D.  British', correct: false}
        ]
    },
    {
        question: 'Who was the first president of the United States of America?',
        answers:[
            {text: 'A.  George W Bush', correct: false},
            {text: 'B.  Abraham Lincoln', correct: false},
            {text: 'C.  George Washington', correct: true},
            {text: 'D.  John F. Kennedy', correct: false}
        ]
    },
    {
        question: 'Where is the Kainji Dam in Nigeria located?',
        answers:[
            {text: 'A.  Kano State', correct: false},
            {text: 'B.  Cross Rivers State', correct: false},
            {text: 'C.  Kogi State', correct: false},
            {text: 'D.  Niger State', correct: true}
        ]
    },
    {
        question: 'Who invented the light bulb?',
        answers:[
            {text: 'A.  Lightongate Peter', correct: false},
            {text: 'B.  Thomas Edison', correct: true},
            {text: 'C.  Albert Eistien', correct: false},
            {text: 'D.  Chales Darwin', correct: false}
        ]
    },
    {
        question: 'What discovery are the Lander brothers known for?',
        answers:[
            {text: 'A.  Notebook', correct: false},
            {text: 'B.  Locomotive Train', correct: false},
            {text: 'C.  Source of River Niger', correct: true},
            {text: 'D.  Planet Pluto', correct: false}
        ]
    },
    {
        question: 'Who discovered the African continent?',
        answers:[
            {text: 'A.  Mary scellesor', correct: false},
            {text: 'B.  Jojo Armani Sr', correct: false},
            {text: 'C.  Mongo Park', correct: false},
            {text: 'D.  Prince Henry', correct: true}
        ]
    },


    {
        question: 'Who invented the motor car?',
        answers:[
            {text: 'A.  Edison Hummer, 1890', correct: false},
            {text: 'B.  Karl Benz, 1885', correct: true},
            {text: 'C.  Limo Curry, 1990', correct: false},
            {text: 'D.  Volks Wagen, 1995', correct: false}
        ]
    },
    {
        question: 'What is the coldest planet in the Solar system?',
        answers:[
            {text: 'A.  Neptune', correct: true},
            {text: 'B.  Jupiter', correct: false},
            {text: 'C.  Uranus', correct: false},
            {text: 'D.  Jupiter', correct: false}
        ]
    },
    {
        question: 'What is the hottest planet in the solar system?',
        answers:[
            {text: 'A.  Earth', correct: false},
            {text: 'B.  Mars', correct: false},
            {text: 'C.  Pluto', correct: false},
            {text: 'D.  Venus', correct: true}
        ]
    },
    {
        question: 'Which is the oldest degree awarding university in Nigeria?',
        answers:[
            {text: 'A.  University of Lagos', correct: false},
            {text: 'B.  University of Ibadan', correct: true},
            {text: 'C.  University of Benin', correct: false},
            {text: 'D.  Ahmadu Bello University', correct: false}
        ]
    },
    
    {
        question: 'Who was the first female Professor in Nigeria?',
        answers:[
            {text: 'A.  Elfrida Adeho', correct: true},
            {text: 'B.  Mary Ovie', correct: false},
            {text: 'C.  Sarah Powel', correct: false},
            {text: 'D.  Sandra Okorie', correct: false}
        ]
    },

    {
        question: 'When was GSM introduced in Nigeria?',
        answers:[
            {text: 'A.  1995', correct: false},
            {text: 'B.  2001', correct: true},
            {text: 'C.  2003', correct: false},
            {text: 'D.  1999', correct: false}
        ]
    },
    {
        question: 'How long does it take the Mars to complete one revolution?',
        answers:[
            {text: 'A.  365', correct: false},
            {text: 'B.  900', correct: false},
            {text: 'C.  687', correct: true},
            {text: 'D.  420', correct: false}
        ]
    },
    {
        question: 'When was google founded?',
        answers:[
            {text: 'A.  1998', correct: true},
            {text: 'B.  1997', correct: false},
            {text: 'C.  1999', correct: false},
            {text: 'D.  1996', correct: false}
        ]
    },
    {
        question: 'When was the first modern Olympics held?',
        answers:[
            {text: 'A.  1614, Benin Kingdom', correct: false},
            {text: 'B.  1896, Greece', correct: true},
            {text: 'C.  1900, Italy', correct: false},
            {text: 'D.  1818, Egypt', correct: false}
        ]
    },
    {
        question: 'How many countries are in Europe?',
        answers:[
            {text: 'A.  18', correct: false},
            {text: 'B.  91', correct: false},
            {text: 'C.  44', correct: true},
            {text: 'D.  32', correct: false}
        ]
    },
    {
        question: 'A system in which no single person serves as the chief executive is known as',
        answers:[
            {text: 'A.  Democracy', correct: false},
            {text: 'B.  Communism', correct: false},
            {text: 'C.  Democracy', correct: false},
            {text: 'D.  Palamentarian', correct: true}
        ]
    }
]