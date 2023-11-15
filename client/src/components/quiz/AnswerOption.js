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
    <div>
      {choices.map((choice, index) => 
        <div key={index}>
          <input
            type="radio"
            id={choice}
            name="answer"
            value={choice}
            className="answers"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <label htmlFor={choice}>{choice}</label>
        </div>
      )}
    </div>
  );
}