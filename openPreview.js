const { exec } = require('child_process');

    const openBrowser = () => {
      exec('npx http-server -p 3000', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return;
        }
        console.log(`Stdout: ${stdout}`);
      });
    };

    openBrowser();
