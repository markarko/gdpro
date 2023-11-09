import Select from './Select';

export default function CountryFilter({ countries }) {
  return (
    <div>
      <Select options={countries} labelText="Select a country to be displayed: "/>
      <button>Add</button>
    </div>
  );
}