'use strict';

const logger = require('../lib/logger');
const Llama = require('../model/llama');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeLlama(router) {
  router.post('/api/v1/llama', (req, res) => {
    logger.log(logger.INFO, 'ROUTE-LLAMA: POST /api/v1/llama');

    try {
      const newLlama = new Llama(req.body.title, req.body.content);
      storage.create('Llama', newLlama) // LLama is passed over from 'item' in storage.create
        .then((llama) => {
           response.sendJSON(res, 201, llama); 
           return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `ROUTE-LLAMA: There was a bad request ${err}`);
      response.sendText(res, 400, err.message);
      return undefined;
    }
    return undefined;
  });

  router.get('/api/v1/llama', (req, res) => {
    if (!req.url.query.id) {
      response.sendText(res, 404, 'Your request requires an id');
      return undefined;
      }
      
      storage.fetchOne('Llama', req.url.query.id)
        .then((item) => {
        response.sendJSON(res, 200, item);
          return undefined;
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          response.sendText(res, 404, 'Resource not found');
          return undefined;
        });
      return undefined;
    });
  };

  router.delete('/api/v1/llama', (req, res) => {
  storage.delete('Llama', req.url.query.id)
  .then(() => {
    response.deleteJSON(res, 204, item);
    return undefined;
  });
  return undefined;
  });
};
