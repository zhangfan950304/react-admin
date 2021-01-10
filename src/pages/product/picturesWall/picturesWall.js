import React from "react";
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from "../../../api/index.js";
import PropTypes from "prop-types";
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
export default class PicturesWall extends React.Component{
    static propTypes = {
        imgs:PropTypes.array
    }
    constructor(props){
        super(props);
        let fileList=[];
        const {imgs} = this.props;
        if( imgs && imgs.length>0){
            fileList=imgs.map((item,index) =>({
                uid:-index,
                name:item,//图片文件名
                status:"done",
                url:"http://120.55.193.14:5000/upload/"+item
            }))
        }
        this.state={
            previewVisible: false,//大图是否可以预览
            previewImage: '',//大图的url
            fileList
        }
    }
     //取消大图model的显示
      handleCancel = () => this.setState({ previewVisible: false });
    
      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
      };
    
      handleChange = async({ file,fileList }) => {
        if(file.status === "done"){//将当前上传的file的信息修正
            const result = file.response;
            if(result.status === 0){
                message.success("success");
                const {name,url} = result.data;
                file = fileList[fileList.length-1];
                file.name = name;
                file.url = url;
            }else if(result.status === "removed"){//删除图片
                const result = await reqDeleteImg(file.name);
                if(result.status === 0){
                    message.success("删除图片成功");
                }else{
                    message.error("删除图片失败");
                }
            }else{
                message.error("fail");
            }
        }

        //在操作的过程中更新filelist状态
        this.setState({ fileList })
      };
      getImgs =() =>{
          return this.state.fileList.map(file => file.name);
      }
      render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        return (
          <div className="clearfix">
            <Upload
              action="http://120.55.193.14:5000/manage/img/upload"///上传图片的地址
              accept="image/*"
              name="image"//请求参数名
              listType="picture-card"//卡片样式
              fileList={fileList}//已上传文件对象的数组
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        );
      }
    
}
 