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
  let id = guestNum;
  return  '   <div id="'+ id + '" class="guest-form-group row">  '  +
 '                                 <input id="'+ id + '-isAdult" name="isAdult" type="hidden" value="">  '  +
 '                                 <div class="control-group form-group col-xs-12 col-sm-6 col-md-5">  '  +
 '                                     <input id="'+ id + '-name" name = "name" type="text" class="form-control" placeholder="Name" required>  '  +
 '                                     <p class="help-block text-danger"></p>  '  +
 '                                 </div>  '  +
 '     '  +
 '                                 <div class="control-group form-group col-xs-12 col-sm-6 col-md-3">  '  +
 '                                   <div class="row space-between"  id="'+ id + '-rsvp">  '  +
 '                                     <div class = "center-vertical">  '  +
 '                                       <input type="radio" name="isAccept" value="true" required>  '  +
 '                                       <label for="accept">Accept</label>  '  +
 '                                     </div>  '  +
 '                                     <div class = "center-vertical">  '  +
 '                                       <input type="radio" name="isAccept" value="false" required>  '  +
 '                                       <label for="decline">Decline</label></div>  '  +
 '                                   </div>  '  +
 '                                 </div>  '  +
 '  </div>  ' ;
}

function getChildGuestHtml(guestNum) {
  let id = guestNum;
  return  '               <div class="col-xs-12 col-sm-6 col-md-4">  '  +
 '                                   <div class = "space-between">  '  +
 '                                     <div class="control-group form-group">  '  +
 '                                       <div>  '  +
 '                                         <label>Age:<label>  '  +
 '                                         <select class="age-range" id="'+ id + '-age" required>  '  +
 '                                           <option value="default">Select Age</option>  '  +
 '                                           <option value="13+">13+</option>  '  +
 '                                           <option value="10-12">10-12</option>  '  +
 '                                           <option value="5-9">5-9</option>  '  +
 '                                           <option value="0-4">0-4</option>  '  +
 '                                         </select>  '  +
 '                                         <p class="help-block text-danger"></p>  '  +
 '                                       </div>  '  +
 '                                     </div>  '  +
 '                                     <div class="control-group form-group">  '  +
 '                                       <label>Meal:<label>  '  +
 '                                       <div>  '  +
 '                                         <select class="meal-selection" id="'+ id + '-meal" required >  '  +
 '                                           <option value="default">Select Meal</option>  '  +
 '                                           <option value="kid">Kids Meal</option>  '  +
 '                                           <option value="adult">Adult Meal</option>  '  +
 '                                           <option value="infant">No Meal</option>  '  +
 '                                         </select>  '  +
 '                                       </div>  '  +
 '                                     </div>  '  +
 '                                     <div class="control-group form-group">  '  +
 '                                       <label class="control control-checkbox">Needs High Chair  '  +
 '                                       <input type="checkbox"  id="'+ id + '-high-chair" class="high-chair" name="highChair" value="needsHighChair">  '  +
 '                                       <div class="control_indicator"></div>  '  +
 '                                       </label>  '  +
 '                                     </div>  '  +
 '     '  +
 '                                   </div>  '  +
 '                                </div>  ' ;

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
    let guest = guestArray[num];
    let guestId = getGuestIdSelector(num);
    let guestHtml = getGuestHtml(guestId);
    $(guestNameWrapper).append(guestHtml);
    $("#" + getGuestIdSelector(num) + "-name").val(guest.name);
    console.log("guest is adult? " + guest.isAdult);

    if(guest.isAdult == false){
      console.log("child");
      let childGuestHtml = getChildGuestHtml(guestId);
      $("#" + getGuestIdSelector(num)).append(childGuestHtml);
      $("#" + getGuestIdSelector(num) + "-isAdult").val(false);
    } else {
      console.log("adult");
      $("#" + getGuestIdSelector(num) + "-isAdult").val(true);
    }
  }

}
