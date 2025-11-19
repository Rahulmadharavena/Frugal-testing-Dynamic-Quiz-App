// app.js - frontend behavior for PHP-based quiz
const landing=document.getElementById('landing'), quiz=document.getElementById('quiz'), result=document.getElementById('result');
const startBtn=document.getElementById('start-quiz-btn'), prevBtn=document.getElementById('prev-btn'), nextBtn=document.getElementById('next-btn');
const submitBtn=document.getElementById('submit-quiz-btn'), restartBtn=document.getElementById('restart-btn');
const questionText=document.getElementById('question-text'), optionsDiv=document.getElementById('options');
const timeLeftSpan=document.getElementById('time-left'), currentSpan=document.getElementById('current'), totalSpan=document.getElementById('total');
const scoreSummary=document.getElementById('score-summary'), detailedDiv=document.getElementById('detailed');

let allQuestions = window.QUIZ_DATA || [];
let questions = [], current = 0, answers = [], times = [], perStart = null, timerInterval = null, perQuestionLimit = 15;

function filterQuestions(category, difficulty, count){
  let filtered = allQuestions.filter(q=>{
    if(category && category!=='all' && q.category!==category) return false;
    if(difficulty && difficulty!=='all' && q.difficulty!==difficulty) return false;
    return true;
  });
  // shuffle
  for(let i=filtered.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[filtered[i],filtered[j]]=[filtered[j],filtered[i]];}
  return filtered.slice(0, Math.min(count, filtered.length));
}

function showLanding(){ landing.classList.remove('hidden'); quiz.classList.add('hidden'); result.classList.add('hidden'); }

function startQuiz(){
  const cat=document.getElementById('category').value;
  const diff=document.getElementById('difficulty').value;
  const qCount=parseInt(document.getElementById('q-count').value)||5;
  perQuestionLimit = parseInt(document.getElementById('time-limit').value) || 15;
  questions = filterQuestions(cat,diff,qCount);
  if(questions.length===0){ alert('No questions available for the selected filters.'); return; }
  answers = Array(questions.length).fill(null);
  times = Array(questions.length).fill(0);
  current = 0;
  totalSpan.textContent = questions.length;
  landing.classList.add('hidden'); result.classList.add('hidden'); quiz.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion(){
  clearInterval(timerInterval);
  currentSpan.textContent = current+1;
  questionText.textContent = questions[current].question;
  optionsDiv.innerHTML = '';
  questions[current].options.forEach((opt,i)=>{
    const b = document.createElement('button');
    b.className='option-btn';
    b.id = 'opt-'+i;
    b.textContent = opt;
    b.addEventListener('click', ()=>selectOption(i));
    if(answers[current]===i) b.classList.add('selected');
    optionsDiv.appendChild(b);
  });
  perStart = Date.now();
  startTimer(perQuestionLimit);
}

function selectOption(i){
  answers[current] = i;
  document.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('selected'));
  document.getElementById('opt-'+i).classList.add('selected');
}

function startTimer(limit){
  let remaining = limit;
  timeLeftSpan.textContent = remaining;
  timerInterval = setInterval(()=>{
    remaining--;
    timeLeftSpan.textContent = remaining;
    if(remaining <= 0){
      const elapsed = Math.round((Date.now()-perStart)/1000);
      times[current] += Math.min(elapsed, limit);
      nextQuestion();
    }
  },1000);
}

function nextQuestion(){
  clearInterval(timerInterval);
  if(current < questions.length - 1){
    current++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}
function prevQuestion(){
  clearInterval(timerInterval);
  const elapsed = Math.round((Date.now()-perStart)/1000);
  times[current] += elapsed;
  if(current > 0){
    current--;
    renderQuestion();
  }
}
function finishQuiz(){
  clearInterval(timerInterval);
  if(perStart){
    const elapsed = Math.round((Date.now() - perStart) / 1000);
    times[current] += elapsed;
  }
  quiz.classList.add('hidden');
  renderResult();
  result.classList.remove('hidden');
}
function renderResult(){
  const total = questions.length;
  let correct = 0;
  let details = [];
  for(let i=0;i<total;i++){
    const q = questions[i];
    const user = answers[i];
    const isCorrect = user === q.answer;
    if(isCorrect) correct++;
    details.push({index:i+1, question:q.question, selected: user===null ? 'No Answer' : q.options[user], correct: q.options[q.answer], time: times[i], isCorrect});
  }
  const incorrect = total - correct;
  const percent = Math.round((correct/total)*100);
  scoreSummary.textContent = `Score: ${correct}/${total} (${percent}%).`;
  // pie chart
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  new Chart(pieCtx, {type:'pie', data:{labels:['Correct','Incorrect'], datasets:[{data:[correct,incorrect]}]}});
  // bar chart
  const barCtx = document.getElementById('barChart').getContext('2d');
  new Chart(barCtx, {type:'bar', data:{labels:details.map(d=>'Q'+d.index), datasets:[{label:'Seconds', data:details.map(d=>d.time)}]}, options:{scales:{y:{beginAtZero:true}}}});
  // detailed table
  detailedDiv.innerHTML = '<h3>Per-question details</h3>';
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(details, null, 2);
  detailedDiv.appendChild(pre);
}

startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', finishQuiz);
restartBtn.addEventListener('click', showLanding);

// expose for automation and debugging
window._QUIZ = {questions, answers, times};
