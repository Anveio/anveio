const { exec } = require("child_process");

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      // Handle yum specific case where package is already installed
      if (
        command.includes("yum") &&
        (stdout.includes("Nothing to do") ||
          stdout.includes("already installed"))
      ) {
        resolve(stdout);
        return;
      }

      if (error) {
        // Check for permission errors
        if (
          error.message.includes("Permission denied") ||
          error.message.includes("EACCES")
        ) {
          console.error(
            "\x1b[31mERROR: The script needs to be run with the right permissions for non-yum environments.\x1b[0m"
          ); // Red color
          process.exit(1); // Exit with an error code
        }
        reject(error);
      } else if (stderr && !stdout) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function checkSupport(item, categoryOutput) {
  if (categoryOutput.includes(item)) {
    console.log(`\x1b[32m✓ ${item} is supported.\x1b[0m`); // Green color
    return { [item]: true };
  } else {
    console.log(`\x1b[31m✗ ${item} is not supported.\x1b[0m`); // Red color
    return { [item]: false };
  }
}

async function getPackageManager() {
  const managers = ["yum", "apt", "dnf", "zypper"];

  for (const manager of managers) {
    try {
      await runCommand(`which ${manager}`);
      return manager;
    } catch (error) {
      // Continue searching
    }
  }

  throw new Error("No recognized package manager found.");
}

async function installFFmpegWithPackageManager() {
  const packageManager = await getPackageManager();

  switch (packageManager) {
    case "yum":
      await runCommand("yum -y install ffmpeg");
      break;
    case "apt":
      await runCommand("apt-get update && apt-get -y install ffmpeg");
      break;
    case "dnf":
      await runCommand("dnf -y install ffmpeg");
      break;
    case "zypper":
      await runCommand("zypper refresh && sudo zypper install -y ffmpeg");
      break;
    default:
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }

  console.log(`FFmpeg installed using ${packageManager}`);
}

async function validateFFmpeg() {
  try {
    const formats = await runCommand("ffmpeg -formats");
    console.log("********");
    const codecs = await runCommand("ffmpeg -codecs");
    console.log("}||||||||||||||||");
    const filters = await runCommand("ffmpeg -filters");
    console.log("3[[[[[[[[[[[[[[[[[[");

    const support = {
      ...checkSupport("mp4", formats),
      ...checkSupport("h264", codecs),
      ...checkSupport("scale", filters),
      ...checkSupport("crop", filters),
    };

    console.log("Validating FFmpeg support:\n");
    console.log(support);

    /**
     * If any values in `support` are false, throw an error
     */
    if (Object.values(support).includes(false)) {
      throw new Error(
        `Missing support for one or more FFmpeg features.\n${JSON.stringify(
          support,
          null,
          2
        )}`
      );
    }

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
      throw new Error();
    }
  } catch (error) {
    console.error("Error during FFmpeg validation:", error);
    process.exit(1); // Exit with error code
  }
}

installFFmpegWithPackageManager().then(() => {
  validateFFmpeg();
});
