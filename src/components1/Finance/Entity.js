import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HomeIcon from '@mui/icons-material/Home';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Entity = ({
  data,
  handlePaymentsClick,
  handleCardClick,
  copyBillCode,
  calculateDaysRemaining,
  formatTimestamp,
  truncateBillCode,
}) => {
  return (
    <Card>
      <CardContent>
        <div>
          <Chip
            icon={<HomeIcon />}
            label={<Typography variant="body2">{data.name ? data.name : 'N/A'}</Typography>}
            size="small"
            style={{ marginBottom: '8px' }}
          />
        </div>
        {/* <div>
          <Typography color="textSecondary" gutterBottom>
            {data.location ? (
              <Chip icon={<LocationOnIcon />} label={data.location} />
            ) : (
              ''
            )}
          </Typography>
        </div> */}
        <div>
          {data.unitCount !== undefined && data.unitCount > 0 && (
            <Typography variant="caption" color="textSecondary">
              Unit Count:{' '}
              <Chip size="small" color="primary" label={data.unitCount} />
            </Typography>
          )}
        </div>
        <div>
          <Typography variant="caption" color="textSecondary">
            Status: {data.status ? data.status : 'N/A'}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="textSecondary">
            Expiration Date: {formatTimestamp(data.ExpirationDate)}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="textSecondary">
            Period: {data.Period ? data.Period : '0'}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="textSecondary">
            {data.ExpirationDate ? (
              <>
                 Days Remaining:{' '}
                {calculateDaysRemaining(data.ExpirationDate)}
              </>
            ) : (
              'N/A'
            )}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" color="textSecondary">
            Bill Code:{' '}
            {data.billCode ? (
              <>
                <span>{truncateBillCode(data.billCode, 5)}</span>
                <Tooltip title="Copy to Clipboard">
                  <IconButton
                    aria-label="copy"
                    onClick={() => copyBillCode(data.billCode)}
                  >
                    <FileCopyIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              'N/A'
            )}
          </Typography>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {data.unitCount !== undefined && data.unitCount > 0 && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleCardClick(data)}
            >
              Units
            </Button>
          )}
          {/* <Button
            variant="contained"
            size="small"
            onClick={() => handlePaymentsClick(data)}
          >
            Payments
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default Entity;
