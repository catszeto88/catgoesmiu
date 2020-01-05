const randomstring = require('randomstring');

export default event => {
  event.data.code = randomstring.generate({
    length: 5,
    charset: 'alphabetic',
    capitalization: 'lowercase',
  });

  return event;
};
