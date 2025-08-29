# Port Management Utility

This utility helps you manage and kill processes running on specific ports during development.

## Usage

### Basic Commands

```bash
# Check common development ports
npm run kill-ports

# Check specific port
node scripts/kill-ports.js 3000

# Check multiple ports
node scripts/kill-ports.js 3000 8080 5000

# Kill all processes on common ports without confirmation
npm run kill-ports-force

# Clean development environment and start
npm run dev-clean
```

### Interactive Mode

When you run the script, it will:
1. Scan the specified ports for active processes
2. Display a list of found processes
3. Allow you to choose which processes to kill

### Command Line Options

- `--help` or `-h`: Show help message
- `--all`: Scan all common development ports (3000, 3001, 8080, 8000, 5000, 5001, 4000, 9000)
- `--kill-all`: Kill all processes on scanned ports without confirmation

### Examples

```bash
# Interactive mode for port 3000
node scripts/kill-ports.js 3000

# Kill all processes on common ports
node scripts/kill-ports.js --kill-all

# Check all common development ports
node scripts/kill-ports.js --all
```

## Common Use Cases

### Development Server Issues
When your React development server fails to start due to port conflicts:
```bash
npm run kill-ports
# Then select the process to kill
npm start
```

### Clean Development Environment
```bash
npm run dev-clean
```

### Kill Specific Port
```bash
node scripts/kill-ports.js 3000
```

## Safety Notes

- The script uses `taskkill /F` which forcefully terminates processes
- Always save your work before killing processes
- Be careful when killing system processes
- The script only shows processes on the specified ports
