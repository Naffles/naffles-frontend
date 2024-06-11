'use client';

import { Modal as ModalOverlay } from "@restart/ui";

interface IGameResultModal {
  show: boolean,
  hideModal: () => any,
  result: string,
}

const GameResultModal = ({ show, hideModal, result }: IGameResultModal) => {
  return (
    <ModalOverlay
      onHide={hideModal}
      show={show}
      renderBackdrop={(props) => (
        <div
          {...props}
          className="fixed outline-none z-50 bg-black/40 w-full h-full top-0 left-0"
        />
      )}
      className="fixed z-[51] top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-5 outline-none"
    >
      <div 
        className="
          modal-container 
          rounded-2xl 
          bg-[#383838] 
          min-w-[334px] 
          min-h-[163px]
          border-[2px]
          border-nafl-purple
        "
      >
        <div 
          className="
            modal-content 
            pt-[20px] 
            px-[50px]
          "
        >
          <div className="flex flex-col items-center justify-center space space-y-4 relative">
            <div
              className="mt-5 relative"
            >
              <span 
                className="
                  uppercase 
                  text-3xl 
                  font-bold 
                  text-nafl-sponge-500
                  font-face-roboto
                "
              >
                You {result == 'win' ? 'Won' : 'Lost'}
              </span>
              {
                result == 'win' ? (
                  <img
                    className="absolute -top-3 -right-[48px]"
                    src="/static/game-won.png"
                  />
                ) : (
                  <img
                    className="absolute -top-3 -right-[48px]"
                    src="/static/game-lost.png"
                  />
                )
              }
            </div>
            <div
              className="mb-4"
            >
              <button 
                className="
                  text-base 
                  font-bold 
                  text-nafl-sponge-500
                  font-face-roboto
                  px-[51px]
                  py-[12px]
                  bg-[#50504F]
                  border-[1px]
                  border-nafl-sponge-500
                  rounded-lg
                "
                onClick={hideModal}
              >
                OK
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </ModalOverlay>
  )
}

export default GameResultModal;