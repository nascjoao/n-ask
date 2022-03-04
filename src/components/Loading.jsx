import React from 'react';
import { TailSpin } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div>
      <TailSpin
        height="100"
        width="100"
        color="grey"
      />
    </div>
  );
}
