import { useState } from 'react';
import { Input, Button, Card, message } from 'antd';
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const StringTool = () => {
	const [input, setInput] = useState('');
	const [output, setOutput] = useState('');
    const splitChar = ','
	const handleProcess = () => {
		if (!input.trim()) {
			message.warning('请输入要处理的字符串');
			return;
		}
		const items = input.split(splitChar).map((s) => s.trim()).filter((s) => s);
		const uniqueItems = [...new Set(items)];

		// 排序：数字在前（按数字大小），其他按字典序
		const sortedItems = uniqueItems.sort((a, b) => {
			const numA = Number(a);
			const numB = Number(b);
			const isNumA = !isNaN(numA) && a.trim() !== '';
			const isNumB = !isNaN(numB) && b.trim() !== '';

			if (isNumA && isNumB) {
				return numA - numB;
			}
			if (isNumA) return -1;
			if (isNumB) return 1;
			return a.localeCompare(b);
		});

		setOutput(sortedItems.join(splitChar));
		message.success(`处理完成：去重前 ${items.length} 项，去重后 ${sortedItems.length} 项`);
	};

	const handleReset = () => {
		setInput('');
		setOutput('');
	};

	const handleCopy = () => {
		if (output) {
			navigator.clipboard.writeText(output);
			message.success('已复制到剪贴板');
		}
	};

	return (
		<div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
			<Card title="字符串去重工具" bordered={false}>
				<div style={{ marginBottom: '16px' }}>
					<p style={{ marginBottom: '8px', color: '#666' }}>
						输入由英文分号 <code>;</code> 分割的字符串，点击处理后自动去重
					</p>
					<TextArea
						rows={6}
						placeholder="例如：苹果;香蕉;苹果;橙子;香蕉"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>

				<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
					<Button type="primary" onClick={handleProcess}>
						处理
					</Button>
					<Button icon={<CopyOutlined />} onClick={handleCopy} disabled={!output}>
						复制结果
					</Button>
					<Button icon={<ReloadOutlined />} onClick={handleReset}>
						重置
					</Button>
				</div>

				{output && (
					<div>
						<p style={{ marginBottom: '8px', fontWeight: 500 }}>处理结果（分号分割）：</p>
						<TextArea rows={20} value={output} readOnly />
					</div>
				)}
			</Card>
		</div>
	);
};

export default StringTool;
