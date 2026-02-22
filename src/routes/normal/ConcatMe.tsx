import { Card, Tabs, Image, TabsProps, Alert } from "antd"
export default function DefaultTemplate() {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '微信',
            children: <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image width={200} src="https://www.qidong.tech:5173/resource/wx_lqd.jpg"></Image>
            </div>,
        },
        {
            key: '2',
            label: 'QQ',
            children: <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Image width={200} src="https://www.qidong.tech:5173/resource/qq_lqd.jpg"></Image>
            </div>,
        },
    ];
    return (<>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', borderRadius: "10px" }}>
            <div className="top-img" style={{
                height: '200px', backgroundImage: 'url(https://oss.qidong.tech/prod/2026/02/11/20260211133249218_68c32c85f5acd348bc022357ea5321c9.png)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                borderTopLeftRadius: 'inherit',
                borderTopRightRadius: 'inherit',
            }}></div>
            <div className="main-content">
                <Card style={{ borderRadius: 'initial' }}>
                    <h1>基本情况</h1>
                    <p>
                        <strong>联系方式: &nbsp;&nbsp;</strong>
                        <span>
                            扣扣:<a href="mailto:2548818216@qq.com">2548818216@qq.com</a>;
                            WX:<a href="weixin://dl/chat?username=kydon03">kydon03</a>;
                        </span>
                    </p>
                    <p>
                        <strong>个人爱好: &nbsp;&nbsp;</strong>
                        <span>独立思考; 参阅古文; 经济金融; 全栈开发; 大模型开发; 智能体开发与应用;</span>
                    </p>
                </Card>
                <Card style={{ borderRadius: 'initial' }}>
                    <h1>公开作品集</h1>
                    <ol>
                        <li>
                            <strong>PRY判题系统: &nbsp;&nbsp;</strong>
                            <span>
                                <a target="_blank" href="https://pry.jsu.edu.cn/">https://pry.jsu.edu.cn/</a>
                            </span>
                        </li>
                        <li>
                            <strong>DBLOG博客系统: &nbsp;&nbsp;</strong>
                            <span>
                                <a target="_blank" href="https://www.qidong.tech/">https://www.qidong.tech/</a>
                            </span>
                        </li>
                        <li>
                            <strong>IMGM相册管理系统: &nbsp;&nbsp;</strong>
                            <span>
                                <a target="_blank" href="https://github.com/Kydon-ai/IMGM">https://github.com/Kydon-ai/IMGM</a>
                            </span>
                        </li>
                    </ol>
                </Card>
                <Card style={{ borderRadius: 'initial' }}>
                    <h1>个人经历</h1>
                    <p>
                        <strong>开发经验: &nbsp;&nbsp;</strong>
                        <span>4年; 共计负责与参与大小项目20+项;</span>
                    </p>
                    <p>
                        <strong>掌握框架与技能: &nbsp;&nbsp;</strong>
                        <p>Vue; WebPack; JavaScript; Naive UI; Element Plus; HTML; CSS; Electron;</p>
                        <p>React; Vite; TypeScript; Ant Design;</p>
                        <p>OpenAI Spec; MCP; A2A; Skills;</p>
                        <p>Git;Docker; Nginx; N8N; Comfy UI;</p>
                        <p>Python; JavaScript; C++; Rust;</p>
                        <p>现在转行做大模型开发、AI Agent、短剧生成、PPT生成等</p>
                    </p>
                    <p>
                        <strong>涉及场景: &nbsp;&nbsp;</strong>
                        <p>Web开发; 移动端APP; 微信小程序; 快应用; 服务运维; 基模训练; RAG; AI Agent</p>
                    </p>
                    <p>
                        <strong>实习经历: &nbsp;&nbsp;</strong>
                        <p>中和农信农业集团有限公司 金融科技部 前端开发实习生 核心ToB业务</p>
                        <p>深圳市乐途宝网络科技有限公司 前端开发实习生 企业ToB业务</p>
                    </p>
                </Card>
                <Card style={{
                    borderTopLeftRadius: 'initial',
                    borderTopRightRadius: 'initial',
                }}>
                    <h1>加我好友</h1>
                    <Tabs defaultActiveKey="1" centered items={items}> </Tabs>
                </Card>
                <Alert message="嗯哼？你又来视奸我啦(￣ω￣;)" type="info" ></Alert>
            </div>
        </div>
    </>)
}