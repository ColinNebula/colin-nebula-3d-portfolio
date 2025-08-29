const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function findProcessOnPort(port) {
  try {
    // Windows command to find process on port
    const stdout = await executeCommand(`netstat -ano | findstr :${port}`);
    const lines = stdout.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return null;
    }
    
    // Extract PID from the last column
    const processInfo = lines[0].split(/\s+/);
    const pid = processInfo[processInfo.length - 1];
    
    if (pid && pid !== '0') {
      // Get process name
      try {
        const processName = await executeCommand(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`);
        const name = processName.split(',')[0].replace(/"/g, '');
        return { pid, name, port };
      } catch (e) {
        return { pid, name: 'Unknown', port };
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function killProcess(pid) {
  try {
    await executeCommand(`taskkill /PID ${pid} /F`);
    return true;
  } catch (error) {
    console.error(`Failed to kill process ${pid}:`, error.message);
    return false;
  }
}

async function main() {
  const ports = process.argv.slice(2).map(Number).filter(port => !isNaN(port));
  
  if (ports.length === 0) {
    console.log('No ports specified.');
    rl.close();
    return;
  }
  
  console.log(`Checking port${ports.length > 1 ? 's' : ''}: ${ports.join(', ')}...`);
  
  for (const port of ports) {
    const process = await findProcessOnPort(port);
    
    if (process) {
      console.log(`Found process using port ${port}: ${process.name} (PID: ${process.pid})`);
      console.log(`Killing process...`);
      
      const success = await killProcess(process.pid);
      
      if (success) {
        console.log(`✓ Successfully killed process on port ${port}`);
      } else {
        console.log(`✗ Failed to kill process on port ${port}`);
      }
    } else {
      console.log(`No process found using port ${port}`);
    }
  }
  
  rl.close();
}

main().catch(console.error);
  console.log(`${processes.length + 1}. Kill all`);
  console.log(`${processes.length + 2}. Exit`);
  
  const choice = await askQuestion('\nEnter your choice (number): ');
  const choiceNum = parseInt(choice);
  
  if (choiceNum === processes.length + 2) {
    console.log('Exiting...');
    return;
  }
  
  if (choiceNum === processes.length + 1) {
    // Kill all
    console.log('\nKilling all processes...');
    for (const proc of processes) {
      const success = await killProcess(proc.pid);
      if (success) {
        console.log(`✓ Killed ${proc.name} on port ${proc.port}`);
      } else {
        console.log(`✗ Failed to kill ${proc.name} on port ${proc.port}`);
      }
    }
  } else if (choiceNum >= 1 && choiceNum <= processes.length) {
    // Kill specific process
    const proc = processes[choiceNum - 1];
    console.log(`\nKilling ${proc.name} on port ${proc.port}...`);
    const success = await killProcess(proc.pid);
    if (success) {
      console.log(`✓ Killed ${proc.name} on port ${proc.port}`);
    } else {
      console.log(`✗ Failed to kill ${proc.name} on port ${proc.port}`);
    }
  } else {
    console.log('Invalid choice.');
  }
}

async function main() {
  console.log('🔧 Port Management Utility\n');
  
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage:
  node kill-ports.js [options] [ports...]
  
Options:
  --help, -h     Show this help message
  --all          Scan all common development ports
  --kill-all     Kill all processes on scanned ports without confirmation
  
Examples:
  node kill-ports.js 3000          # Check port 3000
  node kill-ports.js 3000 8080     # Check ports 3000 and 8080
  node kill-ports.js --all         # Check common development ports
  node kill-ports.js --kill-all    # Kill all processes on common ports
`);
    rl.close();
    return;
  }
  
  let portsToScan = [];
  let killAll = false;
  
  if (args.includes('--all')) {
    portsToScan = COMMON_PORTS;
  } else if (args.includes('--kill-all')) {
    portsToScan = COMMON_PORTS;
    killAll = true;
  } else if (args.length > 0) {
    // Parse port numbers from arguments
    portsToScan = args.filter(arg => !arg.startsWith('--')).map(Number).filter(port => !isNaN(port));
  } else {
    portsToScan = COMMON_PORTS;
  }
  
  if (portsToScan.length === 0) {
    console.log('No valid ports specified. Use --help for usage information.');
    rl.close();
    return;
  }
  
  const activeProcesses = await scanPorts(portsToScan);
  
  if (activeProcesses.length === 0) {
    rl.close();
    return;
  }
  
  if (killAll) {
    console.log('\nKilling all processes...');
    for (const proc of activeProcesses) {
      const success = await killProcess(proc.pid);
      if (success) {
        console.log(`✓ Killed ${proc.name} on port ${proc.port}`);
      } else {
        console.log(`✗ Failed to kill ${proc.name} on port ${proc.port}`);
      }
    }
  } else {
    await interactiveKill(activeProcesses);
  }
  
  rl.close();
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nExiting...');
  rl.close();
  process.exit(0);
});

main().catch(console.error);
