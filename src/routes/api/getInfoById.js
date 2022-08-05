// src/routes/api/getById.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/*Allows the authenticated user to get (i.e., read) the metadata for one of their existing fragments with the specified id. 
 If no such fragment exists, returns an HTTP 404 with an appropriate error message. */
/*module.exports = async (req, res) => {
  var id = req.params.id;
  var user = req.user;

  try {
    logger.info('getting fragment info by id');
    const fragment = new Fragment(await Fragment.byId(user, id));
    logger.info('returning fragment metadata');
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragments: fragment,
      })
    );
  } catch (error) {
    logger.warn('No fragment exists for the id specified');
    res.status(404).json(createErrorResponse(404, error));
  }
};*/

module.exports = async (req, res) => {
  //Get the id of the fragment
  var Id = req.params.id;
  logger.debug({ Id }, 'Got ID');

  try {
    const fragment = new Fragment(await Fragment.byId(req.user, Id));
    logger.info({ fragment }, 'Got fragment');
    const successResponse = createSuccessResponse({ fragment: fragment });
    res.status(200).send(successResponse);
  } catch (error) {
    //If the id does not exist, returns an HTTP 404 with an appropriate error message.
    logger.error({ error }, `Fragment with ${Id} does not exist`);
    res.status(404).json(createErrorResponse(404, `Fragment with ${Id} does not exist`));
  }
};
