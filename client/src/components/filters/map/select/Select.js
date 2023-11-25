export default function Select({ options, labelText, onChange }) {
  return (
    <div>
      <label className = "filter-select-country">{labelText}</label>
      <br />
      <select onChange={e => {
        if (onChange !== undefined){
          onChange(e);
        }
      }}>
        {options.map(item => <option key={item}>{item}</option>)}
      </select>
    </div>
  );
}