import { siteConfig } from '@/config/site';
import React from 'react';

// Component styling
const styles = {
  dexscreenerEmbed: {
    // position: 'relative',
    // width: '100%',
    // height: '100%',
    // paddingBottom: '125%',
    // '@media (min-width: 1400px)': {
    //   paddingBottom: '65%',
    // },
  },
  iframe: {
    // position: 'absolute',
    // width: '100%',
    // height: '100%',
    // top: 0,
    // left: 0,
    // border: 0,
  }
};

const DexScreenerEmbed = () => {
  return (
    <div style={styles.dexscreenerEmbed}>
      <iframe
        src={`https://dexscreener.com/solana/${siteConfig.contractAddress}?embed=1&theme=dark`}
        style={styles.iframe}
      ></iframe>
    </div>
  );
}

export default DexScreenerEmbed;
