// require('es6-promise').polyfill();
// require('isomorphic-fetch');
// require('angular');
//
// var myApp = angular.module('rsvpApp', [], function($interpolateProvider) {
//   $interpolateProvider.startSymbol('[[');
//   $interpolateProvider.endSymbol(']]');
// });
//
// function appController($scope) {
//   $scope.name = 'Robin Hood';
// }

$(document).ready(function() {
  $("#rsvpFormContainer").hide();
});


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


async function getInviteByCode(code) {
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
}

// const getInviteByCode = async code => {
//   const query = `
//     query CheckInvite($code: String){
//       Invite(code: $code) {
//         id
//         allowedGuests
//         rsvps {
//           attending
//           phoneNumber
//           foodRestrictions
//           message
//           guests {
//             name
//             ageRange
//             mealType
//             highChairNeeded
//             notes
//           }
//         }
//         guests {
//           name
//           isAdult
//         }
//       }
//     }
//   `;
//
//   const variables = { code };
//
//   return (await graphqlRequest({ query, variables })).Invite;
// };

module.exports = {
  createRsvp,
  createReservedGuest,
  getInviteByCode,
};

function getGuestHtml(guestNum){
  let id = getGuestIdSelector(guestNum);
  return '<div class="guest-form-group row">  '  +
   '                                     <div class="control-group form-group col-xs-6 col-md-4">  '  +
   '                                         <input type="text" id="' + id + '"'+ 'class="form-control guest-name" placeholder="Name" required data-validation-required-message="Please enter your name.">  '  +
   '                                         <p class="help-block text-danger"></p>  '  +
   '                                     </div>  '  +
   '                                     <div class="control-group form-group col-xs-6 col-md-4">  '  +
   '                                      <div class="row">' +
   '                                       <div class="col-md-6"><input type="radio" name="isAccept" value="true">Attend<br></div>  '  +
   '                                       <div class="col-md-6"><input type="radio" name="isAccept" value="false">Decline<br></div>  '  +
   '                                         <p class="help-block text-danger"></p>  '  +
   '                                        </div>  '  +
   '                                     </div>  '  +
   '                                  </div>  ' ;
}

function getGuestIdSelector(guestNum) {
  return "guest-num-" + guestNum;
}



function submitRsvpCode() {
  let code = $("#rsvpCode").val();
  console.log("submitted rsvp code:" + code);
  if(code !== null && code != '' ) {
    code = code.trim();
    const promise = getInviteByCode(code);
    promise.then(function(value) {
      console.log(value);
      $("#rsvpFormContainer").show();
      fillRsvpForm(value);
    });
  }
}

function fillRsvpForm(value) {
  const guestNameWrapper = $("#guestContainer");
  let guestNum = value.guests.length;
  let guestArray = value.guests;


  for (var num = 0; num < guestNum; num++ ) {
    let guestHtml = getGuestHtml(num);
    $(guestNameWrapper).append(guestHtml);
    $("#" + getGuestIdSelector(num)).val(guestArray[num].name);
  }

}
