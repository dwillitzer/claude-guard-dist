#!/usr/bin/env node

// This script runs the daemon in the background
const { AgentDaemon  } = require("../../agents/base/agent-daemon.js");
const { appendFileSync, writeFileSync, mkdirSync, existsSync  } = require("fs");
const { join  } = require("path");
const { homedir  } = require("os");
const chalk = require("chalk");

// Setup logging
const logDir = join(homedir(), '.claude-guard');
const logFile = join(logDir, 'daemon.log');

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Save original console methods before redirection
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
};

// Log function with recursion protection
let isLogging = false;
function log(message) {
  if (isLogging) {return;} // Prevent recursion
  isLogging = true;

  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    appendFileSync(logFile, logMessage);
    if (process.env.CLAUDE_GUARD_DAEMON_DEBUG) {
      originalConsole.log(message);
    }
  } catch (error) {
    // Use original console if file write fails
    originalConsole.error('Logging failed:', error.message);
  } finally {
    isLogging = false;
  }
}

// Redirect console to log file
console.log = log;
console.error = log;
console.warn = log;

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}\n${error.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Start daemon
async function startDaemon() {
  log('Starting Claude Guard daemon...');

  try {
    const daemon = new AgentDaemon();
    await daemon.start();
    log('Daemon started successfully');

    // Log PID for management
    log(`Daemon PID: ${process.pid}`);

    // Write PID file
    const pidFile = join(logDir, 'daemon.pid');
    writeFileSync(pidFile, process.pid.toString());

    // Handle shutdown signals gracefully
    process.on('SIGTERM', async () => {
      log('Received SIGTERM, shutting down gracefully...');
      await daemon.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      log('Received SIGINT, shutting down gracefully...');
      await daemon.stop();
      process.exit(0);
    });

    // Keep process alive
    setInterval(() => {
      // Heartbeat log every 5 minutes
      log(`Daemon heartbeat - Sessions: ${daemon.sessions.size}, Agents: ${daemon.backgroundAgents.size}`);
    }, 300000);

  } catch (error) {
    log(`Failed to start daemon: ${error.message}\n${error.stack}`);
    process.exit(1);
  }
}

// Start the daemon
startDaemon().catch(error => {
  log(`Fatal error: ${error.message}\n${error.stack}`);
  process.exit(1);
});
