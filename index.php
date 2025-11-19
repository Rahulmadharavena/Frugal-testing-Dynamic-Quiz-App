<?php
// index.php - Serves the quiz frontend. Questions are embedded via PHP array (no DB).
$questions = [
    ['id'=>1,'category'=>'general','difficulty'=>'easy','question'=>'Which language runs in a web browser?','options'=>['Java','C','Python','JavaScript'],'answer'=>3],
    ['id'=>2,'category'=>'general','difficulty'=>'easy','question'=>'What does CSS stand for?','options'=>['Central Style Sheets','Cascading Style Sheets','Cascading Simple Sheets','Cars SUVs Sailboats'],'answer'=>1],
    ['id'=>3,'category'=>'general','difficulty'=>'easy','question'=>'What does HTML stand for?','options'=>['Hypertext Markup Language','Hyperloop Machine Language','Hyperlink Markup Language','Hypertext Markdown Language'],'answer'=>0],
    ['id'=>4,'category'=>'general','difficulty'=>'medium','question'=>'Which company developed the React library?','options'=>['Google','Facebook (Meta)','Microsoft','Apple'],'answer'=>1],
    ['id'=>5,'category'=>'general','difficulty'=>'medium','question'=>'Which symbol is used for comments in JavaScript?','options'=>['<!-- -->','//','/* */','#'],'answer'=>1],
    ['id'=>6,'category'=>'science','difficulty'=>'hard','question'=>'What is the chemical symbol for Gold?','options'=>['Au','Ag','Gd','Go'],'answer'=>0],
    ['id'=>7,'category'=>'math','difficulty'=>'easy','question'=>'What is 2 + 2 * 2 ?','options'=>['6','8','4','10'],'answer'=>0]
];
// Build lists for categories and difficulties dynamically
$categories = array_values(array_unique(array_map(function($q){return $q['category'];}, $questions)));
$difficulties = array_values(array_unique(array_map(function($q){return $q['difficulty'];}, $questions)));
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Frugal Testing - Dynamic Quiz App (PHP)</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <main class="container">
    <section id="landing" class="card">
      <h1>Dynamic Quiz App (PHP)</h1>
      <p>Select category, difficulty and number of questions. Each question has a countdown timer.</p>
      <label for="category">Category:</label>
      <select id="category">
        <option value="all">All</option>
        <?php foreach($categories as $c) echo '<option value="'.htmlspecialchars($c).'">'.htmlspecialchars(ucfirst($c)).'</option>'; ?>
      </select>
      <label for="difficulty">Difficulty:</label>
      <select id="difficulty">
        <option value="all">All</option>
        <?php foreach($difficulties as $d) echo '<option value="'.htmlspecialchars($d).'">'.htmlspecialchars(ucfirst($d)).'</option>'; ?>
      </select>
      <label for="q-count">Number of Questions:</label>
      <input id="q-count" type="number" value="5" min="1" max="20">
      <label for="time-limit">Seconds per question:</label>
      <input id="time-limit" type="number" value="15" min="5" max="120">
      <button id="start-quiz-btn">Start Quiz</button>
    </section>

    <section id="quiz" class="card hidden">
      <div class="quiz-header">
        <div id="progress">Question <span id="current">1</span> / <span id="total">5</span></div>
        <div id="timer">Time: <span id="time-left">15</span>s</div>
      </div>
      <h2 id="question-text"></h2>
      <div id="options" class="options"></div>
      <div class="controls">
        <button id="prev-btn">Previous</button>
        <button id="next-btn">Next</button>
        <button id="submit-quiz-btn">Submit Quiz</button>
      </div>
    </section>

    <section id="result" class="card hidden">
      <h2>Result</h2>
      <p id="score-summary"></p>
      <div class="charts">
        <canvas id="pieChart" width="400" height="200"></canvas>
        <canvas id="barChart" width="600" height="200"></canvas>
      </div>
      <div id="detailed"></div>
      <button id="restart-btn">Restart</button>
    </section>
  </main>

  <script>
    // Embed questions as JSON from PHP
    window.QUIZ_DATA = <?php echo json_encode($questions, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT); ?>;
  </script>
  <script src="app.js"></script>
</body>
</html>
