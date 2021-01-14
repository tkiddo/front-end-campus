/*
 * @Author: tkiddo
 * @Date: 2021-01-12 10:57:31
 * @LastEditors: tkiddo
 * @LastEditTime: 2021-01-14 14:59:12
 * @Description:
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');

  const ast = parser.parse(content, { sourceType: 'module' });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    }
  });

  const { code } = transformFromAst(ast, null, { presets: ['@babel/preset-env'] });

  return { filename, code, dependencies };
}

function createGraph(entry) {
  const entryAsset = createAsset(entry);

  const queue = [entryAsset];

  const graph = {};

  graph[entryAsset.filename] = entryAsset;

  for (const asset of queue) {
    const { dependencies } = asset;

    asset.mapping = {};

    const dirname = path.dirname(asset.filename);

    dependencies.forEach((filename) => {
      const absolutePath = path.join(dirname, filename).replace(/\\/g, '/');

      let child;

      if (graph[absolutePath]) {
        child = graph[absolutePath];
      } else {
        child = createAsset(absolutePath);
        graph[absolutePath] = child;
        queue.push(child);
      }

      asset.mapping[filename] = absolutePath;
    });
  }

  return graph;
}

function bundle(entry) {
  const graph = createGraph(entry);

  let modules = '';

  Object.keys(graph).forEach((key) => {
    const { code, mapping } = graph[key];

    let newCode = code;
    Object.keys(mapping).forEach((mkey) => {
      newCode = newCode.replace(mkey, mapping[mkey]);
    });

    modules += `
    '${key}':function(require,module,exports){
      ${newCode}
    },
    `;
  });

  let result = `
  (function(modules){
    function require(id){
      const fn = modules[id]

      const module = { exports:{} };

      fn(require,module,module.exports);

      return module.exports;
    }
    require('${entry}');
  })({${modules}})
  `;

  return result;
}

const result = bundle('../example/src/entry.js');

fs.writeFile(path.resolve(__dirname, 'dist.js'), result, () => {});
