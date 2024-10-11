import * as React from "jsx-dom";
import styles from "./ErrorMessage.module.css";

type ErrorMessageProps = {
  mainText: string;
  subText?: string;
};

export const ErrorMessage = ({ mainText, subText }: ErrorMessageProps) => {
  return (
    <div className={styles.retroArcade}>
      <div className={styles.content}>
        <h1 className={styles.mainText}>{mainText}</h1>
        <p className={styles.subText}>{subText}</p>
      </div>
    </div>
  );
};
