/**
 * Score compnent used for displaying the score and the message associated with the score
 * @param {*} props 
 * @returns 
 */

export default function Score(props) {
  return (
    <div>
      <p>{props.message}</p>
      <p>Score {props.score}</p>
    </div>
  );
}