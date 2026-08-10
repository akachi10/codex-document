#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import crypto from "node:crypto";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);
const SKILL_DIR = path.dirname(SCRIPT_DIR);
const DATA_DIR = process.env.CLAUDE_DELEGATE_HOME || path.join(os.homedir(), ".codex", "claude-delegate");
const WORKERS_FILE = path.join(DATA_DIR, "workers.json");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");
const DEFAULT_TIMEOUT_MS = 20 * 60 * 1000;
const DEFAULT_BACKEND = process.env.CLAUDE_DELEGATE_BACKEND || "sdk";
const BOOLEAN_FLAGS = new Set(["background", "dangerously-skip-permissions", "json"]);

function ensureDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  ensureDir();
  if (!fs.existsSync(file)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  ensureDir();
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(tmp, file);
}

function now() {
  return new Date().toISOString();
}

function id(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

function parseArgs(argv) {
  const opts = {};
  const pos = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      pos.push(arg);
      continue;
    }
    const eq = arg.indexOf("=");
    if (eq !== -1) {
      opts[arg.slice(2, eq)] = arg.slice(eq + 1);
      continue;
    }
    const key = arg.slice(2);
    if (BOOLEAN_FLAGS.has(key)) {
      opts[key] = true;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      opts[key] = next;
      i += 1;
    } else {
      opts[key] = true;
    }
  }
  return { opts, pos };
}

function getWorkers() {
  return readJson(WORKERS_FILE, { workers: {} });
}

function saveWorkers(state) {
  writeJson(WORKERS_FILE, state);
}

function getJobs() {
  return readJson(JOBS_FILE, { jobs: {} });
}

function saveJobs(state) {
  writeJson(JOBS_FILE, state);
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function print(value) {
  process.stdout.write(`${value}\n`);
}

function fail(message, code = 1) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

function claudeAvailable() {
  const result = spawnSync("claude", ["--version"], { encoding: "utf8" });
  return result.status === 0;
}

function commandPath(command) {
  const result = spawnSync("which", [command], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function globalNpmRoot() {
  const result = spawnSync("npm", ["root", "-g"], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function parseList(value) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBackend(value) {
  const backend = String(value || DEFAULT_BACKEND).toLowerCase();
  if (backend === "agent-sdk" || backend === "claude-agent-sdk") return "sdk";
  if (backend === "claude-cli") return "cli";
  if (backend !== "sdk" && backend !== "cli") {
    fail(`Unsupported backend: ${value}. Use "sdk" or "cli".`);
  }
  return backend;
}

function normalizeSdkPermissionMode(options) {
  let mode = options.permissionMode || options["permission-mode"] || null;
  if (mode === "bypass" || mode === "dangerously-skip-permissions") {
    mode = "bypassPermissions";
  }
  if (mode === "accept-edits") mode = "acceptEdits";
  if (mode === "dont-ask") mode = "dontAsk";
  if (!mode && options["dangerously-skip-permissions"] !== false) {
    mode = "bypassPermissions";
  }
  return mode;
}

function buildClaudeArgs(options, resumeSessionId) {
  const args = ["-p", "--output-format", "json"];
  if (resumeSessionId) {
    args.push("--resume", resumeSessionId);
  }
  const permissionMode = options.permissionMode || options["permission-mode"] || null;
  if (permissionMode === "bypassPermissions" || permissionMode === "bypass") {
    args.push("--dangerously-skip-permissions");
  } else if (permissionMode) {
    args.push("--permission-mode", permissionMode);
  } else {
    args.push("--dangerously-skip-permissions");
  }
  if (options.model) {
    args.push("--model", options.model);
  }
  if (options.effort) {
    args.push("--effort", options.effort);
  }
  const maxBudgetUsd = options.maxBudgetUsd || options["max-budget-usd"];
  if (maxBudgetUsd) {
    args.push("--max-budget-usd", String(maxBudgetUsd));
  }
  if (options.tools) {
    args.push("--tools", options.tools);
  }
  const allowedTools = options.allowedTools || options["allowed-tools"];
  if (allowedTools) {
    args.push("--allowedTools", allowedTools);
  }
  return args;
}

function resolveClaudeAgentSdkEntry() {
  const require = createRequire(import.meta.url);
  const searchPaths = [SCRIPT_DIR, SKILL_DIR, process.cwd()];
  const npmRoot = globalNpmRoot();
  if (npmRoot) searchPaths.push(npmRoot);
  return require.resolve("@anthropic-ai/claude-agent-sdk", { paths: searchPaths });
}

async function loadClaudeAgentSdk() {
  try {
    const resolved = resolveClaudeAgentSdkEntry();
    return import(pathToFileURL(resolved).href);
  } catch (error) {
    throw new Error(
      [
        "Cannot load @anthropic-ai/claude-agent-sdk.",
        "Install it with:",
        `  cd ${SKILL_DIR} && npm install @anthropic-ai/claude-agent-sdk`,
        "or run this command with --backend cli.",
        `Original error: ${error instanceof Error ? error.message : String(error)}`
      ].join("\n")
    );
  }
}

function buildSdkOptions(options, cwd, resumeSessionId) {
  const sdkOptions = {
    cwd,
    abortController: options.abortController,
    env: { ...process.env, CLAUDE_AGENT_SDK_CLIENT_APP: "codex-claude-delegate/1.0" }
  };
  const claudePath = options.claudePath || options["claude-path"] || commandPath("claude");
  if (claudePath) {
    sdkOptions.pathToClaudeCodeExecutable = claudePath;
  }
  if (resumeSessionId) {
    sdkOptions.resume = resumeSessionId;
  }
  if (options.model) {
    sdkOptions.model = options.model;
  }
  if (options.effort) {
    sdkOptions.effort = options.effort;
  }
  const maxBudgetUsd = options.maxBudgetUsd || options["max-budget-usd"];
  if (maxBudgetUsd) {
    sdkOptions.maxBudgetUsd = Number(maxBudgetUsd);
  }
  const tools = parseList(options.tools);
  if (tools) {
    sdkOptions.tools = tools;
  }
  const allowedTools = parseList(options.allowedTools || options["allowed-tools"]);
  if (allowedTools) {
    sdkOptions.allowedTools = allowedTools;
  }
  const permissionMode = normalizeSdkPermissionMode(options);
  if (permissionMode) {
    sdkOptions.permissionMode = permissionMode;
    if (permissionMode === "bypassPermissions") {
      sdkOptions.allowDangerouslySkipPermissions = true;
    }
  }
  return sdkOptions;
}

function extractResult(stdout) {
  const trimmed = String(stdout || "").trim();
  if (!trimmed) {
    return { raw: "", parsed: null, text: "" };
  }
  try {
    const parsed = JSON.parse(trimmed);
    return {
      raw: trimmed,
      parsed,
      text: parsed.result || parsed.message || parsed.output || ""
    };
  } catch {
    return { raw: trimmed, parsed: null, text: trimmed };
  }
}

function contentText(content) {
  if (!Array.isArray(content)) return "";
  return content
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      if (block.type === "text") return block.text || "";
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function serializeSdkMessages(messages) {
  return messages.map((message) => JSON.stringify(message)).join("\n");
}

function runClaudeTurnCli({ prompt, cwd, resumeSessionId, options }) {
  if (!claudeAvailable()) {
    throw new Error("claude CLI is not installed or not on PATH.");
  }
  const args = buildClaudeArgs(options, resumeSessionId);
  const timeout = Number(options.timeoutMs || options["timeout-ms"] || DEFAULT_TIMEOUT_MS);
  const result = spawnSync("claude", args, {
    cwd,
    input: prompt,
    encoding: "utf8",
    timeout,
    maxBuffer: 50 * 1024 * 1024
  });
  const out = extractResult(result.stdout);
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error((result.stderr || out.raw || `claude exited with status ${result.status}`).trim());
  }
  const parsed = out.parsed || {};
  return {
    text: out.text,
    raw: out.raw,
    sessionId: parsed.session_id || parsed.sessionId || null,
    costUsd: parsed.total_cost_usd ?? parsed.cost_usd ?? null,
    durationMs: parsed.duration_ms ?? null,
    backend: "cli",
    parsed
  };
}

async function runClaudeTurnSdk({ prompt, cwd, resumeSessionId, options }) {
  const { query } = await loadClaudeAgentSdk();
  const timeout = Number(options.timeoutMs || options["timeout-ms"] || DEFAULT_TIMEOUT_MS);
  const abortController = new AbortController();
  const sdkOptions = buildSdkOptions({ ...options, abortController }, cwd, resumeSessionId);
  const messages = [];
  const assistantText = [];
  let resultMessage = null;
  let sessionId = resumeSessionId || null;
  let timedOut = false;
  const timer = timeout > 0
    ? setTimeout(() => {
      timedOut = true;
      abortController.abort();
    }, timeout)
    : null;

  try {
    for await (const message of query({ prompt, options: sdkOptions })) {
      messages.push(message);
      if (message.session_id) {
        sessionId = message.session_id;
      }
      if (message.type === "assistant") {
        const text = contentText(message.message?.content);
        if (text) assistantText.push(text);
      }
      if (message.type === "result") {
        resultMessage = message;
      }
    }
  } catch (error) {
    if (timedOut) {
      throw new Error(`Claude SDK timed out after ${timeout}ms.`);
    }
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }

  if (resultMessage?.is_error) {
    const errors = Array.isArray(resultMessage.errors) && resultMessage.errors.length
      ? resultMessage.errors.join("\n")
      : resultMessage.subtype || "Claude SDK returned an error result.";
    throw new Error(errors);
  }

  const text = resultMessage?.result || assistantText.join("\n").trim();
  return {
    text,
    raw: serializeSdkMessages(messages),
    sessionId,
    costUsd: resultMessage?.total_cost_usd ?? null,
    durationMs: resultMessage?.duration_ms ?? null,
    backend: "sdk",
    parsed: resultMessage || null,
    eventCount: messages.length
  };
}

async function runClaudeTurn({ prompt, cwd, resumeSessionId, options }) {
  const backend = normalizeBackend(options.backend);
  if (backend === "cli") {
    return runClaudeTurnCli({ prompt, cwd, resumeSessionId, options });
  }
  return runClaudeTurnSdk({ prompt, cwd, resumeSessionId, options });
}

async function runDoctor() {
  const claudePath = commandPath("claude");
  const cliVersion = claudePath
    ? spawnSync("claude", ["--version"], { encoding: "utf8" }).stdout.trim()
    : null;
  const result = {
    ok: true,
    defaultBackend: DEFAULT_BACKEND,
    defaultPermissionMode: "bypassPermissions",
    node: process.version,
    claude: {
      ok: Boolean(claudePath),
      path: claudePath,
      version: cliVersion
    },
    sdk: {
      ok: false,
      version: null,
      error: null
    },
    stateDir: DATA_DIR
  };
  try {
    const sdk = await loadClaudeAgentSdk();
    result.sdk.ok = typeof sdk.query === "function";
    const packagePath = path.join(path.dirname(resolveClaudeAgentSdkEntry()), "package.json");
    result.sdk.version = JSON.parse(fs.readFileSync(packagePath, "utf8")).version;
  } catch (error) {
    result.ok = false;
    result.sdk.error = error instanceof Error ? error.message : String(error);
  }
  if (!result.claude.ok) {
    result.ok = false;
  }
  return result;
}

function workerPrompt(worker, task) {
  return [
    `You are a persistent Claude Code team worker named "${worker.name}".`,
    "Follow the role below for this session.",
    "",
    "<role>",
    worker.role || "General Claude Code worker.",
    "</role>",
    "",
    "<task>",
    task,
    "</task>"
  ].join("\n");
}

function createWorker(name, opts) {
  const state = getWorkers();
  if (state.workers[name]) {
    fail(`Worker already exists: ${name}`);
  }
  const worker = {
    name,
    role: opts.role || "General Claude Code worker.",
    cwd: path.resolve(opts.cwd || process.cwd()),
    backend: normalizeBackend(opts.backend),
    model: opts.model || null,
    effort: opts.effort || null,
    permissionMode: opts.permissionMode || opts["permission-mode"] || null,
    tools: opts.tools || null,
    allowedTools: opts.allowedTools || opts["allowed-tools"] || null,
    sessionId: null,
    createdAt: now(),
    updatedAt: now()
  };
  state.workers[name] = worker;
  saveWorkers(state);
  return worker;
}

function getWorker(name) {
  const state = getWorkers();
  const worker = state.workers[name];
  if (!worker) {
    fail(`Unknown worker: ${name}`);
  }
  return { state, worker };
}

function updateWorker(state, worker, patch) {
  state.workers[worker.name] = { ...worker, ...patch, updatedAt: now() };
  saveWorkers(state);
  return state.workers[worker.name];
}

function mergeWorkerOptions(worker, opts) {
  return {
    backend: opts.backend || worker.backend || DEFAULT_BACKEND,
    model: opts.model || worker.model || undefined,
    effort: opts.effort || worker.effort || undefined,
    permissionMode: opts.permissionMode || opts["permission-mode"] || worker.permissionMode || undefined,
    tools: opts.tools || worker.tools || undefined,
    allowedTools: opts.allowedTools || opts["allowed-tools"] || worker.allowedTools || undefined,
    timeoutMs: opts.timeoutMs || opts["timeout-ms"] || undefined
  };
}

async function runWorkerTurn(name, task, opts = {}) {
  const { state, worker } = getWorker(name);
  const cwd = path.resolve(opts.cwd || worker.cwd || process.cwd());
  const prompt = worker.sessionId ? task : workerPrompt(worker, task);
  const result = await runClaudeTurn({
    prompt,
    cwd,
    resumeSessionId: worker.sessionId,
    options: mergeWorkerOptions(worker, opts)
  });
  if (result.sessionId && result.sessionId !== worker.sessionId) {
    updateWorker(state, worker, { sessionId: result.sessionId, cwd });
  } else {
    updateWorker(state, worker, { cwd });
  }
  return result;
}

function createJob(record) {
  const state = getJobs();
  const job = {
    id: id("cld"),
    status: "queued",
    pid: null,
    createdAt: now(),
    updatedAt: now(),
    ...record
  };
  state.jobs[job.id] = job;
  saveJobs(state);
  return job;
}

function updateJob(jobId, patch) {
  const state = getJobs();
  const job = state.jobs[jobId];
  if (!job) {
    fail(`Unknown job: ${jobId}`);
  }
  state.jobs[jobId] = { ...job, ...patch, updatedAt: now() };
  saveJobs(state);
  return state.jobs[jobId];
}

function startBackground(job) {
  const child = spawn(process.execPath, [SCRIPT_PATH, "_job", job.id], {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
  updateJob(job.id, { pid: child.pid, status: "queued" });
}

async function runJob(jobId) {
  const state = getJobs();
  const job = state.jobs[jobId];
  if (!job) {
    fail(`Unknown job: ${jobId}`);
  }
  updateJob(jobId, { status: "running", pid: process.pid, startedAt: now() });
  try {
    let result;
    if (job.kind === "worker") {
      result = await runWorkerTurn(job.worker, job.task, job.options || {});
    } else {
      result = await runClaudeTurn({
        prompt: job.task,
        cwd: job.cwd || process.cwd(),
        resumeSessionId: null,
        options: job.options || {}
      });
    }
    updateJob(jobId, {
      status: "completed",
      completedAt: now(),
      resultText: result.text,
      raw: result.raw,
      sessionId: result.sessionId,
      costUsd: result.costUsd,
      durationMs: result.durationMs,
      backend: result.backend,
      pid: null
    });
  } catch (error) {
    updateJob(jobId, {
      status: "failed",
      completedAt: now(),
      error: error instanceof Error ? error.message : String(error),
      pid: null
    });
    process.exitCode = 1;
  }
}

function summarizeJobs(jobs) {
  return Object.values(jobs)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .map((job) => ({
      id: job.id,
      status: job.status,
      kind: job.kind,
      worker: job.worker || null,
      pid: job.pid || null,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      task: String(job.task || "").slice(0, 100)
    }));
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { opts, pos } = parseArgs(rest);
  const json = Boolean(opts.json);

  if (!command || command === "help" || command === "--help") {
    print(`Usage:
  claude-companion.mjs doctor
  claude-companion.mjs init <worker> --role "<role>"
  claude-companion.mjs send <worker> [--backend sdk|cli] [--background] "<task>"
  claude-companion.mjs run [--backend sdk|cli] [--background] "<task>"
  claude-companion.mjs workers
  claude-companion.mjs status [job-id]
  claude-companion.mjs result <job-id>
  claude-companion.mjs cancel <job-id>
  claude-companion.mjs remove <worker>`);
    return;
  }

  if (command === "doctor") {
    const result = await runDoctor();
    if (json) {
      printJson(result);
    } else {
      print([
        `ok: ${result.ok}`,
        `defaultBackend: ${result.defaultBackend}`,
        `defaultPermissionMode: ${result.defaultPermissionMode}`,
        `node: ${result.node}`,
        `claude: ${result.claude.ok ? `${result.claude.version} (${result.claude.path})` : "missing"}`,
        `sdk: ${result.sdk.ok ? `${result.sdk.version}` : `failed: ${result.sdk.error}`}`,
        `stateDir: ${result.stateDir}`
      ].join("\n"));
    }
    process.exitCode = result.ok ? 0 : 1;
    return;
  }

  if (command === "_job") {
    await runJob(pos[0]);
    return;
  }

  if (command === "init") {
    const name = pos[0];
    if (!name) fail("Usage: init <worker> --role \"<role>\"");
    const worker = createWorker(name, opts);
    json ? printJson(worker) : print(`Worker created: ${worker.name}`);
    return;
  }

  if (command === "workers") {
    const workers = Object.values(getWorkers().workers);
    json ? printJson(workers) : print(workers.map((w) => `${w.name}\t${w.backend || DEFAULT_BACKEND}\t${w.sessionId || "(no session yet)"}\t${w.cwd}`).join("\n") || "No workers.");
    return;
  }

  if (command === "send" || command === "resume") {
    const name = pos[0];
    const task = pos.slice(1).join(" ").trim();
    if (!name || !task) fail(`Usage: ${command} <worker> "<task>"`);
    getWorker(name);
    if (opts.background) {
      const job = createJob({ kind: "worker", worker: name, task, options: opts });
      startBackground(job);
      json ? printJson(job) : print(`Started Claude worker job: ${job.id}`);
      return;
    }
    const result = await runWorkerTurn(name, task, opts);
    json ? printJson(result) : print(result.text || result.raw || "(Claude returned no text.)");
    return;
  }

  if (command === "run") {
    const task = pos.join(" ").trim();
    if (!task) fail('Usage: run "<task>"');
    const cwd = path.resolve(opts.cwd || process.cwd());
    if (opts.background) {
      const job = createJob({ kind: "oneoff", task, cwd, options: opts });
      startBackground(job);
      json ? printJson(job) : print(`Started Claude one-off job: ${job.id}`);
      return;
    }
    const result = await runClaudeTurn({ prompt: task, cwd, resumeSessionId: null, options: opts });
    json ? printJson(result) : print(result.text || result.raw || "(Claude returned no text.)");
    return;
  }

  if (command === "status") {
    const state = getJobs();
    const jobId = pos[0];
    if (jobId) {
      const job = state.jobs[jobId];
      if (!job) fail(`Unknown job: ${jobId}`);
      json ? printJson(job) : print(`${job.id}\t${job.status}\t${job.worker || job.kind}\t${job.updatedAt}`);
      return;
    }
    const summary = summarizeJobs(state.jobs);
    json ? printJson(summary) : print(summary.map((j) => `${j.id}\t${j.status}\t${j.worker || j.kind}\t${j.task}`).join("\n") || "No jobs.");
    return;
  }

  if (command === "result") {
    const jobId = pos[0];
    if (!jobId) fail("Usage: result <job-id>");
    const job = getJobs().jobs[jobId];
    if (!job) fail(`Unknown job: ${jobId}`);
    if (json) {
      printJson(job);
    } else if (job.status === "completed") {
      print(job.resultText || job.raw || "(Claude returned no text.)");
    } else if (job.status === "failed") {
      fail(job.error || "Claude job failed.");
    } else {
      print(`Job ${job.id} is ${job.status}.`);
    }
    return;
  }

  if (command === "cancel") {
    const jobId = pos[0];
    if (!jobId) fail("Usage: cancel <job-id>");
    const job = getJobs().jobs[jobId];
    if (!job) fail(`Unknown job: ${jobId}`);
    if (job.pid) {
      try {
        process.kill(job.pid, "SIGTERM");
      } catch {
        // Process may already have exited.
      }
    }
    const updated = updateJob(jobId, { status: "cancelled", cancelledAt: now(), pid: null });
    json ? printJson(updated) : print(`Cancelled ${jobId}`);
    return;
  }

  if (command === "remove") {
    const name = pos[0];
    if (!name) fail("Usage: remove <worker>");
    const state = getWorkers();
    if (!state.workers[name]) fail(`Unknown worker: ${name}`);
    delete state.workers[name];
    saveWorkers(state);
    print(`Removed worker: ${name}`);
    return;
  }

  fail(`Unknown command: ${command}`);
}

try {
  await main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
