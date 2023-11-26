import './AnswerOption.css';

/**
 * AnswerOptions component used for displaying the answer options in form of radio buttons
 * @param {*} props 
 * @returns JSX AnswerOptions Component with the answer options
 */
export default function AnswerOption({ choices, setAnswer }) {
  if (choices === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="AnswerOption">
      {choices.map((choice, index) => 
        <div key={index}>
          <input
            type="radio"
            id={choice['country']}
            name="answer"
            value={choice['country']}
            className="answers"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <label htmlFor={choice['country']}>{choice['country']}</label>
        </div>
      )}
    </div>
  );
}