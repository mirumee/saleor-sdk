import { Transform } from "jscodeshift";

const transformer: Transform = (fileInfo, { jscodeshift: j }) =>
  j(fileInfo.source)
    .find(j.ImportDeclaration)
    .replaceWith((importDeclaration) => {
      if (
        typeof importDeclaration.node.source.value === "string" &&
        importDeclaration.node.source.value.includes("globalTypes")
      ) {
        importDeclaration.node.source.value = importDeclaration.node.source.value.replace(
          "../",
          ""
        );
        return importDeclaration.node;
      }

      return importDeclaration.node;
    })
    .toSource();

export default transformer;
