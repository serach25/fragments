// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

//for conversions
const md = require('markdown-it')();
const { htmlToText } = require('html-to-text');
var removeMd = require('remove-markdown-and-html');
const sharp = require('sharp');

/*CONVERSIONS SUPPORTED:
text/plain
text/markdown -> .html, .txt
text/html	    -> .txt
application/json -> .txt
image/png	       -> .jpg, .webp, gif
image/jpeg	     -> .png, .webp, gif
image/webp	     -> .png, .jpg,  gif
image/gif	       -> .png, .jpg, .webp */

/*gets an authenticated user's fragment data (i.e., raw binary data) with the given id.*/
module.exports = async (req, res) => {
  var id = req.params.id;
  var user = req.user;

  //extracting extension from request
  if (req.params.id.includes('.')) {
    id = req.params.id.substr(0, req.params.id.indexOf('.'));
    var extension = req.params.id.substr(req.params.id.indexOf('.'));
  } else {
    extension = '';
  }

  //valid extensions
  if (
    !extension ||
    extension == '.txt' ||
    extension == '.html' ||
    extension == '.md' ||
    extension == '.json' ||
    extension == '.png' ||
    extension == '.jpg' ||
    extension == '.webp' ||
    extension == '.gif'
  ) {
    //retrieve fragment by id
    try {
      logger.info('getting fragment by id');
      const fragment = new Fragment(await Fragment.byId(user, id));
      logger.info('getting fragment data');
      const fragmentData = await fragment.getData();
      var type = fragment.type;
      var data;

      //valid conversions
      try {
        //convert markdown to html
        if (extension === '.html' && type === 'text/markdown') {
          data = md.render(fragmentData.toString());
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/html');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }
        //convert markdown to plain text
        else if (extension === '.txt' && type === 'text/markdown') {
          data = removeMd(fragmentData.toString());
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/plain');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }
        //convert html to plain text
        else if (extension === '.txt' && type === 'text/html') {
          data = htmlToText(fragmentData.toString(), {
            wordwrap: 130,
            selectors: [
              { selector: 'h1', options: { uppercase: false } },
              { selector: 'h2', options: { uppercase: false } },
              { selector: 'h3', options: { uppercase: false } },
              { selector: 'h4', options: { uppercase: false } },
              { selector: 'h5', options: { uppercase: false } },
              { selector: 'h6', options: { uppercase: false } },
            ],
          });
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/plain');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }
        //convert json to plain text
        else if (extension === '.txt' && type === 'application/json') {
          data = fragmentData.toString();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'text/plain');
          logger.info('returning converted fragment data');
          res.status(200).send(data);
        }
        //convert any image to any other image format
        else if (extension === '.png' && type.startsWith('image/')) {
          extension = extension.substring(1);
          data = await sharp(fragmentData).toFormat(extension).toBuffer();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'image/jpeg');
          logger.info('returning converted fragment data');
          res.status(200).send(data.toString('base64'));
        } else if (extension === '.jpg' && type.startsWith('image/')) {
          extension = extension.substring(1);
          data = await sharp(fragmentData).toFormat(extension).toBuffer();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'image/jpeg');
          logger.info('returning converted fragment data');
          res.status(200).send(data.toString('base64'));
        } else if (extension === '.webp' && type.startsWith('image/')) {
          extension = extension.substring(1);
          data = await sharp(fragmentData).toFormat(extension).toBuffer();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'image/jpeg');
          logger.info('returning converted fragment data');
          res.status(200).send(data.toString('base64'));
        } else if (extension === '.gif' && type.startsWith('image/')) {
          extension = extension.substring(1);
          data = await sharp(fragmentData).toFormat(extension).toBuffer();
          logger.info('setting content-type as converted type');
          res.setHeader('Content-type', 'image/jpeg');
          logger.info('returning converted fragment data');
          res.status(200).send(data.toString('base64'));
        }
        //if there is no extension or extension is the same as fragment type
        else if (
          !extension ||
          (extension === '.txt' && type === 'text/plain') ||
          (extension === '.html' && type === 'text/html') ||
          (extension === '.md' && type === 'text/markdown') ||
          (extension === '.json' && type === 'application/json') ||
          (extension === '.png' && type === 'image/png') ||
          (extension === '.jpg' && type === 'image/jpeg') ||
          (extension === '.webp' && type === 'image/webp') ||
          (extension === '.gif' && type === 'image/gif')
        ) {
          //if getting an image
          if (type.startsWith('image/')) {
            res.status(200).send(fragmentData.toString('base64'));
          }

          logger.info('setting content-type as fragment type');
          res.setHeader('Content-type', type);
          logger.info('returning raw fragment data');
          res.status(200).send(fragmentData);
        }
      } catch (error) {
        res
          .status(415)
          .json(createErrorResponse(415, 'Cannot convert fragment to the required extension'));
      }
    } catch (error) {
      logger.warn('The ID provided does not represent a known fragment');
      res.status(404).json(createErrorResponse(404, 'The id does not represent a known fragment'));
    }
  } else {
    res.status(415).json(createErrorResponse(415, 'Not a supported fragment type'));
  }
};
