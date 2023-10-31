async function readAll() {
  try {
    const result = await instance.collection.find({}, { projection: { _id: 0 }}).toArray();
    return result;
  } catch (error) {
    console.error('Error in readAll:', error);
  }
}
  
async function readAllCountryData(country) {
  try {
    const result = await instance.collection.find({ country: country }).toArray();
    return result;
  } catch (error) {
    console.error('Error in readAllCountryData:', error);
  }
}
  
async function readAllYearData(year) {
  try {
    const result = await instance.collection.find({ year: year }).toArray();
    return result;
  } catch (error) {
    console.error('Error in readAllYearData:', error);
  }
}
  
async function readDataByYearRange(startYear, endYear) {
  try {
    const result = await instance.collection.find({
      year: { $gte: startYear, $lte: endYear }
    }).toArray();
    return result;
  } catch (error) {
    console.error('Error in readDataByYearRange:', error);
  }
}
  
async function createRecord(jsonRecord) {
  try {
    await instance.collection.insertOne(jsonRecord);
  } catch (error) {
    console.error('Error in createRecord:', error);
  }
}
  
async function createMany(jsonRecordsArray) {
  try {
    await instance.collection.insertMany(jsonRecordsArray, { ordered: true });
  } catch (error) {
    console.error('Error in createMany:', error);
  }
}  