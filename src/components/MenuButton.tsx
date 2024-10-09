import * as React from "jsx-dom";
import styles from "./MenuButton.module.css";

export const MenuButton = ({ text }: { text: string }) => (
  <button className={styles.retroButton}>{text}</button>
);
