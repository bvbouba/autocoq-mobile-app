const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withDisableNonModularHeadersWarning(config) {
  return withDangerousMod(config, [
    "ios",
    async (c) => {
      const podfilePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf-8");

      // Add post_install block if it doesn't exist
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
        // patch existing post_install block
        contents = contents.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Disable non-modular header warnings
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
