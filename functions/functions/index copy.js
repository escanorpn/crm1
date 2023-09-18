const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { adminData, updateCustomClaims,getCustomClaims, deleteCustomClaim,addCustomClaim} = require("./adminFunctions");
const cors = require("cors")({ origin: ["https://yourdomain.com", "http://localhost:3000"] });

admin.initializeApp();

exports.webhookHandler1 = functions.https.onRequest((request, response) => {
  console.log('RequestData')
  if (request.method === 'GET') {
    console.log('GET')
    handleGetVerification(request, response);
  } else if (request.method === 'POST') {
    console.log('POST')
    handlePostData(request, response);
  } else {
    response.status(405).send('Method Not Allowed');
  }
});

function handleGetVerification(req, res) {
  // ... (existing code)
  const VERIFY_TOKEN='abcd'
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = req.query['hub.verify_token'];

  if (mode === 'subscribe' && verifyToken === VERIFY_TOKEN) {
    console.log('Verification successful');
    res.status(200).send(challenge);
  } else {
    console.log('Verification failed');
    res.sendStatus(403);
  }

}

function sendBotResponse(token,message, recipientWAID,code=1, userData={}) {
  const version = 'v17.0';
  const phoneNumberID = '118868224638325';
  const payload={
    
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientWAID,
      type: "text",
      text: { // the text object
        "preview_url": false,
        body: message
        }
    
  }

  const https = require('https');
  const options = {
    hostname: 'graph.facebook.com',
    path: `/${version}/${phoneNumberID}/messages`,
    method: 'POST',
    headers: {
      
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  };

  const req = https.request(options, res => {
    if (res.statusCode === 200) {
      console.log('Bot response sent:', res.statusCode);
      if(code==2){
            // Update the status to verified in the database
            const statusRef = admin.database().ref(`crm/whatsapp/${userData.metad}/status`);
           
            statusRef.set('verified').then(() => {
              const responseMessage = `The account ${recipientWAID} has been successfully!! verified. 
              You can now use it to send and receive data`;
              sendBotResponse(token,responseMessage, recipientWAID);
              console.log('Status updated to verified.');
              
            const verificationCodeRef = admin.database().ref(`crm/whatsapp/${userData.metad}`);
            verificationCodeRef.update({ verificationCode: null }).then(() => {
              console.log('Verification code set to null.');
            });
            });
      }
  
    } else {
      console.error('Error sending bot response. Status code:', res.statusCode);
      // Log the error and the received message to the Realtime Database
      const webhookErrorRef = admin.database().ref('crm/webhook-errors').push();
      webhookErrorRef.set({
        timestamp: new Date().toISOString(),
        error: 'Error sending bot response. Status code: ' + res.statusCode,
        message: message,
        recipientWAID: recipientWAID,
        options:options,
        payload:payload
      })
      .then(() => {
        console.log('Error logged to the database.');
      })
      .catch(error => {
        console.error('Error logging error:', error);
      });
    }
  });

  req.on('error', error => {
    console.error('Error sending bot response:', error);
    // Log the error and the received message to the Realtime Database
    const webhookErrorRef = admin.database().ref('crm/webhook-errors').push();
    webhookErrorRef.set({
      timestamp: new Date().toISOString(),
      error: error.toString(),
      message: message,
      recipientWAID: recipientWAID
    })
    .then(() => {
      console.log('Error logged to the database:', error);
    })
    .catch(error => {
      console.error('Error logging error:', error);
    });
  });

  req.write(JSON.stringify(payload));
  req.end();
}

function handlePostData(request, response){
  console.log('Postdata')
  const data = request.body;
  const metad = request.query.metad;

  if (data.object === 'whatsapp_business_account' && data.entry && data.entry.length > 0) {
    const entry = data.entry[0];
  
    // Check if 'changes' array exists and contains at least one entry
    if (entry.changes && entry.changes.length > 0) {
      const firstChange = entry.changes[0];
  
      // Check if the first change has a 'value' property
      if (firstChange.value) {
        // Extract messaging product, metadata, and contacts from the first change's value
        const messagingProduct = firstChange.value.messaging_product;
        const metadata = firstChange.value.metadata;
        const contacts = firstChange.value.contacts;
  
        // Check if 'messages' array exists and contains at least one entry
        if (firstChange.value.messages && firstChange.value.messages.length > 0) {
          const firstMessage = firstChange.value.messages[0];
  
          // Check if the first message has a 'text' property and extract its 'body'
          if (firstMessage.text && firstMessage.text.body) {
            const messages = firstMessage.text.body;
  
            // Now you have extracted all the necessary information
            // You can use the extracted data for further processing
         
  

    // Extract information from the first contact
    let profileName = '';
    let recipientWAID = '';
    if (contacts && contacts.length > 0) {
      profileName = contacts[0].profile.name;
      recipientWAID = contacts[0].wa_id;
    }

    const verificationCodeRef = admin.database().ref(`crm/whatsapp/${metad}`);
    verificationCodeRef.once('value').then(snapshot => {
      const storedData = snapshot.val();
      const storedCode = storedData.verificationCode;
      const status = storedData.status;
      const Token = storedData.Token;
      
      console.log('msg: ',messages);
    if (messages.includes('passCode=')) {
      const receivedCode = messages.split('passCode=')[1];

        if(status!=='verified'){
          if (receivedCode === storedCode ) {
            const userData={
              metad:metad,
              profileName:profileName
            }
            const responseMessage = `Hi ${userData.profileName}, Processing...`;
            sendBotResponse(Token, responseMessage, recipientWAID,2, userData);
        
          }else{
            const responseMessage = `Invalid passcode`;
          sendBotResponse(Token, responseMessage, recipientWAID);
          }
         
        }else{
          const responseMessage = `This account is already verified`;
          sendBotResponse(Token, responseMessage, recipientWAID);
        }

    
    }else{
      handleCommonGreetings(Token, messages, recipientWAID,metad,profileName)
    }
    });
      // Log successful message to the Realtime Database
      const webhookSuccessRef = admin.database().ref('crm/webhook-received').push();
      webhookSuccessRef.set({
        timestamp: new Date().toISOString(),
        message: messages,
        recipientWAID: recipientWAID
      })
      .then(() => {
        console.log('Successful message logged to the database.');
      })
      .catch(error => {
        console.error('Error logging successful message:', error);
      });
      if (messages !== '1' && messages !== '2' && messages !== '3') {
      const webhookDataRef1 = admin.database().ref(`crm/webhooks/${metad}/${recipientWAID}`);

        const newData = {
          timestamp: new Date().toISOString(),
          messagingProduct: messagingProduct,
          metadata: metadata,
          profileName: profileName,
          recipientWAID: recipientWAID,
          messages: messages,
          // You can include other relevant data as needed
        };

        webhookDataRef1.update(newData)
          .then(() => {
            console.log('Webhook data updated in the database.');
            response.status(200).send('Data updated and response sent successfully.');
          })
          .catch(error => {
            console.error('Error updating webhook data:', error);
            response.status(500).send('Error updating data.');
      });
      }
    } else {
      // Handle case where 'body' property is missing in the first message
      console.error('Missing "body" property in the first message');
    }
    } else {
    // Handle case where 'messages' array is missing or empty
    console.error('No messages found in the webhook data');
    }
    } else {
    // Handle case where 'value' property is missing in the first change
      console.error('Missing "value" property in the first change');
      }
    } else {
    // Handle case where 'changes' array is missing or empty
    console.error('No changes found in the webhook data');
    }
  } else {
    response.status(400).send('Invalid data format or missing information.');
  }
}
function logConvo(messages,metad,recipientWAID,messagingProduct,profileName){
   // Log the data to the Realtime Database
   const webhookDataRef = admin.database().ref(`crm/webhooks/${metad}/${recipientWAID}`).push();
   webhookDataRef.set({
     timestamp: new Date().toISOString(),
     messagingProduct: messagingProduct,
    //  metadata: metadata,
     profileName: profileName,
     recipientWAID: recipientWAID,
     messages: messages,
     // You can include other relevant data as needed
   })
   .then(() => {
     console.log('Webhook data logged to the database.');
     response.status(200).send('Data logged and response sent successfully.');
   })
   .catch(error => {
     console.error('Error logging webhook data:', error);
     response.status(500).send('Error logging data.');
   });
}
function handleCommonGreetings(Token, messageText, recipientWAID, metad, profileName) {
  const commonGreetings = ['hi', 'hello', 'sasa']; // Add more common greetings as needed

  if (commonGreetings.includes(messageText.toLowerCase())) {
    const responseMessage = `Hi ${profileName}, how can I help you?`;
    sendBotResponse(Token, responseMessage, recipientWAID);
  } else {
    handleMenuOptions(Token, messageText, recipientWAID, metad, profileName);
  }
}
function handleMenuOptions(Token, messageText, recipientWAID,metad,profileName) {

    if (messageText === '1') {
      // const responseMessage = `Issue logged. Thank you, ${profileName}!`;
      const webhookDataRef = admin.database().ref(`crm/webhooks/${metad}/${recipientWAID}`);

  webhookDataRef.once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messages = data.messages;
        console.log('Messages:', messages);
        
      handleTicketCreation(Token, messages,recipientWAID,metad,profileName)
        // Process the messages as needed
      } else {
        console.log('No messages found for the specified recipientWAID.');
      }
    })
    .catch(error => {
      console.error('Error retrieving messages:', error);
    });
    } else if (messageText === '2') {
      const responseMessage = `Okay, please state your query:`;
      sendBotResponse(Token, responseMessage, recipientWAID);
    } else if (messageText === '3') {
      const responseMessage = `Okay, thank you and have a nice day!`;
      sendBotResponse(Token, responseMessage, recipientWAID);
    } else {
      const responseMessage = `would you like me to log the issue \n*${messageText}*?\n1: Yes\n2: Enter new Query\n3: Never mind`;
      sendBotResponse(Token, responseMessage, recipientWAID);
    }
}

function handleTicketCreation(Token, messageText, recipientWAID, metad,profileName) {
  const ticketRef = admin.database().ref(`crm/tickets/${metad}`);
  // const timestamp = new Date().toISOString();
  const timestamp = admin.database.ServerValue.TIMESTAMP;

  const createdBy = { displayName: 'whatsapp' };
  const status = 'open';
  const query = messageText;

  const ticketData = {
    createdAt: timestamp,
    createdBy: createdBy,
    status: status,
    query: query,
    contact:recipientWAID,
    contactName:profileName,
  };

  ticketRef.push(ticketData)
    .then(() => {
      const confirmationMessage = 'Your ticket has been created. Thank you for your query.';
      sendBotResponse(Token, confirmationMessage, recipientWAID);
    })
    .catch(error => {
      console.error('Error creating ticket:', error);
      const errorMessage = 'An error occurred while creating your ticket. Please try again later.';
      sendBotResponse(Token, errorMessage, recipientWAID);
    });
}
exports.adminData = adminData;
exports.updateCustomClaims = updateCustomClaims;
exports.getCustomClaims = getCustomClaims;
exports.deleteCustomClaim = deleteCustomClaim;
exports.addCustomClaim=addCustomClaim;
