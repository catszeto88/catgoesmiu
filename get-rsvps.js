/* eslint-disable no-console */
require('es6-promise').polyfill();
require('isomorphic-fetch');
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

const getInvites = async () => {
  const query = `
    query {
      allInvites {
        code
        guests {
            name
        }
        rsvps {
          attending
          guests {
            name
          }
        }
      }
    }
  `;

  const variables = {};

  return (await graphqlRequest({ query, variables })).allInvites;
};

getInvites().then(invites => {
  console.log(['Attending', 'Not Attending', 'Unanswered'].join(DELIMITER));
  const attending = invites
    .filter(({ rsvps }) => rsvps.some(({ attending }) => attending))
    .map(({ code, rsvps }) => {
      const guestNames = Array.from(
        new Set(
          rsvps.reduce(
            (allGuests, { guests }) =>
              allGuests.concat(guests.map(({ name }) => name)),
            []
          )
        )
      );
      return `"${code}\r${guestNames.join('\r')}"`;
    });
  const notAttending = invites
    .filter(
      ({ rsvps }) =>
        rsvps.length > 0 && !rsvps.some(({ attending }) => attending)
    )
    .map(
      ({ code, guests }) =>
        `"${code}\r${guests.map(({ name }) => name).join('\r')}"`
    );
  const unanswered = invites
    .filter(({ rsvps }) => rsvps.length === 0)
    .map(
      ({ code, guests }) =>
        `"${code}\r${guests.map(({ name }) => name).join('\r')}"`
    );
  [
    ...Array(
      Math.max(attending.length, notAttending.length, unanswered.length)
    ).keys(),
  ].forEach(i => {
    console.log(
      [attending[i] || '', notAttending[i] || '', unanswered[i] || ''].join(
        DELIMITER
      )
    );
  });
});
