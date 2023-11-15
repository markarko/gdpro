import AnswerOption from './AnswerOption';

/***
 * Question component used for displaying only the question and the answer options
 * @param {*} props
 * @returns JSX Question Component with the question and the AnswerOption component
 */

export default function Question(props) {
  if (props.data === null) {
    return <div>Loading...</div>;
  }



  //const coordinates = String(props.data.coordinates).split('-');
  return (
    <div>
      <h1>Guess the country based on GDP and Protein: </h1>
      <p>GDP: {props.data.QData.GDP} Protein: {props.data.QData.Protein}</p>
      <p>A pin on the map has been placed to help guess which country it is</p>
      <AnswerOption choices={props.data['Answers']} setAnswer={props.setAnswer}/>
    </div>
  );
}