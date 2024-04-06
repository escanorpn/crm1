import React, { useState, useEffect } from "react";
import { ref, set, onValue, remove } from "firebase/database";
import { useSelector } from "react-redux";
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { db,auth } from "../../store/firebase";

const Domain = () => {
  const [user] = useAuthState(auth);

  const DB1 = useSelector((state) => state.app.DB1);
  const DB = useSelector((state) => state.app.DB);
  const selectedAppData = useSelector((state) => state.app.selectedAppData);
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState("");

  useEffect(() => {
    // console.log("user: "+JSON.stringify(user));
    // console.log("DB1: "+DB1);

    if (DB1 && DB ) {
      let userID=user.uid;
      const domainsRef = ref(db, `${DB1}/domains/`);
      console.log("domainsRef: " + domainsRef);
      onValue(domainsRef, (snapshot) => {
        const domainsData = snapshot.val();
        if (domainsData) {
          const domainArray = Object.keys(domainsData).map((key) => ({
            id: key,
            name: key, // Use the domain name as the key
            mdata: domainsData[key],
          }));
          setDomains(domainArray);
        } else {
          setDomains([]);
        }
      });
    }
  }, [DB1, DB]);

  // Modify handleAddDomain function to include user's email
  const handleAddDomain = () => {
    
   
      let userID=user.uid;
      // console.log("userEmail: "+userID)
    if (DB1 && newDomain && DB && selectedAppData ) {
      const domainKey = newDomain.replace(/[.#$/\[\]]/g, "_");
      const domainsRef = ref(db, `${DB1}/domains/${domainKey}`);
      const domainData = {
        db: DB,
        type: selectedAppData.selectedOption,
        name: domainKey,
      };
  
      set(domainsRef, domainData)
        .then(() => {
          setNewDomain("");
        })
        .catch((error) => {
          console.error("Error adding domain:", error);
        });
    }
  };
  const handleDeleteDomain = (id) => {
    if (DB1 && DB) {
      const domainKey = id;
      const domainsRef = ref(db, `${DB1}/domains/${domainKey}`);

      remove(domainsRef)
        .catch((error) => {
          console.error("Error deleting domain:", error);
        });
    }
  };

  return (
    <div>
      <TextField
        label="Domain Name"
        variant="outlined"
        value={newDomain}
        onChange={(e) => setNewDomain(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddDomain}
      >
        Add Domain
      </Button>

      <Grid container spacing={2}>
        {domains &&
          domains.length > 0 &&
          domains.map((domain) => (
            <Grid item key={domain.id} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{domain.name}</Typography>
                  {domain.mdata && (
                    <div>
                      <Typography variant="body1">db: {domain.mdata.db}</Typography>
                      <Typography variant="body1">type: {domain.mdata.type}</Typography>
                    </div>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteDomain(domain.id)}
                  >
                    Delete
                  </Button>
                  {/* Add any additional actions for domains if needed */}
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default Domain;
