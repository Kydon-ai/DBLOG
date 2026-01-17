import { useState, FC } from "react";
import { Link, Outlet } from "react-router-dom";
import { Button } from "antd";
import "./App.css";

const AppStyle: React.CSSProperties = {
  textAlign: 'center'
};

const App: FC = () => {
  const [count, setCount] = useState<number>(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div style={AppStyle}>
      <header>
        <h1>岁月诗史</h1>
        <p className="read-the-docs">劉啓東's BLOG</p>
      </header>
      
      <main>
        <div>
          <p>刘启东的岁数：{count}</p>
          <Button type="primary" onClick={handleClick}>
            点我加一岁
          </Button>
        </div>
        
        <nav>
          <Link to="/">主页</Link>
        </nav>
        
        {/* 路由内容将在这里渲染 */}
        <Outlet />
      </main>
      
      <footer>
        <p>&copy; 2024 岁月诗史 - 刘启东的个人博客</p>
      </footer>
    </div>
  );
};

export default App;
