import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function UserForm({ agent, onSave }) {
  const [editedAgent, setEditedAgent] = useState({ ...agent });

  const handleSave = () => {
    onSave(editedAgent);
  };

  return (
    <div className="agent-form">
      <TextField
        label="Name"
        value={editedAgent.name}
        onChange={(e) =>
          setEditedAgent({ ...editedAgent, name: e.target.value })
        }
      />
      <TextField
        label="Email"
        value={editedAgent.email}
        onChange={(e) =>
          setEditedAgent({ ...editedAgent, email: e.target.value })
        }
      />
      <FormControl>
        <InputLabel>Role</InputLabel>
        <Select
          value={editedAgent.role}
          onChange={(e) =>
            setEditedAgent({ ...editedAgent, role: e.target.value })
          }
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="sales">Sales</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default UserForm;
