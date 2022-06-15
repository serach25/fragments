// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
// version and author from package.json
//const { version, author } = require('../../../package.json');

// response functions
/*const { createSuccessResponse } = require('../../../src/response');

module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  const data = { fragments: [] };
  const successResponse = createSuccessResponse(data);
  res.status(200).json(successResponse);
};*/

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
//const hash = require('../../hash');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    res.status(200).json(
      createSuccessResponse({
        fragments: await Fragment.byUser(req.user, req.query.expand),
      })
    );
  } catch (error) {
    res.status(401).json(createErrorResponse(401, error));
  }
};
