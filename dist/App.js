"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;
var _react = _interopRequireWildcard(require("react"));
var _tinymceReact = require("@tinymce/tinymce-react");
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function App() {
  var editorRef = (0, _react.useRef)(null);
  var log = function log() {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  //To download the source code as HTML or txt filenp
  var saveContentAsHTML = function saveContentAsHTML() {
    if (editorRef.current) {
      var content = editorRef.current.getContent();
      var blob = new Blob([content], {
        type: 'text/html'
      });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'content.html';
      link.download = 'content.txt';
      link.click();
    }
  };
  var saveContentToDatabase = function saveContentToDatabase() {
    if (editorRef.current) {
      var content = editorRef.current.getContent();
      console.log("The content is " + content);
      _axios.default.post('http://localhost:3000/api/saveContent', {
        content: content
      }).then(function (res) {
        console.log(res.data);
        alert('Content saved to database!');
      }).catch(function (err) {
        console.error(err);
        alert('Error saving content to database.');
      });
    }
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_tinymceReact.Editor, {
    tinymceScriptSrc: process.env.PUBLIC_URL + '/tinymce/tinymce.min.js',
    onInit: function onInit(evt, editor) {
      return editorRef.current = editor;
    },
    initialValue: "<p>This is the initial content of the editor.</p>",
    init: {
      height: 500,
      menubar: false,
      plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'],
      toolbar: 'undo redo | blocks | ' + 'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'removeformat | help | code',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }
  }), /*#__PURE__*/_react.default.createElement("button", {
    onClick: log
  }, "Log editor content"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: saveContentAsHTML
  }, "Save as HTML"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: saveContentToDatabase
  }, "Save to DB"));
}
