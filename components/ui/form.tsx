import React, { useState } from 'react';
import { Form } from '@radix-ui/react-form';
import { Avatar } from '@radix-ui/react-avatar';
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip';
import StyledFileUpload from './upload'

const MemeForm = (props: { publicKey: string | Blob; }) => {
  const [imageFile, setImageFile] = useState<any>();
  const [title, setTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [isLoading, setLoading] = useState(false);


  const handleSubmit = async (event: any) => {
    setLoading(true)
    event.preventDefault(); // Prevent default form submission behavior
    if (!imageFile || !title || !imageDescription || !props.publicKey) {
      setLoading(false)
      return alert('Missing required fields');
    }

    if (!imageFile) {
      setLoading(false)
      return alert(`imageFile: ${imageFile}`);
    }

    const formData = new FormData()
    formData.append("image", imageFile);
    formData.append('title', title);
    formData.append('walletAddress', props.publicKey);
    formData.append('imageDescription', imageDescription);
    try {
      await fetch('/api/saveIpfs', {
        method: 'POST',
        body: formData
      })
        .then(async data => await data.json())
        .then((res) => {
          if (res.status === 200) alert(`Congrats! You posted: ${res.cid}`)
          else alert(`Something happened while posting!: ${JSON.stringify(res)}`)
        })
      setLoading(false)
      setImageFile(null)
      setTitle('')
      setImageDescription('')
      return
    } catch (error: any) {
      // Handle response from the server here
      setLoading(false)
      console.error('Response:', error);
      return alert(`OOF: ${JSON.stringify(error)}`)
    }
  };

  return (
    !isLoading ?
      <Form onSubmit={handleSubmit}>
        <TooltipProvider>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Avatar />
            <Tooltip>
              <label htmlFor="image">Image:</label>
            </Tooltip>
            <StyledFileUpload setImage={setImageFile} />
            <Tooltip>
              <label htmlFor="title">Title:</label>
            </Tooltip>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Tooltip>
              <label htmlFor="imageDescription">Description:</label>
            </Tooltip>
            <textarea
              id="imageDescription"
              name="imageDescription"
              value={imageDescription}
              onChange={(event) => setImageDescription(event.target.value)}
            />
            <button type="submit">Submit</button>
          </div>
        </TooltipProvider>
      </Form>
      : <p>Loading...</p>
  );
};

export default MemeForm;
