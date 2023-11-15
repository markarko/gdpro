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
      <h1>Guess the country based on GDP and Protein and the year the country had both: </h1>
      <p>GDP: {data.QData.GDP} Protein: {data.QData.Protein} </p>
      <p>Year: {data.QData.year}</p>
      <p>A pin on the map has been placed to help guess which country it is</p>
      <AnswerOption choices={data['Answers']} setAnswer={setAnswer}/>
    </div>
  );
}