import React, { useEffect, useState, useRef } from 'react';
import './uploadSchematic.scss';
import { v4 as uuid } from 'uuid';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';
import TagsInput from '../../util-components/TagsInput';
import FormInput from '../../util-components/FormInput';
import 'react-toastify/dist/ReactToastify.css';
import FileInput from '../../util-components/fileInputComponent/FileInputComponent';

function UploadSchematic() {
  const [tags, setTags] = useState([]);
  const [schematicName, setSchematicName] = useState('');
  const [tagAutocomplete, setTagAutocomplete] = useState();
  const fileInputRef = useRef(null);

  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === 13) event.preventDefault();
  }

  async function fetchTags() {
    const allTags = await fetch('http://localhost:3000/get-tags')
      .then((response) => response.json())
      .then((data) => setTagAutocomplete(data[0].tags));
  }

  useEffect(() => {
    fetchTags();
    console.log(fileInputRef);
  }, []);

  async function submitSchematic(event) {
    const fileInput = fileInputRef.current;
    event.preventDefault();

    // Check for bad input
    if (tags.length < 1 || schematicName.trim() === '' || !fileInput.files[0]) {
      if (schematicName.trim() === '') {
        return notifyError('Please enter schematic name to continue.');
      }
      if (!fileInput.files[0]) {
        return notifyError('Please enter a schematic file to continue.');
      }
      if (tags.length < 1) {
        return notifyError('Please enter schematic tags to continue.');
      }
      return notifyError('Check input and try again.');
    }

    // If all good continue
    if (tags.length > 0 && schematicName.trim() !== '') {
      notifyInfo('Schematic is being processed');
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append('schematicFile', file);
      formData.append('tags', tags.join(','));
      formData.append('schematicName', schematicName);

      try {
        const res = await fetch('http://localhost:3000/upload-schematic', {
          method: 'POST',
          body: formData,
        })
        // Display responses based on status returned
          .then((response) => {
            if (response.status === 201) {
              // Reset Values
              setTags([]);
              setSchematicName('');
              document.getElementById('file-input').value = '';
              setTagAutocomplete('');
              resetFileInput();

              return notifySuccess('Schematic uploaded successfully!');
            }
            if (response.status === 400) {
              return notifyError('This schematic already exists in database, canceling upload!');
            }
            if (response.status === 500) {
              return notifyError('Error uploading the schematic!');
            }
            return notifyError('Error uploading the schematic!');
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <body className="upload-schematic-body">
      <div className="upload-schematic-content">
        <form id="upload-form" onSubmit={submitSchematic}>
          <h1>Upload Schematic</h1>
          <FormInput
            label="Schematic name"
            id={uuid()}
            name="name"
            type="text"
            placeholder="Name"
            onChange={(event) => setSchematicName(event.target.value)}
            text={schematicName}
            required
          />
          {/* <label htmlFor="file-input">Upload File</label> */}
          <FileInput reference={fileInputRef} />

          <TagsInput tags={tags} setTags={setTags} autocomplete={tagAutocomplete} id="tags-input" />
          <button className="submit-btn" type="submit">Upload Schematic</button>
        </form>
      </div>
    </body>
  );
}

export default UploadSchematic;
