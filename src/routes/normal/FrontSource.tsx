import { Avatar, List } from "antd";
import "./shitMedia.css"
const data = [
    {
        url: 'https://interviewguide.cn/',
        avatarImg: 'https://interviewguide.cn/images/personal/logo.png',
        title: '阿秀的学习笔记',
        description: '计算机基础学习入门指南',
    }, 
    {
        url: 'https://vue3js.cn/interview/',
        avatarImg: 'https://vue3js.cn/assets/img/93624428-53932780-f9ae-11ea-8d16-af949e16a09f.png',
        title: 'Vue3面试题总结',
        description: 'Vue3 One Piece',
    }, 
    {
        url: 'https://www.yuque.com/cuggz',
        avatarImg: 'https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*PXAJTYXseTsAAAAAAAAAAAAADvuFAQ/original',
        title: '前端充电宝',
        description: '前端工程师个人前端语雀笔记',
    }, 
    // {
    //     url: 'https://interviewguide.cn/',
    //     avatarImg: 'https://interviewguide.cn/images/personal/logo.png',
    //     title: 'Ant Design Title 1',
    //     description: '这是资源站描述',
    // }, 
    {
        url: 'https://interview.poetries.top/',
        avatarImg: 'https://interview.poetries.top/logo.png',
        title: '前端进阶之旅',
        description: '付费前端面经(可以先看看上面的资源)',
    }, 
    // {
    //     url: 'https://interviewguide.cn/',
    //     avatarImg: 'https://interviewguide.cn/images/personal/logo.png',
    //     title: 'Ant Design Title 1',
    //     description: '这是资源站描述',
    // }, 
    
];
export default function FrontSource() {
  return (
      <List
        itemLayout="horizontal"
        dataSource={data}
        style={{backgroundColor: 'white',marginTop:'15px'}}
        renderItem={(item, index) => (
        <List.Item>
            <List.Item.Meta
            avatar={<Avatar src={item.avatarImg} />}
            title={<a href={item.url}>{item.title}</a>}
            description={item.description}
            />
        </List.Item>
        )}
    />
  );
}