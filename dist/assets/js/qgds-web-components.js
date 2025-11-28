/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis,F=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Z=Symbol(),X=new WeakMap;let lt=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Z)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(F&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=X.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&X.set(e,t))}return t}toString(){return this.cssText}};const ct=a=>new lt(typeof a=="string"?a:a+"",void 0,Z),j=(a,...t)=>{const e=a.length===1?a[0]:t.reduce((r,o,i)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+a[i+1],a[0]);return new lt(e,a,Z)},bt=(a,t)=>{if(F)a.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),o=L.litNonce;o!==void 0&&r.setAttribute("nonce",o),r.textContent=e.cssText,a.appendChild(r)}},Y=F?a=>a:a=>a instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return ct(e)})(a):a;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:vt,defineProperty:ft,getOwnPropertyDescriptor:gt,getOwnPropertyNames:yt,getOwnPropertySymbols:mt,getPrototypeOf:$t}=Object,$=globalThis,tt=$.trustedTypes,_t=tt?tt.emptyScript:"",xt=$.reactiveElementPolyfillSupport,O=(a,t)=>a,q={toAttribute(a,t){switch(t){case Boolean:a=a?_t:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,t){let e=a;switch(t){case Boolean:e=a!==null;break;case Number:e=a===null?null:Number(a);break;case Object:case Array:try{e=JSON.parse(a)}catch{e=null}}return e}},G=(a,t)=>!vt(a,t),et={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:G};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),$.litPropertyMetadata??($.litPropertyMetadata=new WeakMap);let C=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=et){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(t,r,e);o!==void 0&&ft(this.prototype,t,o)}}static getPropertyDescriptor(t,e,r){const{get:o,set:i}=gt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:o,set(n){const l=o?.call(this);i?.call(this,n),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??et}static _$Ei(){if(this.hasOwnProperty(O("elementProperties")))return;const t=$t(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(O("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(O("properties"))){const e=this.properties,r=[...yt(e),...mt(e)];for(const o of r)this.createProperty(o,e[o])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,o]of e)this.elementProperties.set(r,o)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const o=this._$Eu(e,r);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const o of r)e.unshift(Y(o))}else t!==void 0&&e.push(Y(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const i=(r.converter?.toAttribute!==void 0?r.converter:q).toAttribute(e,r.type);this._$Em=t,i==null?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const r=this.constructor,o=r._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const i=r.getPropertyOptions(o),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:q;this._$Em=o;const l=n.fromAttribute(e,i.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){const o=this.constructor,i=this[t];if(r??(r=o.getPropertyOptions(t)),!((r.hasChanged??G)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:o,wrapped:i},n){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,i]of this._$Ep)this[o]=i;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,i]of r){const{wrapped:n}=i,l=this[o];n!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,i,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[O("elementProperties")]=new Map,C[O("finalized")]=new Map,xt?.({ReactiveElement:C}),($.reactiveElementVersions??($.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const U=globalThis,I=U.trustedTypes,rt=I?I.createPolicy("lit-html",{createHTML:a=>a}):void 0,dt="$lit$",m=`lit$${Math.random().toFixed(9).slice(2)}$`,ut="?"+m,At=`<${ut}>`,k=document,T=()=>k.createComment(""),H=a=>a===null||typeof a!="object"&&typeof a!="function",Q=Array.isArray,kt=a=>Q(a)||typeof a?.[Symbol.iterator]=="function",W=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ot=/-->/g,at=/>/g,_=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),it=/'/g,nt=/"/g,ht=/^(?:script|style|textarea|title)$/i,St=a=>(t,...e)=>({_$litType$:a,strings:t,values:e}),g=St(1),E=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),st=new WeakMap,x=k.createTreeWalker(k,129);function pt(a,t){if(!Q(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return rt!==void 0?rt.createHTML(t):t}const Ct=(a,t)=>{const e=a.length-1,r=[];let o,i=t===2?"<svg>":t===3?"<math>":"",n=P;for(let l=0;l<e;l++){const s=a[l];let d,h,c=-1,f=0;for(;f<s.length&&(n.lastIndex=f,h=n.exec(s),h!==null);)f=n.lastIndex,n===P?h[1]==="!--"?n=ot:h[1]!==void 0?n=at:h[2]!==void 0?(ht.test(h[2])&&(o=RegExp("</"+h[2],"g")),n=_):h[3]!==void 0&&(n=_):n===_?h[0]===">"?(n=o??P,c=-1):h[1]===void 0?c=-2:(c=n.lastIndex-h[2].length,d=h[1],n=h[3]===void 0?_:h[3]==='"'?nt:it):n===nt||n===it?n=_:n===ot||n===at?n=P:(n=_,o=void 0);const y=n===_&&a[l+1].startsWith("/>")?" ":"";i+=n===P?s+At:c>=0?(r.push(d),s.slice(0,c)+dt+s.slice(c)+m+y):s+m+(c===-2?l:y)}return[pt(a,i+(a[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class N{constructor({strings:t,_$litType$:e},r){let o;this.parts=[];let i=0,n=0;const l=t.length-1,s=this.parts,[d,h]=Ct(t,e);if(this.el=N.createElement(d,r),x.currentNode=this.el.content,e===2||e===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=x.nextNode())!==null&&s.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(const c of o.getAttributeNames())if(c.endsWith(dt)){const f=h[n++],y=o.getAttribute(c).split(m),D=/([.?@])?(.*)/.exec(f);s.push({type:1,index:i,name:D[2],strings:y,ctor:D[1]==="."?wt:D[1]==="?"?Pt:D[1]==="@"?Ot:V}),o.removeAttribute(c)}else c.startsWith(m)&&(s.push({type:6,index:i}),o.removeAttribute(c));if(ht.test(o.tagName)){const c=o.textContent.split(m),f=c.length-1;if(f>0){o.textContent=I?I.emptyScript:"";for(let y=0;y<f;y++)o.append(c[y],T()),x.nextNode(),s.push({type:2,index:++i});o.append(c[f],T())}}}else if(o.nodeType===8)if(o.data===ut)s.push({type:2,index:i});else{let c=-1;for(;(c=o.data.indexOf(m,c+1))!==-1;)s.push({type:7,index:i}),c+=m.length-1}i++}}static createElement(t,e){const r=k.createElement("template");return r.innerHTML=t,r}}function w(a,t,e=a,r){if(t===E)return t;let o=r!==void 0?e._$Co?.[r]:e._$Cl;const i=H(t)?void 0:t._$litDirective$;return o?.constructor!==i&&(o?._$AO?.(!1),i===void 0?o=void 0:(o=new i(a),o._$AT(a,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=o:e._$Cl=o),o!==void 0&&(t=w(a,o._$AS(a,t.values),o,r)),t}class Et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,o=(t?.creationScope??k).importNode(e,!0);x.currentNode=o;let i=x.nextNode(),n=0,l=0,s=r[0];for(;s!==void 0;){if(n===s.index){let d;s.type===2?d=new R(i,i.nextSibling,this,t):s.type===1?d=new s.ctor(i,s.name,s.strings,this,t):s.type===6&&(d=new Ut(i,this,t)),this._$AV.push(d),s=r[++l]}n!==s?.index&&(i=x.nextNode(),n++)}return x.currentNode=k,o}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,o){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),H(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=N.createElement(pt(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(e);else{const i=new Et(o,this),n=i.u(this.options);i.p(e),this.T(n),this._$AH=i}}_$AC(t){let e=st.get(t.strings);return e===void 0&&st.set(t.strings,e=new N(t)),e}k(t){Q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,o=0;for(const i of t)o===e.length?e.push(r=new R(this.O(T()),this.O(T()),this,this.options)):r=e[o],r._$AI(i),o++;o<e.length&&(this._$AR(r&&r._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class V{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,o,i){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=u}_$AI(t,e=this,r,o){const i=this.strings;let n=!1;if(i===void 0)t=w(this,t,e,0),n=!H(t)||t!==this._$AH&&t!==E,n&&(this._$AH=t);else{const l=t;let s,d;for(t=i[0],s=0;s<i.length-1;s++)d=w(this,l[r+s],e,s),d===E&&(d=this._$AH[s]),n||(n=!H(d)||d!==this._$AH[s]),d===u?t=u:t!==u&&(t+=(d??"")+i[s+1]),this._$AH[s]=d}n&&!o&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class wt extends V{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}}class Pt extends V{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}}class Ot extends V{constructor(t,e,r,o,i){super(t,e,r,o,i),this.type=5}_$AI(t,e=this){if((t=w(this,t,e,0)??u)===E)return;const r=this._$AH,o=t===u&&r!==u||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==u&&(r===u||o);o&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Ut{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}}const Mt=U.litHtmlPolyfillSupport;Mt?.(N,R),(U.litHtmlVersions??(U.litHtmlVersions=[])).push("3.3.1");const Tt=(a,t,e)=>{const r=e?.renderBefore??t;let o=r._$litPart$;if(o===void 0){const i=e?.renderBefore??null;r._$litPart$=o=new R(t.insertBefore(T(),i),i,void 0,e??{})}return o._$AI(a),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=globalThis;class A extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}}A._$litElement$=!0,A.finalized=!0,M.litElementHydrateSupport?.({LitElement:A});const Ht=M.litElementPolyfillSupport;Ht?.({LitElement:A});(M.litElementVersions??(M.litElementVersions=[])).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const J=a=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(a,t)}):customElements.define(a,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt={attribute:!0,type:String,converter:q,reflect:!1,hasChanged:G},Rt=(a=Nt,t,e)=>{const{kind:r,metadata:o}=e;let i=globalThis.litPropertyMetadata.get(o);if(i===void 0&&globalThis.litPropertyMetadata.set(o,i=new Map),r==="setter"&&((a=Object.create(a)).wrapped=!0),i.set(e.name,a),r==="accessor"){const{name:n}=e;return{set(l){const s=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,s,a)},init(l){return l!==void 0&&this.C(n,void 0,a,l),l}}}if(r==="setter"){const{name:n}=e;return function(l){const s=this[n];t.call(this,l),this.requestUpdate(n,s,a)}}throw Error("Unsupported decorator location: "+r)};function p(a){return(t,e)=>typeof e=="object"?Rt(a,t,e):((r,o,i)=>{const n=o.hasOwnProperty(i);return o.constructor.createProperty(i,r),n?Object.getOwnPropertyDescriptor(o,i):void 0})(a,t,e)}const zt=["click","focus","blur","input","change","keydown","keyup","mouseenter","mouseleave","submit","reset","sl-input","sl-change"];function Dt(a,t,e=zt){const r=o=>{const i={bubbles:!0,composed:!0,cancelable:o.cancelable};o instanceof CustomEvent&&(i.detail=o.detail),t.dispatchEvent(new o.constructor(o.type,i))};for(const o of e)a.addEventListener(o,r);return()=>{for(const o of e)a.removeEventListener(o,r)}}var Lt=Object.getOwnPropertyDescriptor,jt=(a,t,e,r)=>{for(var o=r>1?void 0:r?Lt(t,e):t,i=a.length-1,n;i>=0;i--)(n=a[i])&&(o=n(o)||o);return o};let B=class extends A{constructor(){super(),this.headline="Alert headline",this.message="This is an alert message.",this.alerttype="info"}firstUpdated(){this.shadowRoot.querySelector("button")?.addEventListener("click",a=>{Dt(a,this)})}render(){return g`
      <section class="qgds-alert" data-alert-type="${this.alerttype}">
        <div class="icon" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M28.9 10.5C28.2 8.8 27.2 7.3 25.9 6.1C24.6 4.8 23.2 3.8 21.5 3.1C19.8 2.4 17.9 2 16 2C14.1 2 12.2 2.4 10.5 3.1C8.8 3.8 7.3 4.8 6.1 6.1C4.8 7.4 3.8 8.8 3.1 10.5C2.4 12.2 2 14.1 2 16C2 17.9 2.4 19.8 3.1 21.5C3.8 23.2 4.8 24.7 6.1 25.9C7.4 27.2 8.8 28.2 10.5 28.9C12.2 29.6 14 30 16 30C17.9 30 19.7 29.6 21.5 28.9C23.2 28.2 24.7 27.2 25.9 25.9C27.2 24.6 28.2 23.2 28.9 21.5C29.6 19.8 30 18 30 16C30 14.1 29.6 12.2 28.9 10.5ZM24.6 24.6C22.2 27 19.4 28.1 16 28.1C12.6 28.1 9.7 26.9 7.4 24.6C5 22.2 3.9 19.4 3.9 16C3.9 12.6 5.1 9.7 7.4 7.4C9.7 5.1 12.6 3.9 16 3.9C19.4 3.9 22.3 5.1 24.6 7.4C27 9.8 28.1 12.6 28.1 16C28.1 19.4 27 22.2 24.6 24.6ZM16 9C15.6 9 15.3 9.1 15.1 9.4C14.9 9.6 14.7 9.9 14.7 10.3C14.7 10.6 14.8 10.9 15.1 11.2C15.3 11.4 15.6 11.6 16 11.6C16.4 11.6 16.7 11.5 16.9 11.2C17.1 11 17.3 10.7 17.3 10.3C17.3 9.9 17.2 9.6 16.9 9.4C16.7 9.1 16.4 9 16 9ZM16 14C15.7 14 15.5 14.1 15.3 14.3C15.1 14.5 15 14.7 15 15V22C15 22.3 15.1 22.5 15.3 22.7C15.5 22.9 15.7 23 16 23C16.3 23 16.5 22.9 16.7 22.7C16.9 22.5 17 22.3 17 22V15C17 14.7 16.9 14.5 16.7 14.3C16.5 14.1 16.3 14 16 14Z"
              fill="currentColor" />
          </svg>
        </div>

        <div class="content">
          <h3 class="headline">${this.headline}</h3>
          <div class="content" data-alert-type="${this.alerttype}">
            <slot></slot>
          </div>
        </div>
      </section>
    `}};B.properties={headline:{type:String},message:{type:String},alerttype:{type:String}};B.styles=[j`
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
    `];B=jt([J("qgds-inpage-alert")],B);var qt=Object.defineProperty,It=Object.getOwnPropertyDescriptor,z=(a,t,e,r)=>{for(var o=r>1?void 0:r?It(t,e):t,i=a.length-1,n;i>=0;i--)(n=a[i])&&(o=(r?n(t,e,o):n(o))||o);return r&&o&&qt(t,e,o),o};let S=class extends A{constructor(){super(...arguments),this.headline="Callout headline",this.level="3",this.message="This is an alert message.",this.palette=""}render(){let a="";if(this.headline)switch(this.level.toLowerCase()){case"2":case"h2":a=g`<h2 class="headline">${this.headline}</h2>`;break;case"3":case"h3":a=g`<h3 class="headline">${this.headline}</h3>`;break;case"4":case"h4":a=g`<h4 class="headline">${this.headline}</h4>`;break;default:console.warn(`Unsupported headline level: ${this.level}. Defaulting to h3.`),a=g`<h3 class="headline">${this.headline}</h3>`}return g`
      <div class="qgds-callout">
        ${a}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `}};S.styles=j`
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
  `;z([p({type:String})],S.prototype,"headline",2);z([p({type:String,reflect:!0})],S.prototype,"level",2);z([p({type:String})],S.prototype,"message",2);z([p({type:String})],S.prototype,"palette",2);S=z([J("qgds-callout")],S);const K=':host{--border-radius: 4px}:host-context([palette="strong"]){--button-background: var(--palette-strong-action-button-primary-default-background);--button-text: var(--palette-strong-action-button-primary-default-text);--button-text-decoration: var(--palette-strong-action-button-primary-default-text-decoration);--button-border-color: var(--palette-strong-action-button-primary-default-border);--button-hover-background: var(--palette-strong-action-button-primary-hover-background);--button-hover-text: var(--palette-strong-action-button-primary-hover-text);--button-hover-border: var(--palette-strong-action-button-primary-hover-border);--button-active-background: var(--palette-strong-action-button-primary-active-background);--button-active-text: var(--palette-strong-action-button-primary-active-text);--button-active-border: var(--palette-strong-action-button-primary-active-border);--button-focus-background: var(--palette-strong-action-button-primary-default-border);--button-focus-text: var(--palette-strong-action-button-primary-hover-border);--button-focus-border: var(--palette-strong-action-button-primary-active-border)}:host-context([palette="dark"]){--button-background: var(--palette-dark-action-button-primary-default-background);--button-text: var(--palette-dark-action-button-primary-default-text);--button-text-decoration: var(--palette-dark-action-button-primary-default-text-decoration);--button-border-color: var(--palette-dark-action-button-primary-default-border);--button-hover-background: var(--palette-dark-action-button-primary-hover-background);--button-hover-text: var(--palette-dark-action-button-primary-hover-text);--button-hover-border: var(--palette-dark-action-button-primary-hover-border);--button-active-background: var(--palette-dark-action-button-primary-active-background);--button-active-text: var(--palette-dark-action-button-primary-active-text);--button-active-border: var(--palette-dark-action-button-primary-active-border);--button-focus-background: var(--palette-dark-action-button-primary-default-border);--button-focus-text: var(--palette-dark-action-button-primary-hover-border);--button-focus-border: var(--palette-dark-action-button-primary-active-border)}:host-context([palette="bright"]){--button-background: var(--palette-bright-action-button-primary-default-background);--button-text: var(--palette-bright-action-button-primary-default-text);--button-text-decoration: var(--palette-bright-action-button-primary-default-text-decoration);--button-border-color: var(--palette-bright-action-button-primary-default-border);--button-hover-background: var(--palette-bright-action-button-primary-hover-background);--button-hover-text: var(--palette-bright-action-button-primary-hover-text);--button-hover-border: var(--palette-bright-action-button-primary-hover-border);--button-active-background: var(--palette-bright-action-button-primary-active-background);--button-active-text: var(--palette-bright-action-button-primary-active-text);--button-active-border: var(--palette-bright-action-button-primary-active-border);--button-focus-background: var(--palette-bright-action-button-primary-default-border);--button-focus-text: var(--palette-bright-action-button-primary-hover-border);--button-focus-border: var(--palette-bright-action-button-primary-active-border)}:host-context([palette="alt"]){--button-background: var(--palette-alt-action-button-primary-default-background);--button-text: var(--palette-alt-action-button-primary-default-text);--button-text-decoration: var(--palette-alt-action-button-primary-default-text-decoration);--button-border-color: var(--palette-alt-action-button-primary-default-border);--button-hover-background: var(--palette-alt-action-button-primary-hover-background);--button-hover-text: var(--palette-alt-action-button-primary-hover-text);--button-hover-border: var(--palette-alt-action-button-primary-hover-border);--button-active-background: var(--palette-alt-action-button-primary-active-background);--button-active-text: var(--palette-alt-action-button-primary-active-text);--button-active-border: var(--palette-alt-action-button-primary-active-border);--button-focus-background: var(--palette-alt-action-button-primary-default-border);--button-focus-text: var(--palette-alt-action-button-primary-hover-border);--button-focus-border: var(--palette-alt-action-button-primary-active-border)}:host-context([palette="bold"]){--button-background: var(--palette-bold-action-button-primary-default-background);--button-text: var(--palette-bold-action-button-primary-default-text);--button-text-decoration: var(--palette-bold-action-button-primary-default-text-decoration);--button-border-color: var(--palette-bold-action-button-primary-default-border);--button-hover-background: var(--palette-bold-action-button-primary-hover-background);--button-hover-text: var(--palette-bold-action-button-primary-hover-text);--button-hover-border: var(--palette-bold-action-button-primary-hover-border);--button-active-background: var(--palette-bold-action-button-primary-active-background);--button-active-text: var(--palette-alt-action-button-primary-active-text);--button-active-border: var(--palette-alt-action-button-primary-active-border);--button-focus-background: var(--palette-alt-action-button-primary-default-border);--button-focus-text: var(--palette-alt-action-button-primary-hover-border);--button-focus-border: var(--palette-alt-action-button-primary-active-border)}:host-context([palette="tint"]){--button-background: var(--palette-tint-action-button-primary-default-background);--button-text: var(--palette-tint-action-button-primary-default-text);--button-text-decoration: var(--palette-tint-action-button-primary-default-text-decoration);--button-border-color: var(--palette-tint-action-button-primary-default-border);--button-hover-background: var(--palette-tint-action-button-primary-hover-background);--button-hover-text: var(--palette-tint-action-button-primary-hover-text);--button-hover-border: var(--palette-tint-action-button-primary-hover-border);--button-active-background: var(--palette-tint-action-button-primary-active-background);--button-active-text: var(--palette-tint-action-button-primary-active-text);--button-active-border: var(--palette-tint-action-button-primary-active-border);--button-focus-background: var(--palette-tint-action-button-primary-default-border);--button-focus-text: var(--palette-tint-action-button-primary-hover-border);--button-focus-border: var(--palette-tint-action-button-primary-active-border)}@media (prefers-color-scheme: dark){[palette]{--button-background: var(--palette-dark-action-button-primary-default-background);--button-text: var(--palette-dark-action-button-primary-default-text);--button-text-decoration: var(--palette-dark-action-button-primary-default-text-decoration);--button-border-color: var(--palette-dark-action-button-primary-default-border);--button-hover-background: var(--palette-dark-action-button-primary-hover-background);--button-hover-text: var(--palette-dark-action-button-primary-hover-text);--button-hover-border: var(--palette-dark-action-button-primary-hover-border);--button-active-background: var(--palette-dark-action-button-primary-active-background);--button-active-text: var(--palette-dark-action-button-primary-active-text);--button-active-border: var(--palette-dark-action-button-primary-active-border);--button-focus-background: var(--palette-dark-action-button-primary-default-border);--button-focus-text: var(--palette-dark-action-button-primary-hover-border);--button-focus-border: var(--palette-dark-action-button-primary-active-border)}}';var Bt=Object.defineProperty,Vt=Object.getOwnPropertyDescriptor,v=(a,t,e,r)=>{for(var o=r>1?void 0:r?Vt(t,e):t,i=a.length-1,n;i>=0;i--)(n=a[i])&&(o=(r?n(t,e,o):n(o))||o);return r&&o&&Bt(t,e,o),o};console.log("Type of componentCSS:",typeof K);console.log("Value of componentCSS:",K);let b=class extends A{constructor(){super(),this.label="Button",this.variant="default",this.size="medium",this.disabled=!1,this.href="",this.target="_self",this.type="button",this.ariaLabel="",this.palette=""}render(){const a=g` <slot>${this.label}</slot> `;return this.href?g`
          <a
            part="button"
            ?disabled=${this.disabled}
            href=${this.href}
            target=${this.target}
            aria-label=${this.ariaLabel||""}
            palette=${this.palette||""}
            variant=${this.variant||""}>
            ${a}
          </a>
        `:g`
          <button
            part="button"
            ?disabled=${this.disabled}
            type=${this.type}
            aria-label=${this.ariaLabel||""}
            ?palette=${this.palette||void 0}
            variant=${this.variant||void 0}>
            ${a}
          </button>
        `}};b.styles=[j`
      ${ct(K)}
    `,j`
      button,
      a {
        all: unset; /* Resets all browser default styles */
        cursor: pointer;
        
        display: inline-flex; /* Ensures content respects padding/borders */
        justify-content: center;
        align-items: center;
        text-align: center; /* For text alignment */

        background-color: var(--button-background,#007bff); /* Fallback value */

        color: var(--button-text, white); /* Fallback value */
        border: 2px solid var(--button-border-color, #007bff); /* Fallback value */
        border-radius: var(--border-radius, 4px); /* Fallback value */
        padding: 0.5rem 1rem;
        text-decoration: var(--button-text-decoration, none);
        box-sizing: border-box; /* Include padding and border in the element's total width and height */
        font-family: inherit; /* Inherit font from parent */
        font-size: inherit; /* Inherit font size from parent */
        line-height: 1; /* Adjust line height for consistent button height */
        transition:
          background-color 0.2s ease-in-out,
          border-color 0.2s ease-in-out,
          color 0.2s ease-in-out; /* Smooth transitions */
      }

      button:hover,
      a:hover {
        text-decoration: var(--button-text-decoration-hover, underline);
      }

      button[disabled],
      a[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
        /* Optionally, override colors for disabled state */
        background-color: var(--button-disabled-background, #cccccc);
        color: var(--button-disabled-text, #666666);
        border-color: var(--button-disabled-border-color, #999999);
      }

      /* Styles for different sizes (medium, large) */
      :host([size="large"]) button,
      :host([size="large"]) a {
        padding: 0.75rem 1.5rem; /* Larger padding */
        font-size: 1.1rem; /* Larger font size */
      }

      /* Styles for different variants (default, bold, strong, dark, alt, tint) */
      /* These would typically be defined in qgds-button.css using custom properties */
      /* Example for a 'bold' variant: */
      :host([variant="bold"]) button,
      :host([variant="bold"]) a {
        font-weight: bold;
        /* Potentially different colors */
        /* background-color: var(--button-bold-background); */
        /* color: var(--button-bold-text); */
      }

      /* Styles for different palettes (primary, secondary, tertiary) */
      /* These would also typically be defined in qgds-button.css */
      /* Example for a 'primary' palette: */
      :host([palette="primary"]) button,
      :host([palette="primary"]) a {
        /* background-color: var(--palette-primary-background); */
        /* color: var(--palette-primary-text); */
      }
    `];v([p({type:String})],b.prototype,"label",2);v([p({type:String,reflect:!0})],b.prototype,"variant",2);v([p({type:String,reflect:!0})],b.prototype,"size",2);v([p({type:Boolean,reflect:!0})],b.prototype,"disabled",2);v([p({type:String})],b.prototype,"href",2);v([p({type:String})],b.prototype,"target",2);v([p({type:String})],b.prototype,"type",2);v([p({type:String,attribute:"aria-label"})],b.prototype,"ariaLabel",2);v([p({type:String,reflect:!0})],b.prototype,"palette",2);b=v([J("qgds-button")],b);
//# sourceMappingURL=qgds-web-components.js.map
