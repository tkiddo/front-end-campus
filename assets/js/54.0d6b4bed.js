(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{565:function(t,a,s){"use strict";s.r(a);var n=s(11),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("p",[t._v("YAML 是一种数据序列化语言，旨在供使用者直接写入和读取。")]),t._v(" "),s("p",[t._v("它是 JSON 的严格超集，添加了语法上重要的换行符和缩进，就像 Python 一样。然而，与 Python 不同的是，YAML 不允许缩进文字制表符。")]),t._v(" "),s("h2",{attrs:{id:"基础类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#基础类型"}},[t._v("#")]),t._v(" 基础类型")]),t._v(" "),s("p",[t._v("YAML 的根对象就是一个 "),s("code",[t._v("Map")]),t._v("，类似其他语言的"),s("code",[t._v("object")]),t._v(","),s("code",[t._v("hash")]),t._v(","),s("code",[t._v("dictionary")]),t._v("。")]),t._v(" "),s("p",[t._v("就像"),s("code",[t._v("JSON")]),t._v("对象一样，以键值对的形式保存数据。以"),s("code",[t._v("#")]),t._v("开头为注释。")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 字符串类型值，可以不加引号，也可以加")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" hello\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("quoted")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'quote string'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 数字类型值")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("age")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("12")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 布尔类型值")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("isMale")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("\n")])])]),s("p",[t._v("键可以有空格，也可以加引号。")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 如果想在键中加`:`可以使用带引号的键")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("'Keys can be quoted too:'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'value'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("single quotes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'value'")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 包含多个转义字符")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("double quotes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"have many: \\", \\0, \\t, \\u263A, \\x0d\\x0a == \\r\\n, and more."')]),t._v("\n")])])]),s("p",[t._v("多行字符串可以写成“文字块”（使用 | ,保留换行符），或“折叠块”（使用“>”，换行符被替换为空格）")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("literal_block")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("|")]),s("span",{pre:!0,attrs:{class:"token scalar string"}},[t._v("\n  This entire block of text will be the value of the 'literal_block' key,\n  with line breaks being preserved.")]),t._v("\n\n  The literal continues until de"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("dented"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" and the leading indentation is\n  stripped.\n\n      Any lines that are 'more"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("indented' keep the rest of their indentation "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("\n      these lines will be indented by 4 spaces.\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("folded_style")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")]),s("span",{pre:!0,attrs:{class:"token scalar string"}},[t._v("\n  This entire block of text will be the value of 'folded_style', but this\n  time, all newlines will be replaced with a single space.")]),t._v("\n\n  Blank lines"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" like above"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" are converted to a newline character.\n\n      'More"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("indented' lines keep their newlines"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" too "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("\n      this text will appear over two lines.\n")])])]),s("h2",{attrs:{id:"对象类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#对象类型"}},[t._v("#")]),t._v(" 对象类型")]),t._v(" "),s("p",[t._v("对象中的键需要嵌套使用缩进。 2 个空格缩进是首选（但不是必需的）。")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("a_nested_map")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" value\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("another_key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Another Value\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("another_nested_map")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("hello")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" hello\n")])])]),s("p",[t._v("键不一定必须是字符串")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("0.25")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" a float key\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 键也可以很复杂，比如多行对象")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 我们用 ？后跟一个空格以指示复杂键的开始。")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("?")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("|")]),t._v("\n  This is a key\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("that has multiple lines")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" and this is its value\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# YAML 还允许在具有复杂键语法的序列之间进行映射")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 一些语言解析器可能会抱怨")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 一个例子")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("?")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" Manchester United\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("Real Madrid")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token datetime number"}},[t._v("2001-01-01")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token datetime number"}},[t._v("2002-02-02")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 序列（相当于列表或数组）看起来像这样")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#（注意“-”算作缩进）")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("a_sequence")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" Item 1\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" Item 2\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# sequences can contain disparate types.")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" Item 4\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" value\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("another_key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" another_value\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" This is a sequence\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" inside another sequence\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" Nested sequence indicators\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" can be collapsed\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 由于 YAML 是 JSON 的超集，因此您还可以编写 JSON 样式的映射和序列：")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("json_map")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("'key'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'value'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("json_seq")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'takeoff'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("and quotes are optional")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" takeoff"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"更多特性"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#更多特性"}},[t._v("#")]),t._v(" 更多特性")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# YAML 还有一个方便的功能叫做“锚点”，让你轻松复制文档中的内容。这两个键将具有相同的值：")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("anchored_content")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("&anchor_name")]),t._v(" This string will appear as the value of two keys.\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("other_anchor")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("*anchor_name")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 锚点可用于复制/继承属性")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("base")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("&base")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Everyone has same name\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# regexp << 被称为 Merge Key Language-Independent Type。它用于表示应该插入一个或多个指定映射的所有键进入当前对象")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("foo")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("<<")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("*base")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("age")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("bar")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("<<")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("*base")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("age")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("20")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# foo and bar 都将包含属性 name: Everyone has same name")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# YAML 还具有标签，您可以使用它们来显式声明类型。")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("explicit_string")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token tag"}},[t._v("!!str")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0.5")]),t._v("\n")])])]),s("h2",{attrs:{id:"更多类型"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#更多类型"}},[t._v("#")]),t._v(" 更多类型")]),t._v(" "),s("div",{staticClass:"language-yml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 字符串和数字并不是 YAML 可以理解的唯一标量。 ISO 格式的日期和日期时间文字也被解析。")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("datetime")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token datetime number"}},[t._v("2001-12-15T02:59:43.1Z")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("datetime_with_spaces")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token datetime number"}},[t._v("2001-12-14 21:59:43.10 -5")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("date")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token datetime number"}},[t._v("2002-12-14")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# !!binary 标签表示一个字符串实际上是一个 base64 编码的二进制 blob 的表示。")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("gif_file")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token tag"}},[t._v("!!binary")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("|")]),s("span",{pre:!0,attrs:{class:"token scalar string"}},[t._v("\n  R0lGODlhDAAMAIQAAP//9/X17unp5WZmZgAAAOfn515eXvPz7Y6OjuDg4J+fn5\n  OTk6enp56enmlpaWNjY6Ojo4SEhP/++f/++f/++f/++f/++f/++f/++f/++f/+\n  +f/++f/++f/++f/++f/++SH+Dk1hZGUgd2l0aCBHSU1QACwAAAAADAAMAAAFLC\n  AgjoEwnuNAFOhpEMTRiggcz4BNJHrv/zCFcLiwMWYNG84BwwEeECcgggoBADs=")]),t._v("\n")])])]),s("h2",{attrs:{id:"参考文章"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考文章"}},[t._v("#")]),t._v(" 参考文章")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://learnxinyminutes.com/docs/yaml/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Learn X in Y minutes"),s("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=e.exports}}]);