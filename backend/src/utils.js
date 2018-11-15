/**
 * If atleast one of the permissions needed is found on the user, they may continue
 * @param {object} user - currently signed in user
 * @param {array} permissionsNeeded - permissions needed to access a certain resource on the backend
 */
function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

    : ${permissionsNeeded}

    You Have:

    ${user.permissions}
    `);
  }
}

/**
 * Throw an error if the user is not logged in
 * @param {object} request object being sent from the client
 */
function requiresLogin(req) {
  if (!req.userId) {
    throw new Error('You must be logged in to do that!');
  }
}

/**
 * Before performing an action, see if a user owns the item or has permission
 * @param {object} item - item being updated
 * @param {object} user - user making the request
 * @param {array} permissionsNeeded - permissions needed to update an item
 */
function ownsItemOrPermission(item, user, permissionsNeeded) {
  const ownsItem = item.user.id === user.id;
  const permissionGranted = user.permissions.some(permission =>
    permissionsNeeded.includes(permission)
  );
  if (!ownsItem && !permissionGranted) {
    throw new Error('Hey, you dont have permission to do that!');
  }
}

exports.hasPermission = hasPermission;
exports.requiresLogin = requiresLogin;
exports.ownsItemOrPermission = ownsItemOrPermission;
