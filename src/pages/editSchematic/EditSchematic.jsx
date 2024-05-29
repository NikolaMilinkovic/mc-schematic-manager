import React, { useEffect, useState, useRef } from 'react';
import './editSchematic.scss';
import { v4 as uuid } from 'uuid';
import { notifySuccess, notifyError, notifyInfo } from '../../util-components/Notifications';
import TagsInput from '../../util-components/TagsInput';
import FormInput from '../../util-components/FormInput';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

function EditSchematic() {
  const { id } = useParams();
  const [schematic, setSchematic] = useState();
  const [tags, setTags] = useState([]);
  const [schematicName, setSchematicName] = useState('');
  const [tagAutocomplete, setTagAutocomplete] = useState();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:3000/get-schematic/${id}`)
      .then((response) => response.json())
      .then((data) => setSchematic(data))
      .catch((error) => console.error('Error fetching schematic:', error));
  }, [id]);

  function handleKeyPress(event) {
    if (event.key === 'Enter' || event.key === 13) event.preventDefault();
  }

  async function fetchTags() {
    const allTags = await fetch('http://localhost:3000/get-tags')
      .then((response) => response.json())
      .then((data) => setTagAutocomplete(data[0].tags));
  }

  // const fetchSchematic(){

  // }

  useEffect(() => {
    // fetchSchematic();
    console.log(schematic);
    fetchTags();
  }, [schematic]);

  async function updateSchematic(event) {
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
    <body className="edit-schematic-body">
      <div className="upload-schematic-content">
        <form id="upload-form" onSubmit={updateSchematic}>
          <h1>Edit Schematic</h1>
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
          <input type="file" id="file-input" accept=".schematic, .schem, .zip" ref={fileInputRef} />
          <TagsInput tags={tags} setTags={setTags} autocomplete={tagAutocomplete} id="tags-input" />
          <button className="submit-btn" type="submit">Update Schematic</button>
        </form>
      </div>
    </body>
  );
}

export default EditSchematic;
