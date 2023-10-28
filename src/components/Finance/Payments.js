import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Payments = ({ payment }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          Payment Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Address: {payment.Address ? payment.Address : 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Amount: {payment.Amount ? payment.Amount : 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sms: {payment.Sms ? payment.Sms : 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Unique Code: {payment.uniqueCode ? payment.uniqueCode : 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <Tooltip title="Copy Address to Clipboard">
            <IconButton
              aria-label="copy"
              onClick={() => {
                navigator.clipboard.writeText(payment.Address || '');
              }}
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Payments;
