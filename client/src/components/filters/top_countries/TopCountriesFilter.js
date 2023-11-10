import './TopCountriesFilter.css';
import Select from '../select/Select';

export default function TopCountriesFilter() {
  const topRange = [3, 4, 5, 6, 7, 8, 9, 10];
  const variations = ['highest', 'lowest'];
  const values = ['gdp', 'protein'];

  return (
    <div className="TopCountriesFilter">
      <Select options={topRange} labelText="Select top " />
      <Select options={variations} labelText=" countries with " />
      <Select options={values} labelText="" />
    </div>
  );
}