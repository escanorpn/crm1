import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { update, remove } from 'firebase/database';
import { db, } from '../../store/firebase';
import Button from '@mui/material/Button';
import AgentForm from './UserForm';
import { ref } from 'firebase/database';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useSelector } from 'react-redux'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserCard({ rows }) {
  const [editing, setEditing] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Add state for delete dialog
  const [agentToDelete, setAgentToDelete] = useState(null); // Store the agent to be deleted
  const selectedAppID = useSelector(state => state.app.selectedAppID);
  const DB = useSelector(state => state.app.DB);

  const handleUpdateAgent = async (updatedAgent) => {
    if (editingAgent) {
      const agentRef = ref(db, `${DB}/agents/${editingAgent.id}`);
      try {
        await update(agentRef, updatedAgent);
        setEditing(false);
        setEditingAgent(null);
        console.log('Agent updated successfully.');
      } catch (error) {
        console.error('Error updating agent:', error);
      }
    }
  };

  // const handleDeleteAgent = async (agentId) => {
  //   const agentRef = ref(db, `${DB}/agents/${agentId}`);
  //   try {
  //     await remove(agentRef);
  //     setDeleteDialogOpen(false); // Close the dialog
  //     setAgentToDelete(null); // Clear the agent to be deleted
  //     console.log('Agent deleted successfully.');
  //   } catch (error) {
  //     console.error('Error deleting agent:', error);
  //   }
  // };
  const handleDeleteAgent = () => {
    let agent=agentToDelete;
    console.log(agent)
    return;
    // Delete the agent node at `${DB}/agents/{agent.aid}`
    const agentRef = ref(db, `${DB}/agents/${agent.aid}`);
    remove(agentRef)
      .then(() => {
        console.log('Agent node deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting agent node:', error);
      });
  
    // Delete the user node at `crm/users/{agent.uid}`
    const userRef = ref(db, `crm/users/${agent.uid}`);
    remove(userRef)
      .then(() => {
        console.log('User node deleted successfully.');
      })
      .catch((error) => {
        console.error('Error deleting user node:', error);
      });
  
    // After deletion, close the dialog
    setDeleteDialogOpen(false);
  };

  const handleOpenDeleteDialog = (agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
    console.log(agent)
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

  return (
    <Card className="agent-card">
      <CardContent>
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
        >
          <DialogTitle>Delete Agent</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this agent?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteAgent(agentToDelete.id)}
              color="secondary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        {editing ? (
          <AgentForm agent={editingAgent} onSave={handleUpdateAgent} />
        ) : (
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Actions</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Role</TableCell>
                  <TableCell align="right">Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((agent) => (
                  <TableRow
                    key={agent.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="right">
                      {!editing && (
                        <>
                          <DeleteIcon onClick={() => handleOpenDeleteDialog(agent)} />
                        </>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {agent.name}
                    </TableCell>
                    <TableCell align="right">{agent.email}</TableCell>
                    <TableCell align="right">{agent.role}</TableCell>
                    <TableCell align="right">
                      {!editing && (
                        <>
                          <EditIcon
                            onClick={() => {
                              setEditing(true);
                              setEditingAgent(agent);
                            }}
                          />
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
