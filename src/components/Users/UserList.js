import React, { useEffect, useState } from 'react';
import AgentCard from './UserCard';
import { onValue, ref } from 'firebase/database';
import { db, } from '../../store/firebase';
import { useSelector } from 'react-redux'; 

function UserList() {
  const [agents, setAgents] = useState([]);
  const selectedAppID = useSelector(state => state.app.selectedAppID);
  const DB = useSelector(state => state.app.DB);
  const agentsRef = ref(db, `${DB}/agents`);

  useEffect(() => {
    console.log(`${DB}/agents`)
    
    // Set up a listener to listen for data changes
    const unsubscribe = onValue(agentsRef, (snapshot) => {
      const agentsData = snapshot.val();
      const agentsArray = agentsData ? Object.values(agentsData) : [];
      setAgents(agentsArray);
    });
console.log(selectedAppID)
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [selectedAppID]);

  return (
    <div className="agent-list">
      <h2>Agents</h2>
     
      <AgentCard  rows={agents} />
    </div>
  );
}

export default UserList;
