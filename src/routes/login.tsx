// import LoginImg from "../assets/more-leaves.png";
import LoginImg from "/img/Pikachu.png";
import { Card, Tabs, Input, Button, message } from "antd";
import type { TabsProps } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import request from "../utils/https/request";
// 从request.ts中导入getAuthToken函数
declare function getAuthToken(): string;

const loginCSS: React.CSSProperties = {
	position: "relative",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	minHeight: "100vh",
	// backgroundImage: `url(${LoginImg})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
};

const cardCSS: React.CSSProperties = {
	display: "flex",
	maxWidth: "50%",
	width: "100%",
	margin: "0 20px",
};

const cardItemCSS: React.CSSProperties = {
	display: "flex",
	minWidth: "50%",
	maxWidth: "50%",
};

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [loginForm, setLoginForm] = useState({
		username: "",
		password: "",
	});
	const [registerForm, setRegisterForm] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		email: "",
	});
	const navigate = useNavigate();
	const { setLogin, setToken, setUserInfo, setRoutes, setPermissions } = useAppStore();

	const handleLogin = async () => {
		if (!loginForm.username || !loginForm.password) {
			message.error("请输入用户名和密码");
			return;
		}

		setLoading(true);
		try {
			const response = await request.post("/api/auth/login", loginForm);

			if (response.access_token && response.user) {
				// 存储登录状态和令牌
				console.log('Login response - access_token:', response.access_token);
				setLogin(true);
				setToken(response.access_token);
				// 同时直接保存到localStorage（作为后备）
				const appStorage = localStorage.getItem('app-storage');
				if (appStorage) {
					try {
						const parsed = JSON.parse(appStorage);
						parsed.token = response.access_token;
						localStorage.setItem('app-storage', JSON.stringify(parsed));
						console.log('Login - updated app-storage:', parsed);
					} catch (error) {
						console.error('Login - failed to update app-storage:', error);
					}
				}
				setUserInfo({
					id: response.user.id,
					username: response.user.username,
					email: response.user.email,
					full_name: response.user.full_name || "",
					role: response.user.role || "user",
					created_at: response.user.created_at || new Date().toISOString(),
				});

				// 存储路由模板和权限信息
				if (response.routes) {
					setRoutes(response.routes);
				}
				if (response.permissions) {
					setPermissions(response.permissions);
				}

				message.success("登录成功");
				// 延迟检查localStorage，确保Zustand的persist中间件有时间保存
				setTimeout(() => {
					const appStorage = localStorage.getItem('app-storage');
					console.log('Login - final app-storage:', appStorage ? JSON.parse(appStorage) : 'none');
					const token = getAuthToken();
					console.log('Login - getAuthToken after login:', token);
				}, 500);
				navigate("/");
			} else {
				message.error("登录失败，请检查用户名和密码");
			}
		} catch (error) {
			console.error("登录失败:", error);
			message.error("登录失败，请稍后重试");
		} finally {
			setLoading(false);
		}
	};

	const handleRegister = async () => {
		if (!registerForm.username || !registerForm.password) {
			message.error("请填写完整的注册信息");
			return;
		}

		if (registerForm.password !== registerForm.confirmPassword) {
			message.error("两次输入的密码不一致");
			return;
		}

		setLoading(true);
		try {
			const response = await request.post("/api/auth/register", {
				username: registerForm.username,
				password: registerForm.password,
				email: registerForm.email,
			});

			if (response.status === "created") {
				message.success("注册成功，请登录");
				// 切换到登录标签
				const tabs = document.querySelector(".ant-tabs-tab:nth-child(1)") as HTMLElement;
				if (tabs) {
					tabs.click();
				}
			} else {
				message.error("注册失败，请稍后重试");
			}
		} catch (error) {
			console.error("注册失败:", error);
			message.error("注册失败，请稍后重试");
		} finally {
			setLoading(false);
		}
	};

	const tableItems: TabsProps["items"] = [
		{
			key: "1",
			label: "登录",
			children: (
				<div style={{ display: "flex", flexDirection: "column" }}>
					<Input
						placeholder="请输入用户名"
						prefix={<UserOutlined />}
						style={{ marginBottom: "15px" }}
						value={loginForm.username}
						onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
						onPressEnter={handleLogin}
					/>
					<Input.Password
						placeholder="请输入密码"
						prefix={<LockOutlined />}
						style={{ marginBottom: "20px" }}
						value={loginForm.password}
						onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
						onPressEnter={handleLogin}
					/>
					<Button
						onClick={handleLogin}
						style={{ justifyContent: "center" }}
						type="primary"
						loading={loading}
						size="large"
					>
						点击登录
					</Button>
				</div>
			),
		},
		{
			key: "2",
			label: "注册",
			children: (
				<div style={{ display: "flex", flexDirection: "column" }}>

					<Input
						placeholder="请输入预注册用户名"
						prefix={<UserOutlined />}
						style={{ marginBottom: "12px" }}
						value={registerForm.username}
						onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
					/>
					{/* <Input
						placeholder="请输入您的邮箱"
						prefix={<MailOutlined />}
						style={{ marginBottom: "12px" }}
						value={registerForm.email}
						onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
					/> */}
					<Input.Password
						placeholder="请输入预注册密码"
						prefix={<LockOutlined />}
						style={{ marginBottom: "12px" }}
						value={registerForm.password}
						onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
					/>
					<Input.Password
						placeholder="请确认预注册密码"
						prefix={<LockOutlined />}
						style={{ marginBottom: "20px" }}
						value={registerForm.confirmPassword}
						onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
					/>
					<Button
						onClick={handleRegister}
						style={{ justifyContent: "center" }}
						type="primary"
						loading={loading}
						size="large"
					>
						点击注册
					</Button>
				</div>
			),
		},
	];

	return (
		<div style={loginCSS}>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "-200px" }}>
				<Card style={cardCSS} styles={{ body: { display: 'flex' } }}>
					<Card style={{ ...cardItemCSS, padding: 0 }} styles={{ body: { display: 'flex' } }}>
						<img
							src={LoginImg}
							alt="图片加载失败"
							style={{ height: "100%", width: "100%", objectFit: "cover" }}
						/>
					</Card>
					<Card style={{ ...cardItemCSS, padding: "30px" }} styles={{ body: { display: 'flex', flexDirection: 'column' } }}>
						<h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", textAlign: "center" }}>
							DBLOG
						</h2>
						<Tabs
							defaultActiveKey="1"
							items={tableItems}
							centered
						></Tabs>
					</Card>
				</Card>
			</div>
		</div >
	);
}