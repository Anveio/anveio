"use strict";exports.id=7028,exports.ids=[7028],exports.modules={51619:(e,r,u)=>{/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n=u(78726),t=u(85004),i="function"==typeof Object.is?Object.is:function(e,r){return e===r&&(0!==e||1/e==1/r)||e!=e&&r!=r},l=t.useSyncExternalStore,o=n.useRef,s=n.useEffect,c=n.useMemo,f=n.useDebugValue;r.useSyncExternalStoreWithSelector=function(e,r,u,n,t){var v=o(null);if(null===v.current){var d={hasValue:!1,value:null};v.current=d}else d=v.current;var x=l(e,(v=c(function(){function a(r){if(!o){if(o=!0,e=r,r=n(r),void 0!==t&&d.hasValue){var u=d.value;if(t(u,r))return l=u}return l=r}if(u=l,i(e,r))return u;var s=n(r);return void 0!==t&&t(u,s)?u:(e=r,l=s)}var e,l,o=!1,s=void 0===u?null:u;return[function(){return a(r())},null===s?void 0:function(){return a(s())}]},[r,u,n,t]))[0],v[1]);return s(function(){d.hasValue=!0,d.value=x},[x]),f(x),x}},57028:(e,r,u)=>{e.exports=u(51619)}};