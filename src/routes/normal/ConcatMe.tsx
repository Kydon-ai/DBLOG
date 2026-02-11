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
                <Card hoverable style={{ borderRadius: 'initial' }}>
                    <h1>基本情况</h1>
                    <p>
                        <strong>曾用网名: &nbsp;&nbsp;</strong>
                        <span>云深不知处;</span>
                    </p>
                    <p>
                        <strong>励己名言: &nbsp;&nbsp;</strong>
                        <span> <a href="https://baijiahao.baidu.com/s?id=1629150673782461819&wfr=spider&for=pc" target="_blank">我亦是我,我将无我</a>                            ;</span>
                    </p>
                    <p>
                        <strong>联系方式: &nbsp;&nbsp;</strong>
                        <span>
                            扣扣:<a href="mailto:2548818216@qq.com">2548818216@qq.com</a>;
                            WX:<a href="weixin://dl/chat?username=_qidong2003">_qidong2003</a>;
                        </span>
                    </p>
                    <p>
                        <strong>自我介绍: &nbsp;&nbsp;</strong>
                        <span>来自十八线乡村,非标准农村做题家;</span>
                    </p>
                    <p>
                        <strong>个人爱好: &nbsp;&nbsp;</strong>
                        <span>独立思考;参阅古文;经济金融;网页开发;</span>
                    </p>
                </Card>
                <Card hoverable style={{ borderRadius: 'initial' }}>
                    <h1>个人经历</h1>
                    <p>
                        <strong>开发经验: &nbsp;&nbsp;</strong>
                        <span>2.5年;共计负责与参与大小项目12项;</span>
                    </p>
                    <p>
                        <strong>技术框架: &nbsp;&nbsp;</strong>
                        <span>Vue; React; WebPack; Vite; TypeScript; Naive UI; Ant Design; Electron; WebSocket; Nginx;</span>
                    </p>
                    <p>
                        <strong>涉及场景: &nbsp;&nbsp;</strong>
                        <span>Web界面;移动端APP;微信小程序;快应用;</span>
                    </p>
                    <p>
                        <strong>实习经历: &nbsp;&nbsp;</strong>
                        <span>中和农信农业集团有限公司(前端开发实习生);</span>
                    </p>
                    <p>
                        <strong>早期博客: &nbsp;&nbsp;</strong>
                        <span><a href="https://blog.csdn.net/m0_72678953?type=blog" target="_blank">JSU曾是此间年少&nbsp;的博客</a></span>
                    </p>
                </Card>
                <Card hoverable style={{
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