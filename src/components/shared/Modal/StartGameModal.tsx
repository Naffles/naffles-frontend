'use client';

interface IStartGameModal {
  show: boolean,
  hideModal: () => any,
}

const StartGameModal = ({ show, hideModal }: IStartGameModal) => {
  return (
    show && (
      <div 
        id="start-game-modal-pop-up"
        className="
          absolute 
          top-[270px] 
          -left-[30px] 
          z-50 
          flex 
          flex-col 
          items-center 
          justify-center 
          animate-fade-in
        "
        onBlur={hideModal}
      >
        <div 
          className="
            modal-container 
            rounded-2xl 
            bg-[#383838] 
            min-w-[234px] 
            min-h-[103px]
            border-[2px]
            border-nafl-purple
            relative
          "
        >
          <img 
            src="/static/top-arrow.png"
            className="
              absolute
              -top-[110px]
              -right-[60px]
            "
          />
          <div 
            className="
              modal-content 
              py-[20px] 
              px-[50px]
            "
          >
            <p className="font-face-roboto text-nafl-sponge-500 text-base font-bold text-center">
              Click any option to start 
              <br />
              the game before the 
              <br />
              timer runs out!  
            </p>          
          </div>
          <img 
            src="/static/bottom-arrow.png"
            className="
              absolute
              -bottom-[110px]
              -right-[60px]
            "
          />
        </div>
      </div>
    )
  )
}

export default StartGameModal;