import { ReactNode } from "react";
import { Modal as ModalOverlay } from "@restart/ui";
import { MdOutlineClose } from "react-icons/md";

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
          className="fixed z-50 bg-black/40 w-full h-full top-0 left-0"
        />
      )}
      className="fixed z-[51] top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-5"
    >
      <div className="modal-container rounded-2xl bg-[#383838] min-w-64 text-[40px]">
        {title && (
          <div className="modal-header bg-[#202020] rounded-t-2xl py-1 px-[18px] relative flex items-center justify-center text-nafl-white">
            <div className="modal-close mr-auto invisible">
              <MdOutlineClose
                className="hover:text-nafl-sponge-700 transition-colors ease-out duration-150 cursor-pointer text-body-xl"
                onClick={hideModal}
              />
            </div>
            {title}
            <div className="modal-close ml-auto">
              <MdOutlineClose
                className="hover:text-nafl-sponge-700 transition-colors ease-out duration-150 cursor-pointer text-[24px] -translate-y-0.5"
                onClick={hideModal}
              />
            </div>
          </div>
        )}
        <div className="modal-content pt-[20px] pb-[40px] px-[50px]">
          {children}
        </div>
      </div>
    </ModalOverlay>
  );
};
