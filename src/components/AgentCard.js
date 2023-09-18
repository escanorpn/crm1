import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function AgentCard({ agent }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{agent.name}</Typography>
        <Typography variant="body2">{agent.email}</Typography>
      </CardContent>
    </Card>
  );
}
