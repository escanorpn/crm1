const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { adminData, updateCustomClaims,getCustomClaims, deleteCustomClaim,addCustomClaim,addPackage,generateSecretMessage,addChat} = require("./adminFunctions");
const cors = require("cors")({ origin: ["https://yourdomain.com", "http://localhost:3000"] });

admin.initializeApp();

exports.adminData = adminData;
exports.updateCustomClaims = updateCustomClaims;
exports.getCustomClaims = getCustomClaims;
exports.deleteCustomClaim = deleteCustomClaim;
exports.addCustomClaim=addCustomClaim;
exports.addPackage=addPackage;
exports.generateSecretMessage=generateSecretMessage;
exports.addChat=addChat;