import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface AuthGuardProps {
	children: React.ReactNode;
}

/**
 * 路由鉴权组件
 * 用于保护需要登录才能访问的路由
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const navigate = useNavigate();

	// 简单的鉴权逻辑：检查localStorage中是否存在用户信息
	// 实际项目中可以根据需求修改为更复杂的认证逻辑
	const isAuthenticated = useAppStore.getState().isLogin;

	// 如果未认证，重定向到首页或登录页
	// 这里为了演示，简单地显示一个未授权提示
	if (!isAuthenticated) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
					<strong className="text-2xl font-bold text-gray-800 mb-4">未授权访问</strong>
					<p className="text-gray-600 mb-6">您需要先登录才能访问此页面</p>
					<button
						onClick={() => navigate('/')}
						className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
					>
						返回首页
					</button>
				</div>
			</div>
		);
	}

	// 如果已认证，渲染被保护的组件
	return <>{children}</>;
};

export default AuthGuard;
