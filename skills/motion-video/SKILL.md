---
name: motion-video
description: 用 motion.so（Mosaic Motion，AI 文字生成成片视频平台）生成产品引导视频 / 宣传片 / 演示视频 / 发布视频，并做多语言配音版本。当用户说「用 motion 做个视频」「做个宣传片 / 引导视频 / 开机介绍 / 产品演示 / launch video」「把这个功能做成视频」「配音换成中文 / 西语」，或任何需要 AI 生成一段成片视频（含配音、字幕、动效）的任务时使用。本机已配好 motion.so 的 MCP 与 API key，不要让用户登录、不要去网站找 key。注意：motion.so ≠ motion.dev（Framer Motion 动画库）≠ motionapp.com（广告分析），后两者不归本 skill。
---

# motion-video — 用 motion.so 生成视频

## 0. 它是什么、凭证在哪

- **motion.so** = "Kai" AI 导演：给一份**简报**（目标、受众、语气、要点、素材），它出成片（画面 + 配音 + 字幕 + 音乐）。**不要写分镜脚本**，写简报。
- **凭证唯一来源**：`~/.claude.json` → `mcpServers.motion.headers.Authorization`（`Bearer motion_…`）。Claude Code 里 MCP 服务器名为 `motion`，新会话自动挂载工具；其他 agent（Codex 等）或工具未挂载时用本 skill 的脚本直调，脚本自动从该文件读 key。**禁止把 key 抄进任何文档 / 仓库 / 记忆。**
- 账号消耗**积分**（credit）。一条 15 秒片约 150~200 积分，followup 改版约 150。动手前先查余额，不足时告诉用户去 motion.so 充值，**不要替用户下单**。

## 1. 直调脚本（工具未挂载时）

```bash
S=~/.claude/skills/motion-video/scripts/motion_call.py
python3 $S whoami '{}'                                   # 验证 key
python3 $S get_credit_balance '{}'                        # 查积分
python3 $S upload_asset '{"filename":"a.png","content_type":"image/png"}'
python3 $S create_video '<json args>'
python3 $S get_session_status '{"job_id":"…"}'
python3 $S create_followup '{"job_id":"…","prompt":"…"}'
```

`motion_run.py` 封装了整条流水线（上传素材 → 提交 → 轮询 → 下载），见 § 4。

## 2. 标准流程

1. **摸产品**：读产品定义 / 设计规范（配色、风格名）/ 商店文案；**找真实界面截图**（提审用的脱敏截图最合适）。视频里的 UI 必须是真界面，禁止让它自造。
2. **上传素材**：`upload_asset` 取签名 URL → `curl -F <fields> -F "file=@path" <upload_url>`（**file 字段必须最后**，期望 HTTP 204）→ 得 `attachment_url`（7 天有效）。App 图标 + 3~5 张关键页面足够，别堆。
3. **写简报**（英文效果最稳，结构见 § 3）→ `create_video`：
   - `aspect_ratio`：App 内播放 / 手机端 `9:16`；官网 / YouTube `16:9`
   - `duration`：`<10s` / `10-30s` / `30s-1min` / `1-5min`
   - `design_system_id`：`apple`（苹果风）/ `linear` / `vercel` / `stripe` … 或 `design_md` 传自定义 DESIGN.md
   - `attachments`：`[{"url","name","type":"image"}]`
4. **轮询** `get_session_status` 每 60s；`status` 为 `completed` 时 `output.download_url` 可下，**签名 URL 1 小时过期，立刻下载落盘**。
5. **多语言 / 改版**：`create_followup(job_id, prompt)`，同一 job 上串行改；画面不重做只换配音字幕。
6. **验收**：`ffprobe` 看时长分辨率；`ffmpeg` 抽帧拼 contact sheet 用 Read 看图，核对：用的是不是真界面、字幕语言对不对、有没有违禁元素。
7. 成片放项目的 `docs/ops/store-assets/video/`（或用户指定处），大文件默认不入 git，交付时说明。

## 3. 简报结构（create_video 的 prompt）

```
GOAL        一句话：这条视频给谁看、看完该知道 / 做什么（引导视频 ≠ 宣传片，先定性）
PRODUCT     产品是什么、品牌色、风格名、附件里每张图是什么页
AUDIENCE    谁、什么处境、现在用什么笨办法
TONE        风格锚点（Apple keynote / 极简 / 无人物无素材库镜头）
SEQUENCE    按时间段列 3~6 段：每段画面 + 屏幕上的词（简报级别，不是逐帧分镜）
VOICEOVER   逐句写死（越短越好；15 秒 = 4 句）
FORMAT      比例、时长、字幕烧录、音效轻重、语言
DO NOT      不许自造 UI / 不许营销话术 / 禁用色 / 禁用词
```

**经验**：
- 用户要「引导 / 介绍 / 开机看的」→ 极简：全程真界面套手机壳、只讲 2~3 个核心动作、配音 4 句、15 秒。用户要「宣传片」才做痛点 + 功能 + 结尾 CTA 的长片。**先问清是哪种**，两者简报完全不同。
- 多语言版本：followup 里写死每句译文 + 屏幕词译文，并声明「截图内的界面文字不翻译」「画面、时长、音乐、点击音效全部保持一致」。
- 模式固定 medium，一条 15 秒片 10~15 分钟，进度条**长期停在 10% 是正常的**，看 `status_message` 判断在干嘛。

## 4. 已知坑

- **followup 提交后 `status` 会短暂仍为 `completed`**（老结果），判断新片完成必须比较 `completed_at` 时间戳是否晚于上一版，否则会把旧片当新片下载（实测踩过：中文版下成英文母版）。
- **followup 串行**：前一条未完成时提交会被拒（"Followups require a completed job…"），要等。
- `upload_asset` 等工具的返回有时只在 `content[0].text` 里、没有 `structuredContent`，两处都要解析（脚本已处理）。
- 没有取消接口：提交错了只能让它跑完，积分照扣。**方向拿不准先跟用户确认再提交。**
- Bash 后台任务最长 10 分钟，轮询要写成可续跑（状态落文件），分段挂。

## 5. 脚本

- `scripts/motion_call.py <tool> '<json>'`：单次 JSON-RPC 调用，自动读 key，兼容两种返回格式。
- `scripts/motion_run.py`：子命令 `upload <files…>` / `create <brief.txt> [--ratio 9:16 --duration 10-30s --design apple --attachments att.json]` / `wait <job_id> [--out file.mp4] [--since <completed_at>]` / `followup <job_id> <prompt.txt>`，每步打印可续用的 id / 时间戳。
