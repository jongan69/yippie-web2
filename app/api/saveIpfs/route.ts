import { NextResponse } from 'next/server';
import { createHelia } from 'helia';
import { json } from '@helia/json';
import clientPromise from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinaryPromise'
import { fileTypeFromBuffer } from "file-type";

// Define the POST handler for the endpoint
export async function POST(req: Request, res: Response) {
    try {
        // Parse the incoming form data
        const formData = await req.formData();

        // Get the file from the form data
        const file: File | any = formData.get("image");
        const title = formData.get('title');
        const walletAddress = formData.get('walletAddress');
        const imageDescription = formData.get('imageDescription');

        if (!file || !title || !imageDescription || !walletAddress) {
            console.error(`Missing data: ${file} ${title} ${imageDescription} ${walletAddress}`)
            return NextResponse.json({ Message: "Missing Data", status: 400 });
        }
        const base64string_buffer: any = Buffer.from(file, "base64");
        const result: any = await fileTypeFromBuffer(base64string_buffer);
        const base64Url = `data:${result.mime};base64,${file}`
        console.log(`data:${result.mime};base64,`)

        // Initialize Helia asynchronously
        const heliaPromise = createHelia();
        const jPromise = heliaPromise.then(helia => json(helia));

        // Wait for all asynchronous operations to complete
        const [helia, j] = await Promise.all([heliaPromise, jPromise]);
        console.log(`Helia Initialized: ${helia !== undefined}`)

        // Upload the image to Cloudinary asynchronously
        const cloudinaryUploadPromise = cloudinary.uploader.upload(base64Url);
        const metadata = {
            name: title,
            imageDescription,
        };

        // Post the request body to IPFS asynchronously
        const cidPromise = await j.add(base64Url);
        console.log(`Got CID Promise: ${cidPromise}`)

        // Upload + DB Promise
        const [
            cid,
            imageUpload,
            client
        ] = await Promise.all([cidPromise, cloudinaryUploadPromise, clientPromise]);

        // Save data to database asynchronously
        const db = client.db("Memes");
        const url = imageUpload.url;
        const dbsavePromise = db.collection("posts").insertOne({ owner: walletAddress, url, cid, metadata, likes: 0, dislikes: 0 });
        console.log(`Got CID: ${cid}`)

        // Maybe can be moved
        async function pinByCID(hashToPinInput: any, metadata: any) {
            try {
                const hashToPin = hashToPinInput.toString()
                const data = {
                    hashToPin,
                    pinataMetadata: metadata
                }
                console.log(data)
                const res = await fetch("https://api.pinata.cloud/pinning/pinByHash", {
                    method: "POST",
                    headers: {
                        contentType: 'application/json',
                        Authorization: `Bearer ${process.env.PIN_JWT}`,
                    },
                    body: JSON.stringify(data),
                });
                const resData = await res.json();
                return resData
            } catch (error) {
                console.log(error);
                return
            }
        };

        // Wait for database insertion to complete
        const [dbSave, pin] = await Promise.all([dbsavePromise, pinByCID(cid, metadata)])
        console.log(dbSave, pin)

        // Return the CID of the posted content
        return NextResponse.json({ cid: cid.toString(), dbSave, status: 200 });
    } catch (error: any) {
        // If an error occurs during processing, log the error and return a JSON response with a failure message and a 500 status code
        console.error("Error occurred ", error);
        return NextResponse.json({ Message: `Failed: ${JSON.stringify(error)}`, status: 500 });
    }
}
