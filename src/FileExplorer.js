// src/FileExplorer.js
import React, { useState } from "react";
import "./FileExplorer.css";

const FileExplorer = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "file1.txt", type: "file" },
    { id: 2, name: "file2.txt", type: "file" },
    {
      id: 3,
      name: "folder1",
      type: "folder",
      open: false,
      files: [{ id: 4, name: "file3.txt", type: "file" }],
    },
  ]);

  const [newFileName, setNewFileName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const toggleFolder = (id) => {
    const updatedFiles = files.map((file) => {
      if (file.id === id) {
        file.open = !file.open;
      }
      return file;
    });
    setFiles([...updatedFiles]);
  };

  const addFile = () => {
    if (newFileName) {
      const newFile = { id: Date.now(), name: newFileName, type: "file" };
      if (selectedFolderId) {
        const updatedFiles = addFileToFolder(files, selectedFolderId, newFile);
        setFiles([...updatedFiles]);
      } else {
        setFiles([...files, newFile]);
      }
      setNewFileName("");
    }
  };

  const addFolder = () => {
    if (newFolderName) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName,
        type: "folder",
        open: false,
        files: [],
      };
      if (selectedFolderId) {
        const updatedFiles = addFileToFolder(
          files,
          selectedFolderId,
          newFolder
        );
        setFiles([...updatedFiles]);
      } else {
        setFiles([...files, newFolder]);
      }
      setNewFolderName("");
    }
  };

  const deleteFileOrFolder = (id) => {
    const updatedFiles = deleteFileFromFolder(files, id);
    setFiles([...updatedFiles]);
  };

  const addFileToFolder = (fileList, folderId, newFile) => {
    return fileList.map((file) => {
      if (file.id === folderId && file.type === "folder") {
        file.files = [...file.files, newFile];
      } else if (file.type === "folder") {
        file.files = addFileToFolder(file.files, folderId, newFile);
      }
      return file;
    });
  };

  const deleteFileFromFolder = (fileList, fileId) => {
    return fileList
      .filter((file) => file.id !== fileId)
      .map((file) => {
        if (file.type === "folder") {
          file.files = deleteFileFromFolder(file.files, fileId);
        }
        return file;
      });
  };

  const renderFiles = (files) => {
    return files.map((file) => (
      <div key={file.id} className="file-item">
        {file.type === "folder" ? (
          <div>
            <span onClick={() => toggleFolder(file.id)}>
              {file.open ? "📂" : "📁"} {file.name}
            </span>
            <button onClick={() => deleteFileOrFolder(file.id)}>Delete</button>
            {file.open && (
              <div className="folder-contents">{renderFiles(file.files)}</div>
            )}
          </div>
        ) : (
          <div>
            <span>📄 {file.name}</span>
            <button onClick={() => deleteFileOrFolder(file.id)}>Delete</button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="file-explorer">
      <div>
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New File Name"
        />
        <button onClick={addFile}>Add File</button>
      </div>
      <div>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New Folder Name"
        />
        <button onClick={addFolder}>Add Folder</button>
      </div>
      <div>
        <select
          onChange={(e) => setSelectedFolderId(Number(e.target.value))}
          defaultValue=""
        >
          <option value="">Select Folder</option>
          {files
            .filter((file) => file.type === "folder")
            .map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
        </select>
      </div>
      {renderFiles(files)}
    </div>
  );
};

export default FileExplorer;
