import React from 'react';
import { TailSpin } from 'react-loader-spinner';
import styles from '../styles/components/loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.loading}>
      <TailSpin
        height="100"
        width="100"
        color="grey"
      />
    </div>
  );
}
