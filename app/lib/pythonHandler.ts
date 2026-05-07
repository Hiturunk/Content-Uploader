const { spawn } = require("child_process");
export function generateMetadata(scriptPath: string, args: any[]) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [scriptPath, ...args]);

    let stdoutData = "";

    pythonProcess.stdout.on("data", (data: string) => {
      stdoutData += data;
    });

    pythonProcess.stderr.on("data", (data: any) => {
      console.error(`Python3 script stderr: ${data}`);
    });

    pythonProcess.on("close", (code: number) => {
      if (code === 0) {
        try {
          const jsonFileContent = stdoutData;
          resolve(jsonFileContent);
        } catch (parseError) {
          reject(parseError);
        }
      } else {
        reject(new Error(`Python script process exited with code ${code}`));
      }
    });
  });
}
