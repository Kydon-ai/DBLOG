import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface AuthGuardProps {
	children: React.ReactNode;
	requiredRole?: 'user' | 'premium' | 'admin';
}

/**
 * 通用路由鉴权组件
 * 用于保护需要特定权限才能访问的路由
 * - requiredRole: 可选，指定所需的最低权限级别
 *   - 不设置: 所有人都能访问
 *   - 'user': 登录用户能访问
 *   - 'premium': 高级用户能访问
 *   - 'admin': 管理员能访问
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
	const navigate = useNavigate();

	// 实际项目中可以根据需求修改为更复杂的认证逻辑
	const isAuthenticated = useAppStore.getState().isLogin;
	const userRole = useAppStore.getState().userInfo?.role;

	// 如果不需要认证，直接渲染
	if (!requiredRole) {
		return <>{children}</>;
	}

	// 如果未认证，重定向到首页
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

	// 检查权限级别
	const hasPermission = () => {
		switch (requiredRole) {
			case 'user':
				// 登录用户就能访问
				return true;
			case 'premium':
				// 高级用户或管理员能访问
				return userRole === 'premium' || userRole === 'admin';
			case 'admin':
				// 只有管理员能访问
				return userRole === 'admin';
			default:
				return false;
		}
	};

	// 如果权限不足，拒绝访问
	if (!hasPermission()) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
					<strong className="text-2xl font-bold text-gray-800 mb-4">权限不足</strong>
					<p className="text-gray-600 mb-6">您没有足够的权限访问此页面</p>
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

	// 如果已认证且有权限，渲染被保护的组件
	return <>{children}</>;
};

export default AuthGuard;