import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Button, Avatar, LinearProgress } from '@mui/material';
import { remove, ref, get } from 'firebase/database';
import { db, auth } from '../../store/firebase';
import { useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = () => {
  const DB = useSelector((state) => state.app.DB);
  const [user] = useAuthState(auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Retrieve the agents from {DB}/agents
    const agentsRef = ref(db, `${DB}/agents`);
    get(agentsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const agentsData = snapshot.val();
          const matchingAgent = Object.entries(agentsData).find(([key, agent]) => agent.email === user.email);
          console.log(agentsData)
          if (matchingAgent) {
            const [agentKey, agentValue] = matchingAgent;
            const agentWithKey = { aid: agentKey, ...agentValue };
            console.log(agentWithKey)
            setAgent(agentWithKey);
          }
        }
      })
      .catch((error) => {
        console.error('Error retrieving agents:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [DB, user.email]);


  const handleRemoveAccount = async () => {
   
   
    setIsDeleting(true);
   if(agent){
     // Delete the agent node at `${DB}/agents/{agent.id}`
     const agentRef = ref(db, `${DB}/agents/${agent.aid}`);
     remove(agentRef)
       .then(() => {
         console.log('Agent node deleted successfully.');
       })
       .catch((error) => {
         console.error('Error deleting agent node:', error);
       });
 
   }
//    console.log(user.uid)
//    console.log(agent)
//    return;
    // Delete the user node at `crm/users/{user.uid}`
    const userRef = ref(db, `crm/users/${user.uid}`);
    remove(userRef)
      .then(() => {
        console.log('User node deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting user node:', error);
      });
    
    // Sign out the user (you may need to replace this with your authentication library's sign-out method)
    auth.signOut();
  };

  return (
    <Grid container spacing={2}>
      <LinearProgress style={{ visibility: loading ? 'visible' : 'hidden' }} />
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Avatar src={user.photoURL} alt={user.displayName} sx={{ width: 100, height: 100 }} />
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography variant="h5">{user.displayName}</Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRemoveAccount}
        //   disabled={isDeleting}
        >
          {isDeleting ? 'Removing Account...' : 'Remove Account'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default Profile;
