import React, { useState, useEffect } from 'react';
import { ref, push, remove, update, onValue, serverTimestamp, set } from 'firebase/database';
import { db,  auth } from '../../store/firebase';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {Typography} from '@mui/material'

import { useAuthState } from 'react-firebase-hooks/auth';

function TaskTable() {
  const selectedAppID = useSelector(state => state.app.selectedAppID);
  const DB = useSelector(state => state.app.DB);
  const tasksRef = ref(db, `${DB}/tasks/`);
  const agentsRef = ref(db, `${DB}/agents/`);
  const logsRef = ref(db, `${DB}/logs/`);
  const [tasks, setTasks] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [user] = useAuthState(auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Dialog form state
  const [dialogNewTask, setDialogNewTask] = useState('');
  const [dialogDueDate, setDialogDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dialogAssignee, setDialogAssignee] = useState('');
  const [dialogAssigneeId, setDialogAssigneeId] = useState('');
  const [dialogStatus, setDialogStatus] = useState('pending');
  const [editDialogName, setEditDialogName] = useState('');
  const [editDialogDueDate, setEditDialogDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [editDialogStatus, setEditDialogStatus] = useState('');
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [taskLogs, setTaskLogs] = useState([]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogNewTask('');
    setDialogDueDate(new Date().toISOString().split('T')[0]);
    setDialogAssignee('');
    setDialogAssigneeId('');
    setDialogStatus('pending');
  };

  const openEditDialog = task => {
    setIsEditDialogOpen(true);
    setSelectedRow(task);
    setEditDialogName(task.title);
    setEditDialogDueDate(task.dueDate);
    setEditDialogStatus(task.status === 0 ? 'pending' : 'done');
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedRow(null);
    setEditDialogName('');
    setEditDialogDueDate(new Date().toISOString().split('T')[0]);
    setEditDialogStatus('');
  };

  useEffect(() => {
    console.log('uid= ',user.uid)
    setTasks([])
    setAgents([])
    if(selectedAppID){
    const tasksRef = ref(db, `${DB}/tasks`);
    const agentsRef = ref(db, `${DB}/agents`);
    
    const unsubscribeTasks = onValue(tasksRef, snapshot => {
      if (snapshot.exists()) {
        const tasksData = snapshot.val();
        const taskArray = Object.entries(tasksData || {}).map(([taskId, taskData]) => ({
          id: taskId,
          ...taskData,
        }));
        setTasks(taskArray);
      }
    });

    const unsubscribeAgents = onValue(agentsRef, snapshot => {
      if (snapshot.exists()) {
        const agentsData = snapshot.val();
        const agentArray = Object.entries(agentsData || {}).map(([agentId, agentData]) => ({
          id: agentId,
          ...agentData,
        }));
        setAgents(agentArray);
      }
    });

    return () => {
      unsubscribeTasks();
      unsubscribeAgents();
    };
  }
  }, [selectedAppID]);

  useEffect(() => {
   
      const logsRef = ref(db, `${DB}/logs`);
      const unsubscribeLogs = onValue(logsRef, snapshot => {
        if (snapshot.exists()) {
          const logsData = snapshot.val();
          const logsArray = Object.entries(logsData || {}).map(([logId, logData]) => ({
            id: logId,
            ...logData,
          }));
          setTaskLogs(logsArray);
        } else {
          setTaskLogs([]);
        }
      });

      return () => {
        unsubscribeLogs();
      };
    
  }, [selectedAppID]);

  const logAction = (taskId, action) => {
    const newLogRef = push(logsRef.child(taskId));
    const logData = {
      action,
      by: {
        uid: user.uid,
        displayName: user.displayName,
      },
      timestamp: serverTimestamp(),
    };
    set(newLogRef, logData);
  };

  const handleAddTask = async () => {
    console.log(selectedAppID, DB)
    if (!selectedAppID || dialogNewTask.trim() === '' || dialogAssignee.trim() === '') {
      return;
    }

    try {
      setIsLoading(true);
      const newTaskRef = push(tasksRef);
      const newTaskData = {
        title: dialogNewTask,
        dueDate: dialogDueDate,
        assignee: dialogAssignee,
        assigneeId: dialogAssigneeId,
        status: dialogStatus === 'pending' ? 0 : 100,
        createdBy: {
          uid: user.uid,
          displayName: user.displayName,
        },
        createdAt: serverTimestamp(),
      };
      await set(newTaskRef, newTaskData);
      // logAction(newTaskRef.key, 'Task created');
      closeDialog();
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      closeDialog();
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = async () => {
    if (!selectedRow || editDialogName.trim() === '') {
      return;
    }

    try {
      setIsLoading(true);
      const taskRef = ref(db, `${DB}/tasks/${selectedRow.id}`);
      const updatedTaskData = {
        title: editDialogName,
        dueDate: editDialogDueDate,
        assignee: selectedRow.assignee,
        assigneeId: selectedRow.assigneeId,
        status: editDialogStatus === 'pending' ? 0 : 100,
        createdBy: selectedRow.createdBy,
        createdAt: selectedRow.createdAt,
      };
      await update(taskRef, updatedTaskData);
      // logAction(selectedRow.id, 'Task edited');
      setSelectedRow(null);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      closeEditDialog();
    } catch (error) {
      console.error('Error editing task:', error);
      closeEditDialog();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async taskId => {
    const tasksRef = ref(db, `${DB}/tasks/${taskId}`);

    try {
      setIsLoading(true);
      await remove(tasksRef);
      // logAction(taskId, 'Task deleted');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowEditClick = task => {
    openEditDialog(task);
  };

  const handleViewLogsClick = () => {
    setLogsDialogOpen(true);
  };

  const closeLogsDialog = () => {
    setLogsDialogOpen(false);
  };

  return (
    <div style={{ width: '100%' }}>
        <Card className="agent-card">
      <CardContent>
        
      <Paper style={{ height: 400, width: '100%' }}>
        {isLoading ? (
          <Skeleton animation="wave" height={400} />
        ) : (
        
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleRowEditClick(task)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>{task.status === 0 ? 'Pending' : 'Done'}</TableCell>
                    <TableCell>
                      {user.uid === task.createdBy.uid && (
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      </CardContent>
      </Card>
      <div>
        <Button variant="contained" color="primary" onClick={openDialog}>
          Add Task
        </Button>
        

      </div>
     
      {/* Add Task Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={dialogNewTask}
              onChange={e => setDialogNewTask(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Due Date"
              type="date"
              value={dialogDueDate}
              onChange={e => setDialogDueDate(e.target.value)}
              margin="normal"
              fullWidth
            />
            <DialogContentText>Assignee</DialogContentText>
            <Select
              value={dialogAssignee}
              onChange={e => setDialogAssignee(e.target.value)}
              fullWidth
            >
              {agents.map(agent => (
                <MenuItem key={agent.id} value={agent.name}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
            <DialogContentText>Status</DialogContentText>
            <Select
              value={dialogStatus}
              onChange={e => setDialogStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
            {isLoading && <LinearProgress />}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleAddTask}>
              Add Task
            </Button>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Description"
              value={editDialogName}
              onChange={e => setEditDialogName(e.target.value)}
              margin="normal"
              fullWidth
            />
            <TextField
              label="Due Date"
              type="date"
              value={editDialogDueDate}
              onChange={e => setEditDialogDueDate(e.target.value)}
              margin="normal"
              fullWidth
            />
            <DialogContentText>Status</DialogContentText>
            <Select
              value={editDialogStatus}
              onChange={e => setEditDialogStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
            {isLoading && <LinearProgress />}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleEditTask}>
              Save
            </Button>
            <Button onClick={closeEditDialog} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      <Dialog open={logsDialogOpen} onClose={closeLogsDialog}>
        <DialogTitle>Task Logs</DialogTitle>
        <DialogContent>
          {taskLogs.map(log => (
            <div key={log.id}>
              {log.action} by {log.by.displayName} at {new Date(log.timestamp).toLocaleString()}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {isLoading && <LinearProgress />}
      {!selectedAppID && (
        <div>Please select an app in the navigation drawer.</div>
      )}
      {showSuccessMessage && (
        <div style={{ color: 'green' }}>Operation succeeded!</div>
      )}
    </div>
  );
}

export default TaskTable;
