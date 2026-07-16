---
name: word-drill
description: 管理 word-drill 生词本：单词增删改查、生成中英文释义、标准单词处理
---

# word-drill

通过 word-drill-mcp 管理英语生词本。包含单词 CRUD、释义生成、一键补全释义。

## 前置条件

drill 必须正在运行（MCP 通过 HTTP 调用 drill）。如果未运行，MCP 会返回 DRILL_OFFLINE 错误。

## Tools

查询操作支持 flag 参数可跨组查询，写操作使用 drill 当前 flag。可用 `switch_flag` 切换。

| Tool | 用途 |
|------|------|
| `current_flag()` | 查看 drill 当前 flag |
| `switch_flag(flag)` | 切换 drill 当前 flag（影响所有写操作） |
| `list_flags()` | 查看所有 flag 及每个 flag 下的单词数量 |
| `list_words(flag, page, page_size, missing_definition?)` | 分页查看单词列表，返回 word/hasEn/hasCn。`missing_definition=true` 只返回缺少释义的单词。查详情用 `find_word` |
| `find_word(word, flag)` | 查询单个单词详情 |
| `add_word(word, chinese?)` | 添加新单词 |
| `delete_word(word)` | 删除单词 |
| `alter_word(word, chinese?, phoneticSymbol?, oldWord?)` | 修改单词属性 |
| `update_definition(word, type, definition)` | 写入释义，`type="cn"` 写中文，`type="en"` 写英文，`type="synonyms"` 写同义词，`type="antonyms"` 写反义词 |

---

## 一、单词管理

### 添加单词

1. 用户说"加单词 xxx"或提供单词列表时触发
2. 如果用户未提供中文翻译，AI 自行生成翻译
3. 调用 `add_word` 添加，中文翻译格式：`["v. 放弃","n. 放弃"]`
4. 如果单词已存在，告知用户并跳过

### 批量添加

1. 用户提供多个单词（逗号、换行、空格分隔均可）
2. 逐个调用 `add_word`
3. 汇总结果：成功/跳过/失败

### 删除单词

1. 用户说"删除 xxx"时触发
2. 调用 `delete_word`

### 修改单词

1. 用户说"改 xxx 的翻译"时触发
2. 先调用 `find_word` 确认单词存在
3. 调用 `alter_word` 修改指定字段

### 查询

1. 用户说"查 xxx"时调用 `find_word`
2. 用户说"看单词列表"时调用 `list_words`

---

## 二、释义生成

用户要求给单词做释义时触发。

### 工作流程

1. 调用 `list_words(flag, page=-1)` 获取**全部单词列表**（建立词库）
2. 基于词库中已有的单词或其变形来生成英文释义，同时从词库中匹配同义词和反义词
3. 生成中文释义
4. 调用 `update_definition` 写入 `en`、`synonyms`、`antonyms`（英文释义相关），再写入 `cn`
5. 批量释义时跳过已有释义的单词（`hasEn=1` 且 `hasCn=1`），除非用户要求重新生成

### 英文释义规范

用完整英文句子解释含义。**必须优先**使用词库中已有的单词或其变形来解释目标词。一到两句话。

示例：
```
To feel worried or scared about something that might happen.
```

### 同义词/反义词规范

- **只包含词库中已有的单词**，不包含词库外的词
- 逗号分隔，如：`scared, frightened, worried`
- 如果词库中没有匹配的同义词或反义词，则不写入该字段
- 通过 `update_definition(word, "synonyms", "...")` 和 `update_definition(word, "antonyms", "...")` 分别写入

### 中文释义规范

- 标准中文翻译，包含词性标注
- 如有多个含义，列出常用含义
- 格式：`["v. 放弃","n. 放弃"]`

---

## 三、释义新词

用户说"释义新词"时触发。**自动执行全部流程，不需要逐步确认。**

### 工作流程

1. 调用 `current_flag()` 确认当前 flag
2. 调用 `list_words(flag, page=-1)` 获取**全部单词列表**（建立词库，用于释义和同义/反义词匹配）
3. 调用 `list_words(flag, page=-1, missing_definition=true)` 获取缺少释义的单词
4. 如果返回为空 → 告知"所有单词均已有释义"并结束
5. 告知用户数量，立即开始处理（不等待确认）
6. 对每个单词：
   - 缺英文释义（`hasEn=0`）→ 基于词库生成并写入 `en`，同时从词库中匹配同义词写入 `synonyms`、反义词写入 `antonyms`
   - 缺中文释义（`hasCn=0`）→ 生成并写入 `cn`
7. 输出汇总：处理了多少单词，补了多少英文、多少中文、多少同义词、多少反义词

---

## 通用规则

- 如果用户未指定 flag，使用当前 flag
- 添加单词时如果用户只给了英文，AI 自行翻译
- 不自动添加音标（音标字段可留空）
- 用户可要求重新生成释义，AI 覆盖写入即可
- 每个操作完成后给用户简洁的结果反馈
