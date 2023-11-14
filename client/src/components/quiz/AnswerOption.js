import { useState, useEffect } from 'react';

/**
 * AnswerOptions component used for displaying the answer options in form of radio buttons
 * @param {*} props 
 * @returns JSX AnswerOptions Component with the answer options
 */
export default function AnswerOption(props) {
  if (props.choices === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {props.choices.map((choice, index) => 
        <div key={index}>
          <input
            type="radio"
            id={choice}
            name="answer"
            value={choice}
            className="answers"
            onChange={(e) => props.setAnswer(e.target.value)}
          />
          <label htmlFor={choice}>{choice}</label>
        </div>
      )}
    </div>
  );
}