
import React, { Component } from 'react';
import { EditorState, convertToRaw ,ContentState} from 'draft-js';
import PropTypes from "prop-types"
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import htmlToDraft from 'html-to-draftjs';


export default class RichTextEditor extends Component {
    static propTypes ={
        detail: PropTypes.string
    }
    constructor(props) {
        super(props);
        const html = this.props.detail
        if (html) {
          const contentBlock = htmlToDraft(html);
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          this.state = {
            editorState,
          };
        }else{
            this.state={
                editorState:EditorState.createEmpty()
            }
        }
      }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
  getDetail = () =>{
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));//返回输入数据对应的html格式的文本
  }
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
        //   wrapperClassName="demo-wrapper"
        //   editorClassName="demo-editor"
          editorStyle={{border:"1px solid #ccc",minHeight:200,paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}