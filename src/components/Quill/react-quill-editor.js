import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
// import { ImageUploader }  from 'quill-image-upload';
import 'react-quill/dist/quill.snow.css'; 
// Quill.register('modules/imageUpload', ImageUpload); // 커스텀 라이브러리를 등록해 준다.

// var React = require('react');
// var renderToString = require('react-dom/server');
/*
 * Simple editor component that takes placeholder text as a prop
 */
const e = React.createElement;
class Editor extends React.Component {
    
    constructor (props) {
      super(props)
      var setValue = props.setValue===""?null:JSON.parse(props.setValue);
      this.state = {theme: 'snow',value:'', setValue:setValue }
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange (html) {
        this.setState({ value: html });
    }

    handleThemeChange (newTheme) {
      if (newTheme === "core") newTheme = null;
      this.setState({ theme: newTheme })
    }

    render () {
        var component = e(
            'div',null, null,
                e(ReactQuill,
                    {
                      theme:this.state.theme,
                      onChange:this.handleChange,
                      value:this.state.value,
                      defaultValue:this.state.setValue,
                      modules:Editor.modules,
                      formats:Editor.formats,
                      bounds:'.editor-box',
                },null

                )
        );
      return component;
    }
  }
  var toolbarOptions = [
    [{ 'font': [] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    ['blockquote', 'code-block'],
    [{ 'align': [] }],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    ['image','video','formula'],

    ['clean']                                         // remove formatting button
  ];
  /*
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  Editor.modules = {
    toolbar: toolbarOptions,
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

  /*
   * PropType validation
   */
//   Editor.propTypes = {
//     placeholder: PropTypes.string,
//   }

  /*
   * Render component on page
   */
// const domContainer = document.querySelector('#editor-box');
  // ReactDOM.render( e(Editor),
  //   // < placeholder={'Write something...'}/>,
  //   document.querySelector('.editor-box'))
export default Editor
// ReactDOM.render(e(Editor), domContainer);