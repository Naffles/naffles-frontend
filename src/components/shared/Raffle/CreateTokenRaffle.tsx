import { useState } from "react";
import RaffleCreationWizard from "@/components/Raffle/RaffleCreationWizard";

type CreateTokenRaffleProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateTokenRaffle = ({ isOpen, onClose }: CreateTokenRaffleProps) => {
  const handleSuccess = () => {
    onClose();
    // Optionally refresh the page or update the raffle list
    window.location.reload();
  };

  return (
    <RaffleCreationWizard
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handleSuccess}
    />
  );
};

export default CreateTokenRaffle;
