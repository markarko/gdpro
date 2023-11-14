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
      <h1>Guess the metro station from these coordinates: </h1>
      <p>Lan: None Lon: -None</p>
      <p>A pin on the map has been placed to help guess which metro station it is</p>
      <AnswerOption choices={props.data['questions']} setAnswer={props.setAnswer}/>
    </div>
  );
}