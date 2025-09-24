const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withRNFBModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    async (c) => {
      const podfilePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf-8");

      contents = contents.replace(
        /pod 'RNFBApp'.*$/m,
        "pod 'RNFBApp', :modular_headers => true"
      );
      // repeat for other RNFB pods if needed

      fs.writeFileSync(podfilePath, contents);
      return c;
    },
  ]);
};
