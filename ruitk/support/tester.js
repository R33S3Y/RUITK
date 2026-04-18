import { Type } from "./tester.js";
import { Merge } from "./merger.js";

export class Tester {
  /**
   * Validates that all required keys in the template object exist in the actual object
   * and checks if the values in the actual object match the specified types in the template.
   *
   * @param {dict | Array} template The template object with required keys and their expected types.
   * @param {dict | Array} actual The actual object to test against the template.
   * @param {string} prefix issue prefix
   * @param {string} suffix issue suffix
   * @returns {Array | null } Returns a array of all issues. if their are none it will instead return null.
   */
  static test(template, actual, prefix = "", suffix = "", testTemplate = true) {
    /**
     * Resolves the per key template.
     * @param { dict | array | string } template per key template
     * @param {*} actual value to test for issues.
     * @returns { array } issues.
     */
    function resolveKey(template, actual) {

      let issues = [];

      if (Type.isTypes(template, "stringPrimitive" | "array")) {
        template = { type: template };
      }
      if (!Type.isType(template, "dictObject")) {
        issues.push("Tester.test Function: template is not string or dict");
        console.error(issues[-1]);
        return issues;
      }
      if (Type.isType(template.type, "stringPrimitive")) {
        template.type = [template.type];
      }

      if (testTemplate === true) {
        issues = issues.concat(Tester.test({
          type: {
            type: "array",
            full: true,
          },
          full: ["undefined", "booleanPrimitive"],
          length: ["undefined", "number"],
          template: {
            type: ["undefined", "stringPrimative", "array", "dict"],
            templateIf: {
              string: {
                full: true,
              }, array: {
                full: true,
                templateAll: "stringPrimative",
              }, dict: {
                full: true,
                templateAll: ["stringPrimative", "array", "dict"],
              }
            }
          },
          templateAll: {
            type: ["undefined", "stringPrimative", "dict"],
            templateIf: {
              string: {
                full: true,
              }, dict: {
                full: true,
                templateAll: ["stringPrimative", "array", "dict"],
              }
            }
          },
          templateIf: {
            type: ["undefined", "dict"],
            templateIf: {
              dict: {
                full: true,
                templateAll: ["stringPrimative", "array", "dict"],
              }
            }
          },
        }, template, "Tester.test Function: ", "", false));
      }



      let squashedActual = Type.squashType(actual);
      let type = Type.getType(actual);

      if (!template.type.includes(type)) {
        issues.push(`Value '${squashedActual}' is expected to be of type/s (${template.type}), but got '${type}' instead`);
      }

      if (Type.isType(template.templateIf, "dict")) {
        for (let key in template.templateIf) {
          if (!type.includes(key)) {
            continue;
          }
          Merge.dicts(template, template.templateIf[key], []);
        }
      }

      if (type.includes("array") || type.includes("string")) {
        if (template.full === false && squashedActual.length > 0) {
          issues.push(`Value '${value}' must not be full`);
        } else if (template.full === true && squashedActual.length === 0) {
          issues.push(`Value '${value}' must be full`);
        }

        if (Type.isType(template.length, "number") && template.length !== squashedActual.length) {
          issues.push(`Value '${value}' must have a length of ${template.length}`);
        }
      }
      if (type.includes("dict")) {
        if (template.full === false && Object.keys(squashedActual).length > 0) {
          issues.push(`Value '${value}' must not be full`);
        } else if (template.full === true && Object.keys(squashedActual).length === 0) {
          issues.push(`Value '${value}' must be full`);
        }

        if (Type.isType(template.length, "number") && template.length !== Object.keys(squashedActual).length) {
          issues.push(`Value '${value}' must have a length of ${template.length}`);
        }
      }


      if (!(type.includes("array") || type.includes("dict"))) {
        return issues;
      }

      if (Type.isType(template.templateAll, "dict", "stringPrimaitive")) {
        for (let key in actual) {
          issues = issues.concat(resolveKey(template.templateAll, actual[key]));
        }
      }

      if (Tester.isTypes(template.template, ["array", "dict"])) {
        issues = issues.concat(resolveAll(template.template, actual));
      }
      return issues;

    }
    function resolveAll(template, actual) {
      let issues = [];

      if (!Type.isTypes(actual, ["array", "dict"])) {
        issues.push("Tester.test Function: actual is not an array or dict");
        console.error(issues[-1]);
        return issues;
      }

      if (Type.getType(Type.squashType(template)) !== Type.getType(Type.squashType(template))) {
        issues.push("Tester.test Function: The templates and actual type does not match");
        console.error(issues[-1]);
        return issues;
      }

      for (let key in template) {
        /**
         * At this point is there is no guarantee that the key will exist in actual.
         * However we can guarantee that it is a dict or array so if it doesnt exist it will return undefined
         */
        issues.concat(resolveKey(template[key], actual[key]));
      }

      return issues;
    }
    if (!Type.isType(prefix, "booleanPrimitive")) {
      issues.push("Tester.test Function: testTemplate is not a boolean");
      console.error(issues[-1]);
      return issues;
    }
    if (!Type.isType(prefix, "stringPrimitive")) {
      issues.push("Tester.test Function: prefix is not String");
      console.error(issues[-1]);
      return issues;
    }
    if (!Type.isType(suffix, "stringPrimitive")) {
      issues.push("Tester.test Function: suffix is not String");
      console.error(issues[-1]);
      return issues;
    }
    template = Type.squashRecursively(template);

    let issues = resolveAll(template, actual);

    for (let i in issues) {
      if (issues[i].includes("Tester.test Function:")) {
        continue;
      }
      issues[i] = `${prefix}${issues[i]}${suffix}`;
      console.warn(issues[i]);
    }
    if (issues.length !== 0) {
      console.debug(actual);
    }
    if (issues.length == 0) {
      return null;
    }
    return issues;
  }

  static all(template, actual, prefix = "", suffix = "",) {
    actual = Type.squashRecursively(actual);

    let output = {
      issues: Tester.test(template, actual, prefix, suffix),
    }

    return output;
  }
}
