import React, { useRef, useMemo, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import '../../styles/Editor.css'
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/ImageResize', ImageResize);

const Editor = ({ htmlStr, setHtmlStr }) => {
  const quillRef = useRef(null);
  const viewContainerRef = useRef(null);


  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.addEventListener('change', async () => {
      const file = input.files?.[0];

      try {
        // 이미지 파일을 업로드하고 응답 받기
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('http://localhost:8080/and/editer/uploadImage', formData);

        // 응답에서 이미지 URL 받아와서 에디터에 추가
        const imageUrl = response.data.uploadFileUrl;
        console.log(imageUrl);
        const quillEditor = quillRef.current.getEditor();
        quillEditor.clipboard.dangerouslyPasteHTML(
          quillEditor.getLength(),
          `<img src="${imageUrl}" alt="uploaded detail image" />`
        );
      } catch (error) {
        console.error(error);
      }
    });
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'formula'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
      imageResize: {
        parchment: ReactQuill.Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize'],
      },
    },
  }), []);

  const formats = [
    'font',
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'formula',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
  ]

  return (
    <>
      <ReactQuill id='editer-div'
        ref={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        value={htmlStr}
        placeholder='내용을 입력하세요.'
        onChange={(content, delta, source, editor) => setHtmlStr(editor.getHTML())} />

    </>
  )
}

export default Editor;

