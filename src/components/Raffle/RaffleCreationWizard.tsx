'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Progress,
  Divider
} from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import RaffleTypeSelection from './RaffleCreationSteps/RaffleTypeSelection';
import PrizeConfiguration from './RaffleCreationSteps/PrizeConfiguration';
import RaffleSettings from './RaffleCreationSteps/RaffleSettings';
import ReviewAndCreate from './RaffleCreationSteps/ReviewAndCreate';

interface RaffleCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RaffleCreationWizard: React.FC<RaffleCreationWizardProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [raffleData, setRaffleData] = useState({
    // Step 1: Raffle Type
    lotteryType: '',
    raffleType: '',
    
    // Step 2: Prize Configuration
    prizeType: '',
    tokenPrize: {
      token: '',
      amount: ''
    },
    nftPrize: {
      contractAddress: '',
      tokenId: '',
      name: '',
      image: ''
    },
    nafflingsPrize: {
      amount: 0
    },
    
    // Step 3: Raffle Settings
    ticketPrice: 0,
    coinType: '',
    duration: 7,
    ticketsAvailable: 0,
    discountCode: ''
  });

  const steps = [
    { number: 1, title: 'Raffle Type', description: 'Choose your raffle format' },
    { number: 2, title: 'Prize Setup', description: 'Configure your prize' },
    { number: 3, title: 'Settings', description: 'Set ticket price and duration' },
    { number: 4, title: 'Review', description: 'Review and create raffle' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataUpdate = (stepData: any) => {
    setRaffleData(prev => ({ ...prev, ...stepData }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <RaffleTypeSelection
            data={raffleData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PrizeConfiguration
            data={raffleData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <RaffleSettings
            data={raffleData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReviewAndCreate
            data={raffleData}
            onPrevious={handlePrevious}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      isDismissable={false}
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 
            className="text-2xl font-bold"
            style={{ 
              color: colors.gray[900],
              fontFamily: typography.fontFamily.display.join(', ')
            }}
          >
            Create New Raffle
          </h2>
          <p className="text-sm font-normal" style={{ color: colors.gray[600] }}>
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
        </ModalHeader>

        <ModalBody>
          {/* Progress Bar */}
          <div className="mb-6">
            <Progress
              value={progress}
              color="primary"
              size="md"
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`text-center ${
                    step.number <= currentStep ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-sm font-medium ${
                      step.number <= currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              ))}
            </div>
          </div>

          <Divider className="mb-6" />

          {/* Current Step Content */}
          {renderCurrentStep()}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RaffleCreationWizard;