/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=globalThis,Q=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),Y=new WeakMap;let ht=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Q&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Y.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Y.set(e,t))}return t}toString(){return this.cssText}};const ct=r=>new ht(typeof r=="string"?r:r+"",void 0,J),B=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new ht(e,r,J)},$t=(r,t)=>{if(Q)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=q.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},tt=Q?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ct(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:gt,defineProperty:yt,getOwnPropertyDescriptor:bt,getOwnPropertyNames:_t,getOwnPropertySymbols:mt,getPrototypeOf:vt}=Object,m=globalThis,et=m.trustedTypes,At=et?et.emptyScript:"",Ct=m.reactiveElementPolyfillSupport,T=(r,t)=>r,I={toAttribute(r,t){switch(t){case Boolean:r=r?At:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},K=(r,t)=>!gt(r,t),st={attribute:!0,type:String,converter:I,reflect:!1,useDefault:!1,hasChanged:K};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),m.litPropertyMetadata??(m.litPropertyMetadata=new WeakMap);let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=st){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&yt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=bt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){const l=i?.call(this);o?.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??st}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;const t=vt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){const e=this.properties,s=[..._t(e),...mt(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(tt(i))}else t!==void 0&&e.push(tt(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(s.converter?.toAttribute!==void 0?s.converter:I).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:I;this._$Em=i;const l=n.fromAttribute(e,o.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const i=this.constructor,o=this[t];if(s??(s=i.getPropertyOptions(t)),!((s.hasChanged??K)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,o]of s){const{wrapped:n}=o,l=this[i];n!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,o,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[T("elementProperties")]=new Map,x[T("finalized")]=new Map,Ct?.({ReactiveElement:x}),(m.reactiveElementVersions??(m.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis,V=H.trustedTypes,it=V?V.createPolicy("lit-html",{createHTML:r=>r}):void 0,dt="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,pt="?"+_,St=`<${pt}>`,E=document,k=()=>E.createComment(""),R=r=>r===null||typeof r!="object"&&typeof r!="function",F=Array.isArray,Et=r=>F(r)||typeof r?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rt=/-->/g,ot=/>/g,v=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),nt=/'/g,at=/"/g,ut=/^(?:script|style|textarea|title)$/i,wt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=wt(1),P=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),lt=new WeakMap,C=E.createTreeWalker(E,129);function ft(r,t){if(!F(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return it!==void 0?it.createHTML(t):t}const xt=(r,t)=>{const e=r.length-1,s=[];let i,o=t===2?"<svg>":t===3?"<math>":"",n=M;for(let l=0;l<e;l++){const a=r[l];let d,p,h=-1,g=0;for(;g<a.length&&(n.lastIndex=g,p=n.exec(a),p!==null);)g=n.lastIndex,n===M?p[1]==="!--"?n=rt:p[1]!==void 0?n=ot:p[2]!==void 0?(ut.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=v):p[3]!==void 0&&(n=v):n===v?p[0]===">"?(n=i??M,h=-1):p[1]===void 0?h=-2:(h=n.lastIndex-p[2].length,d=p[1],n=p[3]===void 0?v:p[3]==='"'?at:nt):n===at||n===nt?n=v:n===rt||n===ot?n=M:(n=v,i=void 0);const b=n===v&&r[l+1].startsWith("/>")?" ":"";o+=n===M?a+St:h>=0?(s.push(d),a.slice(0,h)+dt+a.slice(h)+_+b):a+_+(h===-2?l:b)}return[ft(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class D{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[d,p]=xt(t,e);if(this.el=D.createElement(d,s),C.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=C.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const h of i.getAttributeNames())if(h.endsWith(dt)){const g=p[n++],b=i.getAttribute(h).split(_),z=/([.?@])?(.*)/.exec(g);a.push({type:1,index:o,name:z[2],strings:b,ctor:z[1]==="."?Ot:z[1]==="?"?Ut:z[1]==="@"?Mt:W}),i.removeAttribute(h)}else h.startsWith(_)&&(a.push({type:6,index:o}),i.removeAttribute(h));if(ut.test(i.tagName)){const h=i.textContent.split(_),g=h.length-1;if(g>0){i.textContent=V?V.emptyScript:"";for(let b=0;b<g;b++)i.append(h[b],k()),C.nextNode(),a.push({type:2,index:++o});i.append(h[g],k())}}}else if(i.nodeType===8)if(i.data===pt)a.push({type:2,index:o});else{let h=-1;for(;(h=i.data.indexOf(_,h+1))!==-1;)a.push({type:7,index:o}),h+=_.length-1}o++}}static createElement(t,e){const s=E.createElement("template");return s.innerHTML=t,s}}function O(r,t,e=r,s){if(t===P)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const o=R(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=O(r,i._$AS(r,t.values),i,s)),t}class Pt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??E).importNode(e,!0);C.currentNode=i;let o=C.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let d;a.type===2?d=new j(o,o.nextSibling,this,t):a.type===1?d=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(d=new Tt(o,this,t)),this._$AV.push(d),a=s[++l]}n!==a?.index&&(o=C.nextNode(),n++)}return C.currentNode=E,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class j{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=O(this,t,e),R(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==P&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Et(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=D.createElement(ft(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const o=new Pt(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=lt.get(t.strings);return e===void 0&&lt.set(t.strings,e=new D(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new j(this.O(k()),this.O(k()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class W{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=c}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(o===void 0)t=O(this,t,e,0),n=!R(t)||t!==this._$AH&&t!==P,n&&(this._$AH=t);else{const l=t;let a,d;for(t=o[0],a=0;a<o.length-1;a++)d=O(this,l[s+a],e,a),d===P&&(d=this._$AH[a]),n||(n=!R(d)||d!==this._$AH[a]),d===c?t=c:t!==c&&(t+=(d??"")+o[a+1]),this._$AH[a]=d}n&&!i&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ot extends W{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}}class Ut extends W{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}}class Mt extends W{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=O(this,t,e,0)??c)===P)return;const s=this._$AH,i=t===c&&s!==c||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==c&&(s===c||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Tt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){O(this,t)}}const Ht=H.litHtmlPolyfillSupport;Ht?.(D,j),(H.litHtmlVersions??(H.litHtmlVersions=[])).push("3.3.1");const Nt=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const o=e?.renderBefore??null;s._$litPart$=i=new j(t.insertBefore(k(),o),o,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const N=globalThis;class S extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}}S._$litElement$=!0,S.finalized=!0,N.litElementHydrateSupport?.({LitElement:S});const kt=N.litElementPolyfillSupport;kt?.({LitElement:S});(N.litElementVersions??(N.litElementVersions=[])).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const X=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt={attribute:!0,type:String,converter:I,reflect:!1,hasChanged:K},Dt=(r=Rt,t,e)=>{const{kind:s,metadata:i}=e;let o=globalThis.litPropertyMetadata.get(i);if(o===void 0&&globalThis.litPropertyMetadata.set(i,o=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),o.set(e.name,r),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,r)},init(l){return l!==void 0&&this.C(n,void 0,r,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,r)}}throw Error("Unsupported decorator location: "+s)};function u(r){return(t,e)=>typeof e=="object"?Dt(r,t,e):((s,i,o)=>{const n=i.hasOwnProperty(o);return i.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(i,o):void 0})(r,t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const A=r=>r??c,jt=":host{display:inline-flex;font-family:var(--qgds-font-family);--button-background: #007bff;--button-text: #fff;--button-border-color: #007bff;--palette-primary-background: pink;--palette-primary-text: black;--button-disabled-background: #ccc;--button-disabled-text: #666;--button-disabled-border-color: #999;--border-radius: 4px;--button-border-width: 2px;--button-text-decoration: none;--button-text-decoration-hover: underline}";var Lt=Object.defineProperty,zt=Object.getOwnPropertyDescriptor,$=(r,t,e,s)=>{for(var i=s>1?void 0:s?zt(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Lt(t,e,i),i};let f=class extends S{constructor(){super(),this.label="Button",this.variant="default",this.size="medium",this.disabled=!1,this.href="",this.target="",this.type="button",this.ariaLabel="",this.palette=""}render(){const r=y` <slot>${this.label}</slot> `;return this.href?y`
          <a
            part="button"
            href=${this.href}
            target=${A(this.target||void 0)}
            aria-label=${A(this.ariaLabel||void 0)}
            palette=${A(this.palette||void 0)}
            variant=${A(this.variant||void 0)}
          >
            ${r}
          </a>
        `:y`
          <button
            part="button"
            ?disabled=${this.disabled}
            type=${this.type}
            aria-label=${A(this.ariaLabel||void 0)}
            palette=${A(this.palette||void 0)}
            variant=${A(this.variant||void 0)}
          >
            ${r}
          </button>
        `}};f.styles=[B`
      ${ct(jt)}
    `,B`
      button,
      a {
        font-family: var(--qgds-font-family);
        background-color: var(--button-background, #007bff);
        color: var(--button-text, white);
        border: var(--button-border-width) solid
          var(--button-border-color, #007bff);
        border-radius: var(--border-radius, 4px);
        padding-block: 0.5rem;
        padding-inline: 1rem;
        text-decoration: var(--button-text-decoration, none);

        transition:
          background-color 0.2s ease-in-out,
          border-color 0.2s ease-in-out,
          color 0.2s ease-in-out;
      }

      button:hover,
      a:hover {
        text-decoration: var(--button-text-decoration-hover, underline);
      }

      button[disabled],
      a[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
        background-color: var(--button-disabled-background, #cccccc);
        color: var(--button-disabled-text, #666666);
        border-color: var(--button-disabled-border-color, #999999);
      }

      /* Styles for different sizes (medium, large) */
      :host([size="large"]) button,
      :host([size="large"]) a {
        padding-block: 0.75rem;
        padding-inline: 1.5rem;
        font-size: 1.1rem;
      }

      /* Styles for different variants (default, bold, strong, dark, alt, tint) */
      /* These would typically be defined in qgds-button.css using custom properties */
      /* Example for a 'bold' variant: */
      :host([variant="bold"]) button,
      :host([variant="bold"]) a {
        font-weight: bold;
      }

      /* Styles for different palettes (primary, secondary, tertiary) */
      /* These would also typically be defined in qgds-button.css */
      /* Example for a 'primary' palette: */
      :host([palette="primary"]) button,
      :host([palette="primary"]) a {
        background-color: var(--palette-primary-background);
        color: var(--palette-primary-text);
      }
    `];$([u({type:String})],f.prototype,"label",2);$([u({type:String,reflect:!0})],f.prototype,"variant",2);$([u({type:String,reflect:!0})],f.prototype,"size",2);$([u({type:Boolean,reflect:!0})],f.prototype,"disabled",2);$([u({type:String})],f.prototype,"href",2);$([u({type:String})],f.prototype,"target",2);$([u({type:String})],f.prototype,"type",2);$([u({type:String,attribute:"aria-label"})],f.prototype,"ariaLabel",2);$([u({type:String,reflect:!0})],f.prototype,"palette",2);f=$([X("qgds-button")],f);var qt=Object.defineProperty,Bt=Object.getOwnPropertyDescriptor,L=(r,t,e,s)=>{for(var i=s>1?void 0:s?Bt(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&qt(t,e,i),i};let w=class extends S{constructor(){super(...arguments),this.headline="Callout headline",this.level="3",this.message="This is an alert message.",this.palette=""}render(){let r="";if(this.headline)switch(this.level.toLowerCase()){case"2":case"h2":r=y`<h2 class="headline">${this.headline}</h2>`;break;case"3":case"h3":r=y`<h3 class="headline">${this.headline}</h3>`;break;case"4":case"h4":r=y`<h4 class="headline">${this.headline}</h4>`;break;default:console.warn(`Unsupported headline level: ${this.level}. Defaulting to h3.`),r=y`<h3 class="headline">${this.headline}</h3>`}return y`
      <div class="qgds-callout">
        ${r}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `}};w.styles=B`
    :host {
      display: flex;
      flex-direction: column;
      background-color: var(--bg, #f9f9f9);
      color: var(--text-color, #333);
      padding: 1.5rem 1rem 1.5rem 1.5rem;
      border-left: 4px solid var(--accent-color);
      margin-bottom: 1rem;
    }

    .headline {
      margin: 0;
      padding: 0 0 1rem 0;
      font-size: 1.25rem;
      line-height: 2rem;
      font-weight: 600;
      color: var(--headline-color);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    qgds-button {
      max-width: 4rem;
    }
  `;L([u({type:String})],w.prototype,"headline",2);L([u({type:String,reflect:!0})],w.prototype,"level",2);L([u({type:String})],w.prototype,"message",2);L([u({type:String})],w.prototype,"palette",2);w=L([X("qgds-callout")],w);const It=["click","focus","blur","input","change","keydown","keyup","mouseenter","mouseleave","submit","reset","sl-input","sl-change"];function Vt(r,t,e=It){const s=i=>{const o={bubbles:!0,composed:!0,cancelable:i.cancelable};i instanceof CustomEvent&&(o.detail=i.detail),t.dispatchEvent(new Event(i.type,o))};for(const i of e)r.addEventListener(i,s);return()=>{for(const i of e)r.removeEventListener(i,s)}}var Wt=Object.defineProperty,Zt=Object.getOwnPropertyDescriptor,Z=(r,t,e,s)=>{for(var i=s>1?void 0:s?Zt(t,e):t,o=r.length-1,n;o>=0;o--)(n=r[o])&&(i=(s?n(t,e,i):n(i))||i);return s&&i&&Wt(t,e,i),i};let U=class extends S{constructor(){super(),this.headline="Alert headline",this.message="This is an alert message.",this.alerttype="info"}firstUpdated(){this.shadowRoot?.querySelector("button")?.addEventListener("click",r=>{Vt(this,r.currentTarget)})}render(){return y`
      <section class="qgds-alert" data-alert-type="${this.alerttype}">
        <div class="icon" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.9 10.5C28.2 8.8 27.2 7.3 25.9 6.1C24.6 4.8 23.2 3.8 21.5 3.1C19.8 2.4 17.9 2 16 2C14.1 2 12.2 2.4 10.5 3.1C8.8 3.8 7.3 4.8 6.1 6.1C4.8 7.4 3.8 8.8 3.1 10.5C2.4 12.2 2 14.1 2 16C2 17.9 2.4 19.8 3.1 21.5C3.8 23.2 4.8 24.7 6.1 25.9C7.4 27.2 8.8 28.2 10.5 28.9C12.2 29.6 14 30 16 30C17.9 30 19.7 29.6 21.5 28.9C23.2 28.2 24.7 27.2 25.9 25.9C27.2 24.6 28.2 23.2 28.9 21.5C29.6 19.8 30 18 30 16C30 14.1 29.6 12.2 28.9 10.5ZM24.6 24.6C22.2 27 19.4 28.1 16 28.1C12.6 28.1 9.7 26.9 7.4 24.6C5 22.2 3.9 19.4 3.9 16C3.9 12.6 5.1 9.7 7.4 7.4C9.7 5.1 12.6 3.9 16 3.9C19.4 3.9 22.3 5.1 24.6 7.4C27 9.8 28.1 12.6 28.1 16C28.1 19.4 27 22.2 24.6 24.6ZM16 9C15.6 9 15.3 9.1 15.1 9.4C14.9 9.6 14.7 9.9 14.7 10.3C14.7 10.6 14.8 10.9 15.1 11.2C15.3 11.4 15.6 11.6 16 11.6C16.4 11.6 16.7 11.5 16.9 11.2C17.1 11 17.3 10.7 17.3 10.3C17.3 9.9 17.2 9.6 16.9 9.4C16.7 9.1 16.4 9 16 9ZM16 14C15.7 14 15.5 14.1 15.3 14.3C15.1 14.5 15 14.7 15 15V22C15 22.3 15.1 22.5 15.3 22.7C15.5 22.9 15.7 23 16 23C16.3 23 16.5 22.9 16.7 22.7C16.9 22.5 17 22.3 17 22V15C17 14.7 16.9 14.5 16.7 14.3C16.5 14.1 16.3 14 16 14Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div class="content">
          <h3 class="headline">${this.headline}</h3>
          <div class="content" data-alert-type="${this.alerttype}">
            <slot></slot>
          </div>
        </div>
      </section>
    `}};U.styles=[B`
      :host {
        display: block;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        background-color: var(--bg, var(--palette-bright-shade));
        color: var(--color, var(--palette-bright-typography-body-default));
      }

      .qgds-alert {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .icon {
        color: var(--color);
      }
    `];Z([u({type:String})],U.prototype,"headline",2);Z([u({type:String})],U.prototype,"message",2);Z([u({type:String})],U.prototype,"alerttype",2);U=Z([X("qgds-inpage-alert")],U);
//# sourceMappingURL=qgds-web-components.js.map
