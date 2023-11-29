import React, { useEffect, useState } from 'react';
import Question from './Question';
import Score from './score';
import PlotController from '../chart/PlotController';
import Map from '../Map/Map';
import './Quiz.css';
import '../Map/Map.css';

/**
 * function to get the next question from the data given and then set the question and the questions
 * @param {*} data 
 * @param {*} setQuestion 
 * @param {*} setQuestions 
 */

function nextQuestion(data, setQuestion, setQuestions) {
  setQuestion(data[0]);
  setQuestions(data.slice(1));
}

/**
 * The panel component handles the quiz mode and the info mode logic of the app
 * it handles fetching the data, setting the questions, setting the points, 
 * handling answer submissions and handling the score
 * @param {*} props 
 * @returns 
 */
export default function QuizComponent(props) {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  // Clear question, answer and message
  function clearQuestionComponent() { 
    setQuestion(null);
    setAnswer(null);
    setMessage('');

    const answers = document.getElementsByClassName('answers');
    for (let i = 0; i < answers.length; i++) {
      answers[i].checked = false;
    }
  }

  async function getInitialData() {
    let cachedQuestions = localStorage.getItem('questions');

    if (cachedQuestions && cachedQuestions.length) {
      cachedQuestions = JSON.parse(cachedQuestions);

      setQuestions(cachedQuestions);
      clearQuestionComponent();
      nextQuestion(cachedQuestions, setQuestion, setQuestions);
      
      return;
    }

    setMessage('Loading questions...');

    const response = await fetch('/api/v1/questions/random-questions/5');
    const json = await response.json();

    if (!response.ok) {
      setMessage('Error fetching data');
      console.error(json.error);
      return;
    }

    localStorage.setItem('questions', JSON.stringify(json.data));

    clearQuestionComponent();
    nextQuestion(json.data, setQuestion, setQuestions);
  }
  
  async function preFetchData() {
    const response = await fetch('/api/v1/questions/random-questions/5');
    const json = await response.json();

    if (!response.ok) {
      setMessage('Error fetching data');
      console.error(json.error);
      return;
    }

    let cachedQuestions = localStorage.getItem('questions');

    if (cachedQuestions) {
      cachedQuestions = await JSON.parse(cachedQuestions);
      cachedQuestions.push(...json.data);
      localStorage.setItem('questions', JSON.stringify(cachedQuestions));
    }

    setQuestions(json.data);
  }

  useEffect(() => {
    // Sometimes the api takes a long time to respond, so set loading message
    getInitialData();
  // this is the initial fetch, so no dependencies need to be added
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (answer === null) {
      setMessage('Please select an answer');
      return;
    } else if (answer === question.answer) {
      setScore(score + 1);
      setMessage('That’s right!');
    } else {
      setMessage('Sorry, the correct answer is ' + question.answer);
    }

    // Disable submit button and enable next button
    e.target.disabled = true;
    document.getElementsByClassName('next')[0].disabled = false;
  }

  /**
   * Handles next question button click
   * Clears question, answer and message, disables next button and enables submit button
   * Clear all the answers from the board
   * @param {*} e 
   */
  function handleNextQuestion(e) {
    e.preventDefault();
    // Clear and disable button
    clearQuestionComponent();

    // Fetch the next batch of questions when we get to our last question form the current batch
    // Avoid the wait period for the user after every 5 questions
    if (questions.length === 1) {
      preFetchData();
    }

    nextQuestion(questions, setQuestion, setQuestions);

    e.target.disabled = true;

    // re-enable submit button and clear answers
    document.getElementsByClassName('submit')[0].disabled = false;

    let cachedQuestions = localStorage.getItem('questions');
  
    if (cachedQuestions) {
      cachedQuestions = JSON.parse(cachedQuestions);
      cachedQuestions = cachedQuestions.slice(1);
      localStorage.setItem('questions', JSON.stringify(cachedQuestions));
    }
  }

  return (
    <div>
      {question !== null &&
        <div className="Quiz">
          <div className="question-container">
            <Question data={question['map']} setAnswer={setAnswer}/>
            <div className="actions">
              <button className="submit" onClick={handleSubmit}>Submit</button>
              <button className="next" onClick={handleNextQuestion}>Next Question</button>
            </div>
            <Score score={score} message={message}/>
          </div>
          
          <PlotController
            gdp={question['chart']['gdp']}
            protein={question['chart']['gppd']}
            title="Guess the Country"
          />
  
          <Map
            gdp={question['map']}
            protein={question['map']}
          />
        </div>
      }
      <hr style={{'marginTop' : '2em'}}/>
    </div>
    
  );
}       

