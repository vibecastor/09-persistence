'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

const testPort = 5000;
const mockResource = { title: 'test llama title', content: 'test llama content' };
let mockId = null;

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());

// In this lab, you MUST post first BEFORE you get
describe('VALID request to the API', () => {
  describe('POST /api/v1/llama', () => {
    it('should respond with status 201 and create a new llama', () => {
      return superagent.post(`:${testPort}/api/v1/llama`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          expect(res.body.title).toEqual(mockResource.title);
          expect(res.body.content).toEqual(mockResource.content);
          expect(res.status).toEqual(201);
        });
    });
  });
});

// TODO:  You have to run the Post Test or have something in your data/llama dir in order for the GET to pass.
describe('GET /api/v1/llama', () => {
  it('should respond with the a previously created llama', () => {
    // console.log(mockId, 'MOCK ID IN GET BLOCK')
    return superagent.get(`:${testPort}/api/v1/llama?id=${mockId}`)
      // .query({}) // not sure about this....
      .then((res) => {
        // console.log(res.body);
        expect(res.body.title).toEqual(mockResource.title);
        expect(res.body.content).toEqual(mockResource.content);
        expect(res.status).toEqual(200);
      });
    // if testing for errors test them in a .catch block!!!
  });
});

describe('INVALID request to the API', () => {
  describe('GET /api/v1/cowsay', () => {
    it('should err out with 404 status code for not sending text in query', () => {
      return superagent.get(`:${testPort}/api/v1/llama?id=23`)
        .query({})
        // .then(() => {})
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
