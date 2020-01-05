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

const createRsvp = async ({
  attending,
  phoneNumber,
  foodRestrictions,
  message,
}) => {
  const query = `
    mutation CreateRsvp($inviteId: ID, $attending: Boolean, $phoneNumber: String, $foodRestrictions: String, $message: String) {
      createRsvp(inviteId: $inviteId, attending: $attending, phoneNumber: $phoneNumber, foodRestrictions: $foodRestrictions, message: $message) {
        id
        attending
        phoneNumber
        foodRestrictions
        message
      }
    }
  `;

  const variables = {
    attending,
    phoneNumber,
    foodRestrictions,
    message,
  };

  return (await graphqlRequest({ query, variables })).createRsvp;
};

const createReservedGuest = async ({
  name,
  ageRange,
  mealType,
  highChairNeeded,
  notes,
}) => {
  const query = `
    mutation CreateReservedGuest($rsvpId: ID, $name: String, $ageRange: String, $mealType: String, $highChairNeeded: Boolean, $notes: String) {
      createReservedGuest(rsvpId: $rsvpId, name: $name, ageRange: $ageRange, mealType: $mealType, highChairNeeded: $highChairNeeded, notes: $notes) {
        id
        name
        ageRange
        mealType
        highChairNeeded
        notes
      }
    }
  `;

  const variables = {
    name,
    ageRange,
    mealType,
    highChairNeeded,
    notes,
  };

  return (await graphqlRequest({ query, variables })).createReservedGuest;
};



const getInviteByCode = async code => {
  const query = `
    query CheckInvite($code: String){
      Invite(code: $code) {
        id
        allowedGuests
        rsvps {
          attending
          phoneNumber
          foodRestrictions
          message
          guests {
            name
            ageRange
            mealType
            highChairNeeded
            notes
          }
        }
        guests {
          name
          isAdult
        }
      }
    }
  `;

  const variables = { code };

  return (await graphqlRequest({ query, variables })).Invite;
};

module.exports = {
  createRsvp,
  createReservedGuest,
  getInviteByCode,
};

function submitRsvpCode() {
  let code = $("#rsvpCode").val();
  console.log("submitted rsvp code:" + code);
  if(code !== null && code != '' ) {
    code = code.trim();
    const promise = getInviteByCode(code);
    promise.then(function(value) {
      console.log(value);
      // expected output: "foo"
    });
  }
}
