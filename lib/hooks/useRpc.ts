import { siteConfig } from '@/config/site';
import { useState, useEffect, useCallback } from 'react';

const useRpcEndpoint = (network: unknown) => {
  const [endpoint, setEndpoint] = useState<string>(`${siteConfig.rpcEndpoint}/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

  const fetchRpc = useCallback(async () => {
    try {
      let fetchedEndpoint = null;
      switch (siteConfig.rpcProvider) {
        case "alchemy":
          const response = await fetch('/api/getRpc');
          const data = await response.json();
          fetchedEndpoint = data.endpoint;
          console.log(`Using Alchemy RPC: ${fetchedEndpoint}`);
          break;
        // You can add more cases here for different providers
        default:
          fetchedEndpoint = `${siteConfig.defaultrpcEndpoint}`;
          break;
      }
      // Only update the endpoint if fetchedEndpoint is not null
      if (fetchedEndpoint) {
        setEndpoint(fetchedEndpoint);
      }
    } catch (error) {
      console.error(error);
      // Fall back to default endpoint on error
      setEndpoint(`${siteConfig.defaultrpcEndpoint}`);
    }
  }, [siteConfig, network]); // Dependencies

  useEffect(() => {
    // Fetch the RPC endpoint when the hook mounts or when siteConfig or network changes
    fetchRpc();
  }, []);

  // Log the current endpoint for debugging
  useEffect(() => {
    console.log(`Using RPC Endpoint: ${endpoint}`);
  }, [endpoint]);

  return endpoint;
};

export default useRpcEndpoint;
