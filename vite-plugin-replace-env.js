export default function replaceEnvPlugin(envVars) {
  return {
    name: "replace-env",
    transform(code) {
      let transformedCode = code;
      for (const [key, value] of Object.entries(envVars)) {
        const regex = new RegExp(`import\\.meta\\.env\\.${key}`, "g");
        transformedCode = transformedCode.replace(regex, JSON.stringify(value));
      }
      return {
        code: transformedCode,
        map: null,
      };
    },
  };
}
