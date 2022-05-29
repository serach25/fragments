// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
// version and author from package.json
const { version, author } = require('../../../package.json');

// response functions
const { createSuccessResponse } = require('../../../src/response');

module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  const data = { author, githubUrl: 'https://github.com/serach25/fragments', version };
  const successResponse = createSuccessResponse(data);
  res.status(200).json(
    successResponse
    /*
    status: 'ok',
    fragments: [],
  */
  );
};
