/*
 * @Author: tkiddo
 * @Date: 2021-01-12 17:10:51
 * @LastEditors: tkiddo
 * @LastEditTime: 2021-01-12 17:19:45
 * @Description:/*
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core');

let ID = 0;

function createAsset(filename) {
  const content = fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

  const ast = parser.parse(content, { sourceType: 'module' });

  const dependencies = [];

  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value);
    }
  });

  const { code } = transformFromAst(ast, null, { presets: ['@babel/preset-env'] });
  const id = ID++;
  return { id, filename, code, dependencies };
}

function createGraph(entry) {
  const entryAsset = createAsset(entry);

  const queue = [entryAsset];

  for (const asset of queue) {
    const { dependencies } = asset;

    asset.mapping = {};

    const dirname = path.dirname(asset.filename);

    dependencies.forEach((filename) => {
      const absolutePath = path.join(dirname, filename);

      const child = createAsset(absolutePath);

      asset.mapping[filename] = child.id;

      queue.push(child);
    });
  }
  return queue;
}

function bundle(graph) {
  let modules = '';

  graph.forEach((item, index) => {
    modules += `${item.id}:[
      function(require,module,exports){
        ${item.code}
      },
      ${JSON.stringify(item.mapping)}
    ],
    `;
  });

  let result = `
  (function(modules){
    function require(id){
      const [fn,mapping] = modules[id];

      function localRequire(name){
        return require(mapping[name]);
      }

      const module = { exports:{} };

      fn(localRequire,module,module.exports);

      return module.exports;
    }
    require(0);
  })({${modules}})
  `;

  return result;
}

const graph = createGraph('../example/entry.js');
const result = bundle(graph);

fs.writeFile(path.resolve(__dirname, 'dist.js'), result, () => {});
