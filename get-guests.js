/* eslint-disable no-console */
require('es6-promise').polyfill();
require('isomorphic-fetch');

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

const getInvites = async () => {
  const query = `
  query {
    allInvites {
      code
      guests {
          name
          isAdult
      }
      rsvps {
        attending
      }
    }
  }
  `;

  const variables = {};

  return (await graphqlRequest({ query, variables })).allInvites;
};

getInvites().then(invites => {
  invites.forEach(({ code, guests }) => {
    console.log(code);
    guests
      .sort((a, b) => (b.isAdult ? 1 : -1))
      .forEach(({ name }) => console.log(name));
    console.log('');
  });
});
