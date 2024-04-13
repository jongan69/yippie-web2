// pages/api/pin.js

import { createRemotePinner } from '@helia/remote-pinning';
import { Configuration, RemotePinningServiceClient } from '@ipfs-shipyard/pinning-service-client';
import { createHelia } from 'helia';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    const { cid } = await req.json();

    if (!cid) {
        return NextResponse.json({ error: 'Missing required fields: cid' });
    }

    try {
        const pinServiceConfig = new Configuration({
            endpointUrl: process.env.PIN_URL,
            accessToken: process.env.PIN_JWT
        });
        const remotePinningClient = new RemotePinningServiceClient(pinServiceConfig);
        const helia = await createHelia();
        const remotePinner = createRemotePinner(helia, remotePinningClient);
        const addPinResult = await remotePinner.addPin({
            cid,
            // name: 'MEMEMEv1' // Customize this as needed
        });

        return NextResponse.json(addPinResult);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ error: 'Failed to pin content' });
    }
}
