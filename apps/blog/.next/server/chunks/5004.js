"use strict";exports.id=5004,exports.ids=[5004],exports.modules={20759:(t,e,n)=>{/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u=n(78726),o="function"==typeof Object.is?Object.is:function(t,e){return t===e&&(0!==t||1/t==1/e)||t!=t&&e!=e},i=u.useState,s=u.useEffect,c=u.useLayoutEffect,a=u.useDebugValue;function r(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!o(t,n)}catch(t){return!0}}var f="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(t,e){return e()}:function(t,e){var n=e(),u=i({inst:{value:n,getSnapshot:e}}),o=u[0].inst,f=u[1];return c(function(){o.value=n,o.getSnapshot=e,r(o)&&f({inst:o})},[t,n,e]),s(function(){return r(o)&&f({inst:o}),t(function(){r(o)&&f({inst:o})})},[t]),a(n),n};e.useSyncExternalStore=void 0!==u.useSyncExternalStore?u.useSyncExternalStore:f},85004:(t,e,n)=>{t.exports=n(20759)}};