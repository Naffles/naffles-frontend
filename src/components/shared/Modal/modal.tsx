import { ReactNode } from "react";
import { Modal as ModalOverlay } from "@restart/ui";
import { FaTimes } from "react-icons/fa";

type ModalProps = {
  show: boolean;
  hideModal: () => any;
  title?: string | ReactNode;
  children?: string | ReactNode;
};

export const Modal = ({
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
          className="fixed z-49 bg-black/40 w-full h-full top-0 left-0"
        />
      )}
      className="flex w-full min-h-full flex items-center justify-center outline-none absolute top-0 left-0 z-50"
    >
      <div className="modal-container rounded-md bg-nafl-charcoal-500 min-w-64 text-2xl">
        {title && (
          <div className="modal-header rounded-t-md bg-nafl-charcoal-600 py-1 px-2 relative flex items-center justify-center">
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
        <div className="modal-content rounded-md p-8">{children}</div>
      </div>
    </ModalOverlay>
  );
};