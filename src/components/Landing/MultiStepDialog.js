import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SignInForm from './SignInForm';
import CreateCRMAppForm from './CreateCRMAppForm';

const steps = ['Sign In', 'Create CRM App'];

function MultiStepDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState(null);

  const handleNext = (data) => {
    if (activeStep === 0) {
      setUserData(data);
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Multi-Step Dialog</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && <SignInForm onNext={handleNext} />}
        {activeStep === 1 && <CreateCRMAppForm userData={userData} onBack={handleBack} />}
      </DialogContent>
    </Dialog>
  );
}

export default MultiStepDialog;
