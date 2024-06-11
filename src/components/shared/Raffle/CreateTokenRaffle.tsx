import { useState } from "react";
import { Modal } from "@components/shared/Modal";
import { FormContext, TextInput } from "../Inputs";
import { AiOutlineLoading } from "react-icons/ai";


type CreateTokenRaffleProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateTokenRaffle = ({
  isOpen,
  onClose,
}: CreateTokenRaffleProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <Modal
      title={"Create Token Raffle"}
      show={isOpen}
      hideModal={onClose}

    >
      <FormContext onSubmit={onSubmit} className="flex flex-col gap-4 min-w-64">
        <div className="grid grid-cols-2 gap-4">
          <div>
              <TextInput
              name="reserveRaffle"
              label="Reserve Raffle"
              placeholder="Reserve Raffle"
            />
            <TextInput
              name="ticketPrice"
              label="Ticket Price"
              placeholder="Ticket Price"
            />
            <TextInput
              name="ticketPrice"
              label="Ticket Price"
              placeholder="Ticket Price"
            />
            <TextInput
              name="ticketPrice"
              label="Ticket Price"
              placeholder="Ticket Price"
            />
          </div>
          <div>
          <TextInput
              name="ticketPrice"
              label="Ticket Price"
              placeholder="Ticket Price"
            />
            <TextInput
              name="ticketPrice"
              label="Ticket Price"
              placeholder="Ticket Price"
            />
            <div className="flex items-center justify-between">
            <p className="text-nafl-white text-[22px] text-bold-lg">Summary</p>
              <div className="flex flex-row">
                <p className="text-nafl-white text-[19px]">Raffle Prize Value</p>
                <p className="text-nafl-white text-[19px]">2.5 ETH</p>
              </div>
              <div className="flex flex-row">
                <p className="text-nafl-white text-[19px]">Service Fee</p>
                <p className="text-nafl-white text-[19px]">0.025 ETH</p>
              </div>
              <div>
                <p className="text-nafl-white text-[19px]">Potential Earnings</p>
                <p className="text-nafl-white text-[19px]">2.475 ETH</p>
              </div>
            </div>
          </div>
        </div>
        <button
        type="submit"
        className="flex items-center justify-center text-[#000] h-[45px] w-full rounded-[10px] bg-nafl-sponge-500"
        disabled={isLoading}
      >
        {isLoading ? <AiOutlineLoading className="animate-spin" /> : "NAFFLE IT"}
      </button>
      </FormContext>
    </Modal>
  )
}

export default CreateTokenRaffle;