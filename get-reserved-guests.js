/* eslint-disable no-console */
require('es6-promise').polyfill();
require('isomorphic-fetch');
const { parseISO, format } = require('date-fns');

const DELIMITER = '\t';

const graphqlRequest = async ({ query, variables }) => {
  const response = await fetch(
    'https://api.graph.cool/simple/v1/ck4w9ueke2zxh0138g2fv6oyn',
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzUyMjY2MTIsImNsaWVudElkIjoiY2pjM3cxZG1zMjJvbDAxOTBpc2IxMXB1eiJ9.roZpR363_VCeNyUDKs9HwmWXD1-C-Om_i9CtQsS4Hg8',
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  const { data } = await response.json();
  return data;
};

const getReservedGuests = async () => {
  const query = `
    query {
      allReservedGuests {
        name
        ageRange
        mealType
        highChairNeeded
        notes
        rsvp {
          attending
          phoneNumber
          foodRestrictions
          message
        }
        createdAt
      }
    }
  `;

  const variables = {};

  return (await graphqlRequest({ query, variables })).allReservedGuests;
};

getReservedGuests().then(guests => {
  console.log(
    [
      'Name',
      'Age Range',
      'Meal Type',
      'Needs High Chair',
      'Notes',
      'Attending',
      'Phone Number',
      'Food Restrictions',
      'Message',
      'Responded On',
    ].join(DELIMITER)
  );
  guests.forEach(
    ({ name, ageRange, mealType, highChairNeeded, notes, rsvp, createdAt }) => {
      console.log(
        [
          name,
          ageRange,
          mealType,
          highChairNeeded ? 'Yes' : 'No',
          notes,
          rsvp.attending ? 'Yes' : 'No',
          rsvp.phoneNumber,
          rsvp.foodRestrictions,
          rsvp.message,
          format(parseISO(createdAt), 'MMM do, yyyy hh:mm aaa'),
        ].join(DELIMITER)
      );
    }
  );
});
