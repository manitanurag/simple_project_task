import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Upload = () => {
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const deleteFile = (fileName) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    return (
        <div>
            <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <h4>Uploaded Files:</h4>
            <ul>
                {files.map((file) => (
                    <li key={file.name}>
                        {file.name} <button onClick={() => deleteFile(file.name)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Upload;