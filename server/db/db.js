require('dotenv').config();
const dbUrl = process.env.ATLAS_URI;
const { MongoClient } = require('mongodb');

let instance = null;

class DB {
  constructor(){
    //instance is the singleton, defined in outer scope
    if (!instance){
      instance = this;
      this.client = new MongoClient(dbUrl);
      this.db = null;
      this.collection = null;
    }
    return instance;
  }

  async connect(dbname, collName) {
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.client.db(dbname).command({ ping: 1 });
    instance.collection = await instance.db.collection(collName);
  }

  async close() {
    await instance.client.close();
    instance = null;
  }
  async readAll() {
    try {
      const result = await instance.collection.find({}, { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readAll:', error);
    }
  }
    
  async readAllCountryData(country) {
    try {
      const result = await instance.collection.find({ country: country },
        { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readAllCountryData:', error);
    }
  }
    
  async readAllYearData(year) {
    try {
      const result = await instance.collection.find({ year: year },
        { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readAllYearData:', error);
    }
  }
    
  async readDataByYearRange(startYear, endYear) {
    try {
      const result = await instance.collection.find({
        year: { $gte: startYear, $lte: endYear }
      }, { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readDataByYearRange:', error);
    }
  }
    
  async createRecord(jsonRecord) {
    try {
      await instance.collection.insertOne(jsonRecord);
    } catch (error) {
      console.error('Error in createRecord:', error);
    }
  }
    
  async createMany(jsonRecordsArray) {
    try {
      await instance.collection.insertMany(jsonRecordsArray, { ordered: true });
    } catch (error) {
      console.error('Error in createMany:', error);
    }
  }

  async open(dbname, collName) {
    try {
      await instance.connect(dbname, collName);
    } finally {
      await instance.close();
    }
  }
}

module.exports = DB;

