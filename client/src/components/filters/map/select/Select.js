/**
 * A custom select component.
 *
 * @param {Object} options - The options for the select dropdown.
 * @param {string} labelText - The label text for the select dropdown.
 * @param {function} onChange - The callback function to be called when the select value changes.
 * @returns {JSX.Element} The rendered select component.
 */
export default function Select({ options, labelText, onChange }) {
  return (
    <div style={{'marginRight' : '20%'}}>
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