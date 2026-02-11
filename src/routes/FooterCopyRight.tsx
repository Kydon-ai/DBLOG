// components/FooterCopyright.js
// import React from 'react';
import { useEffect, useState } from 'react';
import { Image } from 'antd';
import './FooterCopyright.css';

const FooterCopyright = () => {
  const [timeDiff, setTimeDiff] = useState(0);

  // 目标日期：2024年8月21日00:00:00
  const targetDate = new Date('2024-08-21T00:00:00.000Z');

  // 计算时间差并更新状态
  const calculateDifference = () => {
    const now = new Date().getTime();
    const diff = now - targetDate.getTime();

    // 确保时间差非负（应用场景保证在目标日期之后）
    setTimeDiff(Math.max(diff, 0));
  };

  // 初始化和实时更新
  useEffect(() => {
    calculateDifference();
    const interval = setInterval(calculateDifference, 1000);

    return () => clearInterval(interval);
  }, []);

  // 格式化时间差
  const formatTime = (diff: number) => {
    if (diff === 0) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0 };

    const TIME_MS = 1
    const TIME_S = 1000 * TIME_MS
    const TIME_M = 60 * TIME_S
    const TIME_H = 60 * TIME_M
    const TIME_D = 24 * TIME_H
    const TIME_W = 7 * TIME_D
    const TIME_MONTH = 30 * TIME_D
    const TIME_Y = 12 * TIME_MONTH

    const years = Math.floor(diff / TIME_Y); diff -= years * TIME_Y;
    const months = Math.floor(diff / TIME_MONTH); diff -= months * TIME_MONTH;
    const days = Math.floor(diff / TIME_D); diff -= days * TIME_D;
    const hours = Math.floor(diff / TIME_H); diff -= hours * TIME_H;
    const minutes = Math.floor(diff / TIME_M); diff -= minutes * TIME_M;
    const seconds = Math.floor(diff / TIME_S); diff -= seconds * TIME_S;
    const ms = diff;

    return { years, months, days, hours, minutes, seconds, ms };
  };

  // 解构格式化后的时间数据
  const { years, months, days, hours, minutes, seconds, ms } = formatTime(timeDiff);
  console.log(String(days))
  // 动态构建显示字符串
  const timeComponents = [
    years > 0 ? `${String(years).padStart(2, "0")}年` : '',
    months > 0 ? `${String(months).padStart(2, "0")}个月` : '',
    days > 0 ? `${String(days).padStart(2, "0")}天` : '',
    hours > 0 ? `${String(hours).padStart(2, "0")}小时` : '',
    minutes > 0 ? `${String(minutes).padStart(2, "0")}分钟` : '',
    seconds > 0 ? `${String(seconds).padStart(2, "0")}秒` : '',
    `${String(ms).padStart(3, "0")}毫秒`
  ].filter(Boolean).join(' ');

  return (
    <div className="copyright">
      <p>© 2024-2026 www.qidong.tech &nbsp;
        {/* 20240821 */}
        <span>本站已运行：{timeComponents}</span>
      </p>

      <p className='filing'>
        {/* <strong>ICP备案信息：</strong> */}
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
          湘ICP备2024098725号
        </a> &nbsp;&nbsp;
        <Image
          src={"/img/ba.png"}
          width={15} // 按实际尺寸调整
          preview={false}
          alt="公安备案标识"
        />
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002006655" rel="noreferrer" target="_blank">粤公网安备44030002006655号</a>
      </p>
    </div>
  );
};

export default FooterCopyright;