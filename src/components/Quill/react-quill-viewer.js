import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css'; 

const e = React.createElement;
class QuillViewer extends React.Component {
    
    handleThemeChange (newTheme) {
      if (newTheme === "core") newTheme = null;
      this.setState({ theme: newTheme })
    }

    render () {
        var component = e(
            'div',null, null,
                e(ReactQuill,
                    {
                        theme:'bubble',
                        defaultValue:JSON.parse(this.props.setValue),
                    readOnly :true,
                },null
                )
        );
      return component;
    }
  }

  export default QuillViewer