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
    }
    return instance;
  }

  async connect(dbname) {
    if (instance.db){
      return;
    }
    await instance.client.connect();
    instance.db = await instance.client.db(dbname);
    // Send a ping to confirm a successful connection
    await instance.client.db(dbname).command({ ping: 1 });
  }

  async close() {
    await instance.client.close();
    instance = null;
  }

  async readAll(collName) {
    try {
      const collection = await instance.db.collection(collName);
      const result = await collection.find({}, { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readAll:', error);
    }
  }

  async readAllCountryData(collName, country) {
    try {
      const collection = await instance.db.collection(collName);
      const result = await collection.find({ country: country },
        { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readAllCountryData:', error);
    }
  }
    
  async readAllYearData(collName, year) {
    try {
      const collection = await instance.db.collection(collName);
      const result = await collection.find({ year: year },
        { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readAllYearData:', error);
    }
  }
    
  async readDataByYearRange(collName, startYear, endYear) {
    try {
      const collection = await instance.db.collection(collName);
      const result = await collection.find({
        year: { $gte: startYear, $lte: endYear }
      }, { projection: { _id: 0 }}).toArray();
      return result;
    } catch (error) {
      console.error('Error in readDataByYearRange:', error);
    }
  }
    
  async createRecord(collName, jsonRecord) {
    try {
      const collection = await instance.db.collection(collName);
      await collection.insertOne(jsonRecord);
    } catch (error) {
      console.error('Error in createRecord:', error);
    }
  }
    
  async createMany(collName, jsonRecordsArray) {
    try {
      const collection = await instance.db.collection(collName);
      await collection.insertMany(jsonRecordsArray, { ordered: true });
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

  async index (collName) {
    try {
      const collection = await instance.db.collection(collName);
      await collection.createIndex({ country: 1 });
    } catch (error) {
      console.error('Error in index:', error);
    }
  }
}

module.exports = DB;

