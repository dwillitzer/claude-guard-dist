# Claude Guard - Production Distribution

**Version**: 1.0.115  
**Build**: de5fb0d6 (Final Fix)  
**Size**: 13.0MB standalone executable

## ✅ Bug Fixes (v3 - FINAL)
- ✅ **FIXED: No longer requires --debug flag**
- ✅ Fixed statusline spam and config write storm  
- ✅ Fixed interactive mode hanging
- ✅ Completely removed CCR routing (no localhost:3000 calls)
- ✅ Resolved `u$__filename` error
- ✅ Direct Anthropic API integration

## Quick Start (macOS)

### 1. Clone and Setup
```bash
git clone https://github.com/dwillitzer/claude-guard-dist.git
cd claude-guard-dist
chmod +x claude-guard-production.js
```

### 2. Test Installation
```bash
./claude-guard-production.js --version
./claude-guard-production.js --help
```

### 3. Basic Usage
```bash
# Interactive mode
./claude-guard-production.js

# Direct prompt
./claude-guard-production.js "list files in current directory"

# Autonomous mode
./claude-guard-production.js --mode autonomous "analyze this codebase"
```

### 4. Optional: Add to PATH
```bash
# Add to your shell profile (~/.zshrc or ~/.bash_profile)
export PATH="$PATH:/path/to/claude-guard-dist"

# Then use globally
claude-guard-production.js --version
```

## Features

- ✅ **Standalone**: No npm install required
- ✅ **Embedded Claude CLI**: All dependencies included
- ✅ **Security Layer**: Built-in protections and audit trails
- ✅ **Autonomous Mode**: BMAD agent coordination
- ✅ **Cross-platform**: Works on macOS, Linux, Windows

## Requirements

- **Node.js** (any recent version)
- **macOS** 10.15+ recommended

## Files

- `claude-guard-production.js` - Main executable (13.6MB)
- `claude-guard-daemon.js` - Service mode
- `yoga.wasm` - Layout engine
- `package.json` - Package metadata
- `INTEGRITY.json` - Build verification

## Support

This is a production build with all features enabled. For issues or questions, contact the development team.

---
*Generated: 2025-09-17*