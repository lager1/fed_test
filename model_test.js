// --------------------------------------------------------------------------------------
var exp = {};
// --------------------------------------------------------------------------------------
exp.getIdentityProvider = function(entityID)
{
  console.log("getIdentityProvider");
  return new Promise(function (fullfill, reject) {
    fullfill(null);
  });
}
// --------------------------------------------------------------------------------------
exp.storeRequestID = function(requestID, idpConfig)
{
  console.log("storeRequestID");
  return new Promise(function (fullfill, reject) {
    fullfill(null);
  });
}
// --------------------------------------------------------------------------------------
exp.verifyInResponseTo = function(requestID, idpConfig)
{
  console.log("verifyInResponseTo");
  return new Promise(function (fullfill, reject) {
    fullfill(null);
  });
}
// --------------------------------------------------------------------------------------
exp.invalidateRequestID = function(requestID, idpConfig)
{
  console.log("invalidateRequestID");
  return new Promise(function (fullfill, reject) {
    fullfill(null);
  });
}
// --------------------------------------------------------------------------------------
module.exports = exp;
// --------------------------------------------------------------------------------------
