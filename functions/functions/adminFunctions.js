// adminFunctions.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
    origin: ["https://yourdomain.com", "http://localhost:3000"],
  });


exports.adminData = functions.https.onCall(async (data, context) => {
    console.log('hi')
  // Check if the caller is authenticated and the email is correct
  if (!context.auth || context.auth.token.email !== "vector.pn@gmail.com") {
    throw new functions.https.HttpsError("permission-denied", "You don't have access.");
  }

  try {
    // Get a list of all authenticated users
    const listUsers = await admin.auth().listUsers();

    // Prepare user data including custom claims
    const userData = listUsers.users.map((userRecord) => {
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        customClaims: userRecord.customClaims,
      };
    });

    return userData;
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Error retrieving data.");
  }
});

exports.updateCustomClaims = functions.https.onCall(async (data, context) => {
    // Check if the caller is authenticated and has the necessary privileges
   
    if (!context.auth || context.auth.token.email !== "vector.pn@gmail.com") {
        throw new functions.https.HttpsError("permission-denied", "You don't have access.");
      }
    
    // console.log(data)
    const { uid, customClaim } = data;
    const customClaim1={
        a:true,b:false,c:'none'
    }
    try {
      // Update custom claims for the user
      await admin.auth().setCustomUserClaims(uid, customClaim);
      const webhookErrorRef = admin.database().ref('crm/functions-success').push();
      webhookErrorRef.set({
        timestamp: new Date().toISOString(),
        uid:uid,
        customClaims:customClaim,
        method:'update'
        
      })
      .then(() => {
        console.log('Error logged to the database:', error);
      })
      .catch(error => {
        console.error('Error logging error:', error);
      });
      return { message: "Custom claims updated successfully." };
    } catch (error) {
        // Log the error and the received message to the Realtime Database
    
      throw new functions.https.HttpsError("internal", "Error updating custom claims1.",error);
    }
  });
  exports.getCustomClaims = functions.https.onCall(async (data, context) => {
    // Check if the caller is authenticated and has the necessary privileges
    if (!context.auth || context.auth.token.email !== "vector.pn@gmail.com") {
      throw new functions.https.HttpsError("permission-denied", "You don't have access.");
    }
  
    const { uid } = data;
  
    try {
      // Get the custom claims for the user
      const user = await admin.auth().getUser(uid);
      const customClaims = user.customClaims || {};
  
      return { customClaims };
    } catch (error) {
      throw new functions.https.HttpsError("internal", "Error getting custom claims.", error);
    }
  });
  
  exports.deleteCustomClaim = functions.https.onCall(async (data, context) => {
    // Check if the caller is authenticated and has the necessary privileges
    if (!context.auth || context.auth.token.email !== "vector.pn@gmail.com") {
      throw new functions.https.HttpsError("permission-denied", "You don't have access.");
    }
  
    const { uid, key } = data;
  
    try {
      // Get the custom claims for the user
      const user = await admin.auth().getUser(uid);
      const customClaims = user.customClaims || {};
  
      // Delete the specified custom claim
      delete customClaims[key];
  
      // Update the custom claims for the user
      await admin.auth().setCustomUserClaims(uid, customClaims);
  
      return { message: "Custom claim deleted successfully." };
    } catch (error) {
      throw new functions.https.HttpsError("internal", "Error deleting custom claim.", error);
    }
  });
  exports.addCustomClaim = functions.https.onCall(async (data, context) => {
    // Check if the caller is authenticated and has the necessary privileges
    if (!context.auth || context.auth.token.email !== "vector.pn@gmail.com") {
      throw new functions.https.HttpsError("permission-denied", "You don't have access.");
    }
  
    const { uid, customClaimKey, customClaimValue } = data;
  
    try {
      // Get the existing custom claims for the user
      const user = await admin.auth().getUser(uid);
      let customClaims = user.customClaims || {};
  
      // Add or update the custom claim
      customClaims[customClaimKey] = customClaimValue;
  
      // Update the custom claims for the user
      await admin.auth().setCustomUserClaims(uid, customClaims);
  
      return { message: "Custom claim added successfully." };
    } catch (error) {
      const webhookErrorRef = admin.database().ref('crm/functions-error').push();
      webhookErrorRef.set({
        timestamp: new Date().toISOString(),
        error: error.toString(), // Convert error to string
        method: 'add'
      })
      .then(() => {
        console.log('Error logged to the database:', error);
      })
      .catch(error => {
        console.error('Error logging error:', error);
      });
  
      throw new functions.https.HttpsError("internal", "Error adding custom claim.", error.toString()); // Throw error as a string
    }
  });
  exports.addChat = functions.https.onRequest((request, response) => {
    // Validate the secret key
    const secretKey = request.headers.authorization; // Assuming the secret key is passed in the Authorization header
    const secret = process.env.MY_SECRET;
  
    if (secretKey !== 'Bearer ' + secret) {
      return response.status(403).json({ error: 'Unauthorized' });
    }
  
  const { ticketPath, chatPath, data } = request.body;
    // Define an object to store the extracted values
    const extractedValues = {
      assigned: data.assigned || "",
      contact: data.contact || "",
      createdByInfo: {
        displayName: data.createdBy?.displayName || "",
        uid: data.createdBy?.uid || ""
      },
      createdBy: data.createdBy || "",
      profileName: data.profileName || "",
      query: data.query || "",
      status: data.status || "",
      text: data.query || "",
      createdAt: admin.database.ServerValue.TIMESTAMP,
      timestamp: admin.database.ServerValue.TIMESTAMP
    };
    
    // Add a server timestamp to the data.
    data.timestamp = admin.firestore.FieldValue.serverTimestamp();
    
    const db = admin.database();
    const ref = db.ref(chatPath);
    const ticketref = db.ref(ticketPath);
    
    ref.push(extractedValues, (error) => {
      if (error) {
        response.status(500).json({ error: 'Error adding ticket to database' });
      } else {
        response.json({ message: 'Ticket added successfully' });
        
        // Fetch the current value of 'qns' at 'ticketPath'
        ticketref.once('value', (snapshot) => {
          let qns = snapshot.val().qns || 0; // Assuming 'qns' is initialized to 0
          qns++; // Increment the value
  
          // Update 'qns' in the database
          ticketref.update({ qns }, (error) => {
            if (error) {
              response.status(500).json({ error: 'Error updating qns' });
            }
          });
        });
      }
    });
  });
  
  exports.addPackage = functions.https.onRequest((request, response) => {
    // Validate the secret key
    const secretKey = request.headers.authorization; // Assuming the secret key is passed in the Authorization header
    const secret = process.env.MY_SECRET;
    // Replace 'your_secret_key_here' with your actual secret key
    if (secretKey !== 'Bearer ' + secret) {
      return response.status(403).json({ error: 'Unauthorized' });
    }
  
    // Continue with the function logic
    const path = request.body.path;
    const data = request.body.data;
    // Define an object to store the extracted values
const extractedValues = {
  assigned: data.assigned || "", // Use the value from data.assigned, or an empty string if it's not present
  contact: data.contact || "",
  createdBy: {
    displayName: data.createdBy?.displayName || "", // Check if createdBy exists and has displayName
    uid: data.createdBy?.uid || ""
  },
  profileName: data.profileName || "",
  query: data.query || "",
  status: data.status || "",
  text:data.query|| "",
  createdBy:data.createdBy|| "",
  createdAt:admin.database.ServerValue.TIMESTAMP,
  timestamp:admin.database.ServerValue.TIMESTAMP
};

// Add a server timestamp to the extractedValues as "createdAt"
// extractedValues.createdAt = admin.database.ServerValue.TIMESTAMP;
    
    // Add a server timestamp to the data.
    data.timestamp = admin.firestore.FieldValue.serverTimestamp();
  
    const db = admin.database();
    const ref = db.ref(path);
  
    ref.push(extractedValues, (error) => {
      if (error) {
        response.status(500).json({ error: 'Error adding ticket to database' });
      } else {
        response.json({ message: 'Ticket added successfully' });
      }
    });
  });
  
exports.generateSecretMessage = functions.https.onRequest((request, response) => {
  // Generate a secret message
  const secretMessage = generateSecret();
  const secret = process.env.MY_SECRET;
  // Return the secret message in the response
  response.json({ secretMessage, secret});
});

// Function to generate a secret message
function generateSecret() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let secret = '';
  
  for (let i = 0; i < 100; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    secret += characters.charAt(randomIndex);
  }

  return secret;
}
exports.checkAppById = functions.https.onRequest(async (request, response) => {
  const secretKey = request.headers.authorization; // Assuming the secret key is passed in the Authorization header
  const secret = process.env.MY_SECRET; // Replace with your actual secret key
  if (secretKey !== 'Bearer ' + secret) {
    return response.status(403).json({ error: 'Unauthorized' });
  }
  
  const { appId} = request.body;
  // const appId = request.query.appId; // Extract the appId from the query parameter
  console.log(appId)
  try {
    // Check if the app exists in CRM/AppsById/
    const appsByIdRef = admin.database().ref(`crm/AppsById/${appId}`);
    const snapshot = await appsByIdRef.once('value');
    
    if (snapshot.exists()) {
      const appName = snapshot.val().appName; // Get the appName from the snapshot
      // You can return the appName directly
      response.status(200).json({ success: true, appName });
    } else {
      response.status(404).json({ success: false, message: 'App1 not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    response.status(500).json({ success: false, message: 'An error occurred' });
  }
});

