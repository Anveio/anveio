const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function installFFmpeg() {
  try {
    // 1. Update the repository lists
    await runCommand("sudo yum -y update");

    // 2. Add the EPEL repository
    await runCommand("sudo amazon-linux-extras install epel -y");

    // 3. Install FFmpeg
    await runCommand("sudo yum install ffmpeg -y");

    console.log("FFmpeg installation was successful!");
  } catch (error) {
    console.error("Error during FFmpeg installation:", error);
  }
}

function checkSupport(item, categoryOutput) {
  if (categoryOutput.includes(item)) {
    console.log(`\x1b[32m✓ ${item} is supported.\x1b[0m`); // Green color
    return true;
  } else {
    console.log(`\x1b[31m✗ ${item} is not supported.\x1b[0m`); // Red color
    return false;
  }
}

async function validateFFmpeg() {
  try {
    const formats = await runCommand("ffmpeg -formats");
    const codecs = await runCommand("ffmpeg -codecs");
    const filters = await runCommand("ffmpeg -filters");

    console.log("Validating FFmpeg support:\n");

    // Formats checklist
    console.log("Formats:");
    const isMP4Supported = checkSupport("mp4", formats);

    // Codecs checklist
    console.log("\nCodecs:");
    const isH264Supported = checkSupport("h264", codecs);

    // Filters checklist
    console.log("\nFilters:");
    const isScaleSupported = checkSupport("scale", filters);
    const isCropSupported = checkSupport("crop", filters);

    if (
      !(
        isMP4Supported &&
        isH264Supported &&
        isScaleSupported &&
        isCropSupported
      )
    ) {
      process.exit(1); // Exit with error code
    }
  } catch (error) {
    console.error("Error during FFmpeg validation:", error);
    process.exit(1); // Exit with error code
  }
}

installFFmpeg();
validateFFmpeg();
