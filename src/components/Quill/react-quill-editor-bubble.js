import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

/*
 * Simple editor component that takes placeholder text as a prop
 */
const e = React.createElement;
class Editor extends React.Component {
    
    constructor (props) {
      super(props)
      this.state = {theme: 'bubble',value:'', setValue:'' }
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
                    defaultValue:JSON.parse(this.props.setValue),
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
    'link'
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