import dynamic from "next/dynamic";

export const Dropout = dynamic(() => import("./dashboard/Dropout"));
export const ForeplanModeSwitch = dynamic(
  () => import("./foreplan/ModeSwitch")
);
export const ForeplanSummary = dynamic(
  () => import("./foreplan/foreplanSummary/MainBox")
);
<<<<<<< HEAD
=======
export const ComplementaryInfo = dynamic(
  () => import("./dashboard/ComplementaryInfo")
);
>>>>>>> new-proyect/main
