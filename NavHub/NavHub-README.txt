NavHub 技术栈说明（V1 → 可演进到 App）
一、整体架构原则
	~前后端完全分离
	~Web 先行，App 可迁移
	~功能优先，样式可迭代
	~所有设计以「未来可复用」为前提

二、前端技术栈（Web V1）
	1. 核心技术
		~框架：React 18
		~语言：TypeScript
		~构建工具：Vite
		~包管理：npm（或 pnpm，二选一）
		~路由：react-router-dom
		~请求库：axios

	2. 样式方案
		~CSS 框架：Tailwind CSS
		~PostCSS：已启用（用于 Tailwind / autoprefixer）
		~设计目标：
			V1：干净、克制、功能导向
			V2：可升级为 Glassmorphism / 深色模式

	3. 推荐前端目录结构
		src/
	 ├─ api/            # 所有后端接口封装
	 │   ├─ auth.ts
	 │   ├─ category.ts
	 │   └─ tool.ts
	 │
	 ├─ components/     # 可复用组件（卡片、侧栏、Header）
	 │
	 ├─ layouts/        # 页面布局（左侧栏 + 主内容）
	 │
	 ├─ pages/          # 页面级组件
	 │   ├─ Login.tsx
	 │   ├─ Home.tsx
	 │   └─ Admin.tsx
	 │
	 ├─ hooks/          # 业务逻辑 Hooks
	 │   ├─ useAuth.ts
	 │   └─ useTools.ts
	 │
	 ├─ styles/         # 全局样式 / Tailwind 扩展
	 │
	 ├─ router/         # 路由配置
	 │
	 └─ main.tsx

	4. 前端开发约束（为未来 App 做准备）
		~业务逻辑写在 hooks 中，不写死在组件
		~API 调用统一放在 api/ 目录
		~不在前端做权限判断（交给后端）
		~不依赖 hover
		~UI 与数据结构解耦

三、后端技术栈（服务端）
	1. 核心技术
		~语言：Java 17
		~框架：Spring Boot 3
		~Web 框架：Spring Web
		~ORM：MyBatis 或 JPA（二选一）
		~数据库：MySQL 8
		~构建工具：Maven
	2. 后端模块
		controller/   # 接口层
		service/      # 业务逻辑
		mapper/       # 数据访问
		entity/       # 数据模型
		config/       # 安全 / 跨域 / 通用配置
	3. 后端职责边界
		~权限校验在后端完成
		~分类排序 / 可见性由后端控制
		~返回前端的是“最终可用数据”
		~后端不关心 Web / App 区别

四、前后端通信规范
	~协议：REST API
	~数据格式：JSON
	~认证方式：Token（V1 简化版，V2 可升级）
	~错误处理：统一返回结构
	{
	  "code": 0,
	  "message": "ok",
	  "data": {}
	}

五、数据库（MySQL）建议结构（概念级）
	~用户表（user）
	~分类表（category）
	~工具表（tool）
	~收藏表（favorite）
	~标签表（tag，可选）
	具体字段可以在功能开发阶段逐步补齐

六、给 Cursor 的一句“隐含指令”（你可以直接用）
	“这是一个前后端分离的 React + Spring Boot 项目，请严格遵循现有目录结构，业务逻辑与 UI 解耦，避免一次性写死样式，优先保证功能可扩展性。”