import React, { useEffect, useState } from 'react';
import Question from './Question';
import Score from './score';

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

  async function getData() {
    setMessage('Loading questions...');
    const response = await fetch('/api/v1/questions/random-questions/5');
    const json = await response.json();
    if (!response.ok) {
      setMessage('Error fetching data');
      console.error(json.error);
      return;
    }
    clearQuestionComponent();
    nextQuestion(json.data.questions, setQuestion, setQuestions);
  }

  useEffect(() => {
    // Sometimes the api takes a long time to respond, so set loading message
    getData();
  }, []);

  // // Set points (AKA the coordinates on the map) based on the question coordinates
  // useEffect(() => {
  //   if (question !== null) {
  //     setPoints([[question.coordinates[0], question.coordinates[1]]]);
  //   }
  // }, [question, setPoints]);

  function handleSubmit(e) {
    e.preventDefault();

    if (answer === null) {
      setMessage('Please select an answer');
      return;
    } else if (answer === question.Correct) {
      setScore(score + 1);
      setMessage('That’s right!');
    } else {
      setMessage('Sorry, the correct answer is ' + question.Correct);
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
    if (questions.length === 0) {
      getData();
      // Disable next button for first question
      document.getElementsByClassName('next')[0].disabled = true;
    } else {
      nextQuestion(questions, setQuestion, setQuestions);
    }
    e.target.disabled = true;

    // re-enable submit button and clear answers
    document.getElementsByClassName('submit')[0].disabled = false;
  }

  return (
    <div>
      {question !== null &&
        <div>
          <Question data={question} setAnswer={setAnswer} />
          <button className="submit" onClick={handleSubmit}>Submit</button>
          <button className="next" onClick={handleNextQuestion}>Next Question</button>
        </div>
      }
      <Score score={score} message={message}/>
    </div>
  );
}       

