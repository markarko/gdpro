import AnswerOption from './AnswerOption';

/***
 * Question component used for displaying only the question and the answer options
 * @param {*} props
 * @returns JSX Question Component with the question and the AnswerOption component
 */

export default function Question({ data, setAnswer }) {
  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Guess the country based on GDP and Protein and the Year: </h1>
      <p>A pin on the map has been placed to help guess which country it is</p>
      <AnswerOption choices={data} setAnswer={setAnswer}/>
    </div>
  );
}