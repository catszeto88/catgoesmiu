/* eslint-disable no-console */
require('es6-promise').polyfill();
require('isomorphic-fetch');
const csvParser = require('csv-parser');
const fs = require('fs');

// Headers should be
// allowedGuests;adults;children
const FILE_NAME = 'guests.csv';

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

const createInvite = async ({ allowedGuests, adults, children }) => {
  const query = `
    mutation CreateInvite($allowedGuests: Int) {
      createInvite(allowedGuests: $allowedGuests) {
        id
        allowedGuests
        code
      }
    }
  `;

  const variables = {
    allowedGuests: parseInt(allowedGuests, 10),
  };

  const invite = (await graphqlRequest({ query, variables })).createInvite;

  adults.split(',').forEach(async name => {
    const query = `
    mutation CreateGuest($name: String, $inviteId: ID) {
      createExpectedGuest(name: $name, inviteId: $inviteId, isAdult: true) {
        id
        name
        isAdult
        invite {
          code
        }
      }
    }
  `;

    const variables = {
      name,
      inviteId: invite.id,
    };

    const guest = (await graphqlRequest({ query, variables }))
      .createExpectedGuest;

    console.log(`${guest.name},${guest.isAdult},${invite.code}`);
  });

  if (children && children.trim() !== '') {
    children.split(',').forEach(async name => {
      const query = `
      mutation CreateGuest($name: String, $inviteId: ID) {
        createExpectedGuest(name: $name, inviteId: $inviteId, isAdult: false) {
          id
          name
          isAdult
          invite {
            code
          }
        }
      }
    `;

      const variables = {
        name,
        inviteId: invite.id,
      };

      const guest = (await graphqlRequest({ query, variables }))
        .createExpectedGuest;

      console.log(`${guest.name},${guest.isAdult},${invite.code}`);
    });
  }

  return invite;
};

fs.createReadStream(FILE_NAME)
  .pipe(csvParser({ separator: ';' }))
  .on('data', data => {
    // This returns the guest data, but fetching it again just to show query
    createInvite(data);
  })
  .on('end', () => {
    console.log('name,isAdult,code');
  });
