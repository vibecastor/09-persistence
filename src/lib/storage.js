'use strict';

const logger = require('./logger');

const storage = module.exports = {};
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), { suffix: 'Prom' });

// TODO:  Storage.create is complete for lab 09.
storage.create = function create(schema, item) {
  if (!schema) return Promise.reject(new Error('Cannot create a new item, schema required'));
  if (!item) return Promise.reject(new Error('Cannot create a new item, item required'));
  const json = JSON.stringify(item);
  return fs.writeFileProm(`${__dirname}/../data/${schema}/${item.id}.json`, json)
    .then(() => {
      logger.log(logger.INFO, 'STORAGE: Created a new Resource');
      return item;
    })
    .catch(err => Promise.reject(err));
};

// TODO:  this is lab 08 code.  Please remove before submitting lab 09...
// storage.create = function create(schema, item) { // item is req.body...
//   logger.log(logger.INFO, 'STORAGE: Created a new resource');
//   return new Promise((resolve, reject) => {
//     if (!schema) return Promise.reject(new Error('Cannot create a new item, schema required!'));
//     if (!item) return Promise.reject(new Error('Cannot create a new item, item,
// required please!'));
//
//     const json = JSON.writeFileProm(`${__dirname}/../data/${schema}/${item.id}.json`, json)
//       .then(() => {
//         logger.log(logger.INFO, 'STORAGE: Created a new Resource');
//         return item;
//       })
//       .catch(err => Promise.reject(err));
//     if (!memory[schema]) memory[schema] = {};
//     memory[schema][item.id] = item;
//     return resolve(item);
//   });
// };

// TODO:  Storage.fetchOne is complete for lab 09.
storage.fetchOne = function fetchOne(schema, id) {
  if (!schema) return Promise.reject(new Error('expected schema name'));
  if (!id) return Promise.reject(new Error('expected id'));

  return fs.readFileProm(`${__dirname}/../data/${schema}/${id}.json`)
    .then((data) => {
      try {
        const item = JSON.parse(data.toString());
        return item;
      } catch (err) {
        return Promise.reject(err);
      }
    })
    .catch((err) => { // caught this syntax error
      logger.log(logger.ERROR, JSON.stringify(err));
    });


// TODO:  this is lab 08 code.  Please remove before submitting lab 09...
  // if (!memory[schema]) return(new Error('schema not found'));
  // const item = memory[schema][id];
  // if (!item) {
  //   return reject(new error('item not found'));
  // }
  // console.log(item);
  // return resolved(item);
  // // return undefined;
};

// TODO: write fetchAll using fs.readdirProm
storage.fetchAll = function fetchAll() {
  return fs.readdirProm('needs some argument in here read the docs...')
  .then(something => {
    // do logic on something here
  }).catch(err) => {
    // logic with error
  };


// TODO:  this is the old code from fetchAll as an example...
//   return new Promise((resolve, reject) => {
//     if (!schema) return reject(new Error('no schema'));
//     if (!memory[schema]) return reject(new Error('memory schema not found'));
//     const allLlamas = allItems.map(llama => llama.id);
//     if (!llamas) {
//       return reject(new Error('Llama Object not found'));
//     }
//     return resolve(llamas);
//   });
};

// storage.update = function update() {
//   // I didn't have time to tackle this one...
// };

// TODO:  this is the old code... promisify this as well...
// storage.delete = function remove(schema, id) {
//   return new Promise((resolve, reject) => {
//     if (!schema) return reject(new Error('expected id'));
//     if (!id) return reject(new Error('expected id'));
//     if (!memory[schema]) return (new Error('schema not found'));
//     const item = memory[schema][id];
//     if (!item) {
//       return reject(new error('item not found'));
//     }
//     delete item.memory.id;
//     return resolved(item);
//   });
// };
