import Select from './SelectFilter';

export default function MapFilters({ years }) {
  return(
    <div>
      <Select options={years} labelText="Select the year: "/>
    </div>
  );
}

