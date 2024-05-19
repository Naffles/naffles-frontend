import React, { useEffect, useState } from "react";
import styles from "./blinkingeye.module.scss";
import classnames from 'classnames'
const BlinkingEyes = ({ image, delay }: { image: string, delay?:number }) => {

const [blink, setBlink] = useState(false);

useEffect(() => {
  
  const blink = () => {
    setBlink(true)
    setTimeout(() => {
     setBlink(false)
    }, 500); // Duration of the blink animation (0.5s)
  };

  const intervalId = setInterval(() => {
    blink();
  }, 10000 + (delay || 0) * 1000 ); // Interval between blinks (10s)

  return () => clearInterval(intervalId); // Cleanup on unmount
}, []);

  return (
    <div className={styles["eye-container"]}>
      <img src={image} alt="" className={classnames(styles["blinking-eye"], blink && styles['blink'])} />
    </div>
  );
};

export default BlinkingEyes;
