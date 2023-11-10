export default function Select({ options, labelText }) {
  return (
    <div>
      <label>{labelText}</label>
      <select>
        {options.map(item => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}