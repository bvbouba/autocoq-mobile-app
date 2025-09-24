const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withRNFBModularHeadersAndDisableWarnings(config) {
  return withDangerousMod(config, [
    "ios",
    async (c) => {
      const podfilePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf-8");

      // 1️⃣ Make all RNFB pods use modular headers
      contents = contents.replace(
        /pod '(RNFB[^']*)'.*$/gm,
        "pod '$1', :modular_headers => true"
      );

      // 2️⃣ Append post_install block at the end to disable warnings
      if (!/post_install do \|installer\|/.test(contents)) {
        contents += `

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Disable non-modular header warnings
      config.build_settings['CLANG_WARN_NON_MODULAR_INCLUDE_IN_FRAMEWORK_MODULES'] = 'NO'
    end
  end
end
`;
      } else {
        // If a post_install exists, just append the CLANG_WARN setting to it
        contents = contents.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_WARN_NON_MODULAR_INCLUDE_IN_FRAMEWORK_MODULES'] = 'NO'
    end
  end
`
        );
      }

      fs.writeFileSync(podfilePath, contents);
      return c;
    },
  ]);
};
