import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./chunk-QFMPRPBF-CJePKBBp.js";import{c as y}from"./button-S0umEhYV.js";import{c as d}from"./app-shell-BlZrXGuO.js";import{L as v}from"./link-DKv6pUKY.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",key:"mg9rjx"}]],C=d("bold",L);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]],w=d("italic",_);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M10 12h11",key:"6m4ad9"}],["path",{d:"M10 18h11",key:"11hvi2"}],["path",{d:"M10 6h11",key:"c7qv1k"}],["path",{d:"M4 10h2",key:"16xx2s"}],["path",{d:"M4 6h1v4",key:"cnovpq"}],["path",{d:"M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",key:"m9a95d"}]],N=d("list-ordered",H);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 18h.01",key:"1tta3j"}],["path",{d:"M3 6h.01",key:"1rqtza"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 18h13",key:"1lx6n3"}],["path",{d:"M8 6h13",key:"ik3vkj"}]],R=d("list",T);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M13 4v16",key:"8vvj80"}],["path",{d:"M17 4v16",key:"7dpous"}],["path",{d:"M19 4H9.5a4.5 4.5 0 0 0 0 9H13",key:"sh4n9v"}]],E=d("pilcrow",I);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]],$=d("underline",B),a=({icon:o,label:r,onClick:m})=>t.jsx("button",{type:"button",onMouseDown:f=>{f.preventDefault(),m()},title:r,className:y("flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"),children:t.jsx(o,{className:"h-3.5 w-3.5"})});function l(o,r){document.execCommand(o,!1,r)}function k(o){const r=document.createElement("template");return r.innerHTML=o,r.content}const U=c.forwardRef(({value:o,onChange:r,placeholder:m,className:f,minHeight:b=180},g)=>{const n=c.useRef(null),p=c.useRef(!1),h=c.useCallback(()=>{n.current&&(p.current=!0,r(n.current.innerHTML))},[r]);c.useImperativeHandle(g,()=>({getHTML:()=>{var e;return((e=n.current)==null?void 0:e.innerHTML)||""},getPlainText:()=>{var e,i;return((e=n.current)==null?void 0:e.textContent)||((i=n.current)==null?void 0:i.innerText)||""},setHTML:e=>{n.current&&(p.current=!0,n.current.innerHTML=e,r(e))},insertHTML:e=>{const i=n.current;if(!i)return;i.focus();const u=window.getSelection();if(u&&u.rangeCount>0){const x=u.getRangeAt(0);x.deleteContents();const j=k(e);x.insertNode(j),x.collapse(!1),u.removeAllRanges(),u.addRange(x)}else i.appendChild(k(e));h()},appendHTML:e=>{const i=n.current;i&&(i.appendChild(k(e)),h())}})),c.useEffect(()=>{n.current&&!p.current&&n.current.innerHTML!==o&&(n.current.innerHTML=o),p.current=!1},[o]);const s=c.useCallback(()=>{h()},[h]),M=()=>{const e=window.prompt("Enter URL:");e&&(l("createLink",e),s())};return t.jsxs("div",{className:y("rounded-md border border-input bg-background overflow-hidden","focus-within:ring-1 focus-within:ring-ring",f),children:[t.jsxs("div",{className:"flex items-center gap-0.5 border-b border-border/50 px-2 py-1 bg-muted/30",children:[t.jsx(a,{icon:C,label:"Bold (Ctrl+B)",onClick:()=>{l("bold"),s()}}),t.jsx(a,{icon:w,label:"Italic (Ctrl+I)",onClick:()=>{l("italic"),s()}}),t.jsx(a,{icon:$,label:"Underline (Ctrl+U)",onClick:()=>{l("underline"),s()}}),t.jsx("div",{className:"mx-1 h-4 w-px bg-border"}),t.jsx(a,{icon:R,label:"Bullet list",onClick:()=>{l("insertUnorderedList"),s()}}),t.jsx(a,{icon:N,label:"Numbered list",onClick:()=>{l("insertOrderedList"),s()}}),t.jsx(a,{icon:E,label:"Paragraph",onClick:()=>{l("formatBlock","p"),s()}}),t.jsx("div",{className:"mx-1 h-4 w-px bg-border"}),t.jsx(a,{icon:v,label:"Insert link",onClick:M})]}),t.jsx("div",{ref:n,contentEditable:!0,suppressContentEditableWarning:!0,onInput:s,"data-placeholder":m,className:y("prose prose-sm prose-invert max-w-none px-3 py-2 outline-none text-sm text-foreground","min-h-[180px] max-h-[400px] overflow-y-auto","[&_a]:text-blue-400 [&_a]:underline","[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5","empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"),style:{minHeight:`${b}px`}})]})});U.displayName="RichEditor";export{U as R};
