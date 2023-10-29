const DB = require('../db/db');

//from Goodreads
const quotes = [
  {
    quote: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde'
  },
  {
    quote: 'Two things are infinite: the universe and human stupidity; ' +
    'and Im not sure about the universe.',
    author: 'Albert Einstein'
  },
  {
    quote: 'So many books, so little time.',
    author: 'Frank Zappa'
  },
  {
    quote: 'A room without books is like a body without a soul.',
    author: 'Marcus Tullius Cicero'
  },
  {
    quote: 'Be the change that you wish to see in the world.',
    author: 'Mahatma Gandhi'
  }
];

(async () => {
  let db;
  try {
    const db = new DB();
    await db.connect('cluster0', 'quotes');
    const num = await db.createMany(quotes);
    console.log(`Inserted ${num} quotes`);
  } catch (e) {
    console.error('could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();
