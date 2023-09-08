import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import '../styles/CkEditor.css'

function CkEditor() {
    const handleEditorReady = (editor) => {
        console.log('Editor is ready to use!', editor);
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
    };

    const handleEditorBlur = (event, editor) => {
        console.log('Blur.', editor);
    };

    const handleEditorFocus = (event, editor) => {
        console.log('Focus.', editor);
    };

    return (
        <div className="App">
            <CKEditor
                editor={ClassicEditor}
                data="<p>Hello from CKEditor 5!</p>"
                onReady={handleEditorReady}
                onChange={handleEditorChange}
                onBlur={handleEditorBlur}
                onFocus={handleEditorFocus}
            />
        </div>
    );
}

export default CkEditor;
