// 使用react-redux的hooks来给一般组件获取全局状态
import { useSelector, useDispatch } from "react-redux";
// 导入reducer里面的方法
import { addNums, reduce } from "../store/globalSlice";
// 导入状态类型 用于寻找该状态
import { GlobalState } from "../store/store";
// 导入antd组件
import { Button } from "antd";
export default function ShowState() {
	const isLogin = useSelector((state: GlobalState) => state.global.isLogin);
	const count = useSelector((state: GlobalState) => state.global.clickNums);
	console.log("打印日志", isLogin);
	const dispatch = useDispatch();

	function handleAdd() {
		dispatch(addNums());
	}
	function handleDecrease() {
		dispatch(reduce());
	}
	return (
		<>
			<p>这是测试状态共享的页面</p>
			{/* 展示静态的状态 */}
			<div>查看计数：{String(count)}</div>
			<Button onClick={handleAdd}>增加</Button>
			<Button onClick={handleDecrease}>减少</Button>
		</>
	);
}
