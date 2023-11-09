import Select from './SelectFilter';

export default function CountryFilter({ countries }) {
  return (
    <div>
      <Select options={countries} labelText="Select a country to be displayed: "/>
      <button>Add</button>
    </div>
  );
}