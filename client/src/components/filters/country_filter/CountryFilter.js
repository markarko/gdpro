import './CountryFilter.css';
import Select from '../Select';

export default function CountryFilter({ countries }) {
  return (
    <div className="CountryFilter">
      <Select options={countries} labelText="Select a country to be displayed: "/>
      <button>Add</button>
    </div>
  );
}