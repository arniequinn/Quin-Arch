import{a as M,O as r,f as l}from"./index-CftU8RJQ.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],g=M("earth",F);/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],_=M("trending-down",R);function x(t){return l[t]??l.us}function v(t,e){const n=Math.max(1,t||0),i=x(e),o=Math.round(n*r.consultantHourly),a=Math.round(n*i.consultantHourly),s=Math.max(0,a-o),u=a>0?Math.round(s/a*100):0;return{offeredFee:o,marketFee:a,savingsAmount:s,savingsPercentage:u}}const k={interior:1200,exterior:2500};function A(t,e){const n=k[e];return t<=n?t:n*Math.sqrt(t/n)}function y(t,e,n){const i=Math.max(50,t||0),o=A(i,e),a=x(n),s=e==="exterior"?r.exteriorRenderPerSqFt:r.interiorRenderPerSqFt,u=e==="exterior"?a.exteriorRenderPerSqFt:a.interiorRenderPerSqFt,d=e==="exterior"?r.minExteriorRenderFee:r.minInteriorRenderFee,h=Math.max(d,Math.round(o*s)),c=Math.max(d,Math.round(o*u)),m=Math.max(0,c-h),f=c>0?Math.round(m/c*100):0;return{offeredFee:h,marketFee:c,savingsAmount:m,savingsPercentage:f}}export{g as E,_ as T,y as a,v as c};
