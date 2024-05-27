import { ReactNode } from "react";
import { Modal as ModalOverlay } from "@restart/ui";
import { FaTimes } from "react-icons/fa";

type ModalProps = {
  show: boolean;
  hideModal: () => any;
  title?: string | ReactNode;
  children?: string | ReactNode;
};

export const ModalProfile = ({
  show = false,
  title,
  hideModal,
  children,
}: ModalProps) => {
  return (
    <ModalOverlay
      onHide={hideModal}
      show={show}
      renderBackdrop={(props) => (
        <div
          {...props}
          className="fixed z-50 bg-black/40 w-full h-full top-0 left-0 backdrop-blur-md animate-fade-in"
        />
      )}
      className="fixed z-[51] top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 md:w-[500px] w-full flex items-center justify-center"
    >
      <div className="modal-container rounded-2xl bg-nafl-charcoal-500 md:w-full max-w-[500px] w-[90%] duration-500 text-[40px] animate-fade-in">
        {title && (
          <div className="modal-header bg-nafl-charcoal-600 rounded-t-2xl py-1 px-2 relative flex items-center justify-center text-[#fff]">
            <div className="modal-close mr-auto invisible">
              <FaTimes
                className="hover:text-nafl-sponge-700 transition-colors ease-out duration-150 cursor-pointer text-body-xl"
                onClick={hideModal}
              />
            </div>
            {title}
            <div className="modal-close ml-auto">
              <FaTimes
                className="hover:text-nafl-sponge-700 transition-colors ease-out duration-150 cursor-pointer text-lg -translate-y-0.5"
                onClick={hideModal}
              />
            </div>
          </div>
        )}
        <div className="modal-content  p-8">{children}</div>
      </div>
    </ModalOverlay>
  );
};
