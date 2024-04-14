"use client";

import Footer from "@components/shared/Footer/Footer";
// import GameZoneComments from "@components/shared/GameZone/GameZoneComments";
// import GameZoneCreateGame from "@components/shared/GameZone/GameZoneCreateGame";
// import GameZoneGameChallenger from "@components/shared/GameZone/GameZoneGameChallenger";
// import GameZoneMain from "@components/shared/GameZone/GameZoneMain";
import { useEffect, useState } from "react";

const GameZone = () => {
  const [seletedView, setSeletedView] = useState<string>("main");
  
  return (
    <div className="flex flex-col items-center w-full mt-10">
    <h1>
      Live-naffles
    </h1>
    
    <Footer />

    </div>
  );
};

export default GameZone;
