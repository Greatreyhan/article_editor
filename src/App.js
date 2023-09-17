import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FIREBASE_STORE, FIREBASE_DB } from "./firebaseinit";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { onValue, ref as rtdbref, set } from "firebase/database";
import parse from "html-react-parser"

const custom_config = {
  extraPlugins: [MyCustomUploadAdapterPlugin],
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
};

class MyUploadAdapter {
  // The File Loader
  constructor(loader) {
    this.loader = loader;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const storageRef = ref(FIREBASE_STORE, `images/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on("state_changed", (snapshot) => {
            const progress =
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " +progress +"% done");
          },
          (error) =>{
            switch (error.code) {
              case "storage/unauthorized":
                reject(" User doesn't have permission to access the object");
                break;

              case "storage/canceled":
                reject("User canceled the upload");
                break;

              case "storage/unknown":
                reject(
                  "Unknown error occurred, inspect error.serverResponse"
                );
                break;
            }
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              resolve({
                default: downloadURL
              });
            });
          });
        })
    );
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

function App() {
  const [dataEdit, setDataEdit] = useState('');
  const handlerCKEDITOR = (event, editor) => {
    const data = editor.getData();
    setDataEdit(data);
  };

  const handleSendData = () =>{
    set(rtdbref(FIREBASE_DB, "user/"), dataEdit);
  }

  useEffect(()=>{
    onValue(rtdbref(FIREBASE_DB, "user"), (snapshot) => {
      const data = snapshot.val();
      setDataEdit(data)
    });
  },[])

  return (
    <div className="App">
      <CKEditor
        editor={ClassicEditor}
        config={custom_config}
        data="<p>Hello from CKEditor&nbsp;5!</p>"
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor is ready to use!", editor);
        }}
        onChange={(event, editor) => handlerCKEDITOR(event, editor)}
      />
    <div>
      {parse(dataEdit)}
      <p onClick={handleSendData}>Send!</p>
    </div>
    </div>
  );
}

export default App;
