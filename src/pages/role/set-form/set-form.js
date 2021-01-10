
import React from "react";
import { Tree,Form, Input} from 'antd';
import PropTypes from "prop-types";
import menuConfig from "../../../config/menuConfig.js"
const { TreeNode } = Tree;
export default class SetForm extends React.Component{
    static propTypes ={
        role:PropTypes.object
    }
    constructor(props){
        super(props)
        const {menus} = this.props.role;
        this.state={
            checkKeys:menus
        }
    }
    getCheckedList =() =>this.state.checkKeys;
    getTreeList =(menuConfig)=>{
        return menuConfig.reduce((pre,item)=>{
                pre.push(<TreeNode title={item.title} key={item.key} >
                    {item.children?this.getTreeList(item.children):null}
                </TreeNode>) 
                return pre    
        },[])
    }
    onCheck = (checkedKeys) => {
        this.setState({
            checkKeys:checkedKeys
        })
      };
    componentWillMount(){
        this.treeNodes = this.getTreeList(menuConfig)
    }
    //根据新传入的role来更新checkedKeys状态
    componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus;
        this.setState({
            checkKeys:menus
        })
    }
    render(){
        const {checkKeys} = this.state;
        return(
           <div>
               <Form.Item  label="角色名称" labelCol={{span:4}} wrapperCol={{span:16}} >
                        <Input value={this.props.role.name}disabled />
                    </Form.Item>
               <Tree
                checkable
                defaultExpandAll={true}
                checkedKeys={checkKeys}
                onSelect={this.onSelect}
                onCheck={this.onCheck}
            >
                <TreeNode title="平台权限" key="all">
                 {this.treeNodes}
                </TreeNode>
            </Tree>
           </div> 
            
        )
    }
}
