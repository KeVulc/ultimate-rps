export default function replaceEnvPlugin(envVars) {
  return {
    name: "replace-env",
    transform(code) {
      let result = code;
      for (const [key, value] of Object.entries(envVars)) {
        result = result.replace(
          new RegExp(`import.meta.env.${key}`, "g"),
          JSON.stringify(value)
        );
      }
      return {
        code: result,
        map: null,
      };
    },
  };
}
