import React from "react";
import { Card,Icon,Input,Form,Cascader,Button, message} from 'antd';
import PicturesWall from "./picturesWall/picturesWall.js"
import { reqCategory ,reqAddOrProduct} from "../../api";
import RichTextEditor from "./rich-text-editor/richTextEditor.js"
const { TextArea } = Input;

//商品路由
class ProductAddUpdate extends React.Component{
    state ={
        options:[],
         
    }
    constructor(props){
        super(props);
        //创建用来保存ref标识的标签对象的容器
        this.myRef = React.createRef();
        this.editor = React.createRef();
    }
    //用于家在下一级列表的回调函数
      loadData = async (selectedOptions) => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const subCategorys = await this.getCategory(targetOption.value);
        targetOption.loading = false;
        if(subCategorys && subCategorys.length>0){
            const childOption = subCategorys.map(c =>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            targetOption.children = childOption;
        }else{
            targetOption.isLeaf = true;
        }
         this.setState({
             options:[...this.state.options]
         })
        
      };
      initOptions = async(category) =>{
        const option = category.map(c=>({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate,product} = this;
        const {pCategoryId} = product;
        if(isUpdate && pCategoryId !== "0"){
            const subCategorys = await this.getCategory(pCategoryId);
            const childOption = subCategorys.map(c =>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            //找到当前商品的option对象
            const targetOption = option.find(item =>item.value === pCategoryId);
            //关联到一级分类的option
            targetOption.children = childOption;
        }
        this.setState({
            options:option
        })
      }
      //获取一级/二级分类列表，
    getCategory = async(parentId)=>{
        const result = await reqCategory(parentId);
        if(result.status === 0){
           const category = result.data;
           if(parentId ==="0"){
               this.initOptions(category);
           }else{
               return category//返回二级列表，当前async函数返回的promise就会成功且value为cateforys
           }
            
            }
        }
    
    callBackPage =() =>{
        this.props.history.goBack();
    }
    submitForm = () =>{
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
              const {name,desc,price,categoryIds} = values;
              let pCategoryId,categoryId;
              if(categoryIds.length === 1){
                  pCategoryId = "0";
                  categoryId = categoryIds[0];
              }else{
                  pCategoryId = categoryIds[0];
                  categoryId = categoryIds[1];
              }
              const imgs =  this.myRef.current.getImgs();//父组件调用子组件对象的方法，先创建ref容器this.gg = React.createRef()，
                              //将ref容器交给需要获取的标签元素<xx ref={this.gg}><xx/>，通过ref容器读取标签元素this.gg.current.方法名
              const detail = this.editor.current.getDetail();
              const product ={
                name,desc,price,pCategoryId,categoryId,imgs,detail
              }
              //更新，添加——id
              if(this.isUpdate){
                  product._id = this.product._id
              }
              const result = await reqAddOrProduct(product);
              if(result.status === 0){
                  message.success(`${this.isUpdate?"更新成功":"添加成功"}`)
                  this.props.history.goBack()
              }else{
                  message.error(`${this.isUpdate?"添加成功":"添加失败"}`)
              }
            }
          });
    }
    validatePrice =(rule,value,callback) =>{
        if(value <0){
            callback("价格不能为负数");
        }else{
            callback();
        }
    }
    componentWillMount(){
        const product = this.props.location.state;
        this.isUpdate = !!product;
        this.product = product?product.product:{};
        
    }
    componentDidMount(){
        this.getCategory('0')
    }
     render(){
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 8},
          };
        const categoryIds=[];
        const {pCategoryId,categoryId,imgs,detail} = this.product;
        if(this.isUpdate){
            if(pCategoryId === "0"){
                categoryIds.push(pCategoryId)
            }else{
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
                
            }
        }
         const title= (
            <span>
                <Icon type="arrow-left" style={{marginRight:15,color:"green"}} onClick={this.callBackPage}/>
                <span>{this.isUpdate?"修改商品":"添加商品"}</span>
            </span>
         )
         const { getFieldDecorator } = this.props.form;
         return(
             <div className="product-add"> 
                <Card title={title}>
                    <Form {...formItemLayout} className="login-form">
                        <Form.Item label="商品名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '此项不能为空!' }],
                            initialValue:this.product.name,
                        })(
                            <Input
                            placeholder=""
                            />,
                        )}
                        </Form.Item>
                        <Form.Item label="商品描述">
                        {getFieldDecorator('desc', {
                            rules: [{ required: true, message: '此项不能为空!' }],
                            initialValue:this.product.desc,
                        })(
                            <TextArea placeholder="请输入商品描述" autosize></TextArea>
                        )}
                        </Form.Item>
                        <Form.Item label="商品价格">
                        {getFieldDecorator('price', {
                            rules: [
                                { required: true, message: '此项不能为空!' },
                                { validator:this.validatePrice },

                            ],
                            initialValue:this.product.price,
                        })(
                            <Input
                            type="number"
                            placeholder=""
                            addonAfter="元"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item label="商品分类">
                        {getFieldDecorator('categoryIds', {
                            rules: [{ required: true, message: '此项不能为空!' }],
                            initialValue:categoryIds,
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                               
                            />
                        )}
                        </Form.Item>
                        <Form.Item label="商品图片">
                            <PicturesWall ref={this.myRef} imgs={imgs}></PicturesWall>
                        </Form.Item>
                        <Form.Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                            <RichTextEditor ref ={this.editor} detail={detail}></RichTextEditor>
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" onClick={this.submitForm}>
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                   
                 </Card>
             </div>
         )
     }
 }
 export default Form.create()(ProductAddUpdate);