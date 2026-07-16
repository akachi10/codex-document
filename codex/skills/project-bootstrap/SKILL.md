---
name: project-bootstrap
description: 参考项目克隆式启动新项目。当用户明确授权按参考项目创建或实现新项目时使用——复刻架构但彻底独立化资源，在授权范围内推进到可体验再交付。用户仅表达方向、设想或未来计划时不要触发执行。源自 santagiustina 一天从零到上线（3 Sprint、81 E2E 全 PASS）的完整实践。
---

# 项目克隆式启动（project-bootstrap）

## 何时使用

用户指定一个既有项目为参考，要求新项目复用其技术架构、部署方式、工程纪律。

## 流程

### 1. 吸收参考项目契约
读参考项目的 AGENTS.md、docs/architecture/、docs/ops/（部署形态、端口表、密钥管理方式）。产出新项目的 docs/architecture/overview.md + tech-stack.md（可派 system-architect，注意其无 Write 权限——以文本回传由 session 落盘）。

### 2. 复刻骨架
- 目录结构、子项目划分（api/admin/web/h5）与参考项目同构
- API 约定原样继承：ApiResponse 包装、BusinessException、OpenAPI 注解、varchar(32) UUID 主键、禁物理外键、五源同步
- 工程纪律原样继承：TDD、common-methods.md、human/+docs/ 双目录

### 3. 资源独立化清单（逐项切换并验证，禁止与参考项目共享）

| 资源 | 动作 | 验证 |
|---|---|---|
| 数据库 | 新建独立库 | psql 连新库确认 schema 只属于新项目 |
| 对象存储 | 新桶（dev/prod 分桶——曾因共享桶误删生产图） | 上传/读取走新桶 |
| OAuth/Firebase | 新应用/新项目 | 登录流程走新凭证 |
| 端口 | 分配不冲突的新端口并登记 docs/ops/ | lsof 无冲突 |
| 域名/证书 | 新域名 + K3s ingress | 公网可访问 |
| 密钥 | 全新生成，env 注入，禁 git | git grep 无真值 |

### 4. 在授权范围内推进到可体验
- 只有用户已经明确授权“创建/实现/部署”及其范围时，才在该范围内推进；用户仅表达方向、设想或未来计划时，先确认理解和是否现在执行，不把方向表达当成立项授权
- 架构选择等可逆实现细节可在授权范围内自主决定；账号、付费资源、域名、外部凭证、生产部署、对外发布等新增权限或高影响动作必须先取得明确授权
- 缺少外部凭证时，只有用户同意使用假实现/降级路径后才这样推进；不得静默伪造真实集成或把占位实现报告为已接通
- 前端必须先建 docs/design/ 规范再编码，应用 frontend-design skill

### 5. 收口
- 部署到与参考项目同一套基础设施（同服务器 K3s 等），更新 docs/ops/status.md
- 仅在用户明确授权部署和远端写入后执行 commit / push；给用户一份"已上线 + 待用户动作清单"（创建正式账号、换正式凭证等）
