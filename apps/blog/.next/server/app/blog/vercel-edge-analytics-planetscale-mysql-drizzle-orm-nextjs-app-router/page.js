(()=>{var e={};e.id=5346,e.ids=[5346],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},57147:e=>{"use strict";e.exports=require("fs")},95687:e=>{"use strict";e.exports=require("https")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},57310:e=>{"use strict";e.exports=require("url")},37280:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalError:()=>o.a,__next_app__:()=>p,originalPathname:()=>h,pages:()=>d,routeModule:()=>u,tree:()=>c});var s=n(66965),a=n(74902),i=n(36408),o=n.n(i),r=n(14346),l={};for(let e in r)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>r[e]);n.d(t,l);let c=["",{children:["blog",{children:["vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(n.bind(n,78134)),"/home/shovonh/workspaces/anveio/apps/blog/src/app/blog/vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(n.bind(n,36291)),"/home/shovonh/workspaces/anveio/apps/blog/src/app/blog/layout.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(n.bind(n,154))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(n.bind(n,6349)),"/home/shovonh/workspaces/anveio/apps/blog/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(n.t.bind(n,35438,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(n.bind(n,154))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/home/shovonh/workspaces/anveio/apps/blog/src/app/blog/vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router/page.tsx"],h="/blog/vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router/page",p={require:n,loadChunk:()=>Promise.resolve()},u=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/blog/vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router/page",pathname:"/blog/vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},26204:(e,t,n)=>{Promise.resolve().then(n.bind(n,81754)),Promise.resolve().then(n.bind(n,5439)),Promise.resolve().then(n.t.bind(n,49949,23)),Promise.resolve().then(n.t.bind(n,97745,23))},81754:(e,t,n)=>{"use strict";n.r(t),n.d(t,{CopyCodeButton:()=>CopyCodeButton});var s=n(84196),a=n(54446);let CopyCodeButton=e=>{let{toast:t}=(0,a.pm)();return(0,s.jsxs)("div",{children:[s.jsx("label",{className:"hidden",children:"Copy Code"}),s.jsx("button",{"aria-labelledby":"copy-code-button",onClick:async()=>{try{await copyToClipboard(e.text),t({title:`Copied ${e.filename}`})}catch(e){t({variant:"destructive",title:"Error copying code.",description:"Try manually copying instead. This is usually a permissions issue."})}},"aria-label":"Copy code",className:"h-8 w-8 rounded-sm border-none text-zinc border-zinc-700 cursor-pointer p-0 flex items-center justify-center bg-inherit relative hover:bg-zinc-900 hover:text-zinc-200",children:s.jsx("svg",{className:"absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4","data-testid":"geist-icon",fill:"none",height:"24",shapeRendering:"geometricPrecision",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"1.5",viewBox:"0 0 24 24",width:"24","aria-hidden":"true",style:{color:"currentcolor",width:20,height:20},children:s.jsx("path",{d:"M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z"})})})]})},copyToClipboard=async e=>{try{await navigator.clipboard.writeText(e),console.log("Text successfully copied")}catch(e){console.error("Failed to copy text: ",e)}}},78134:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>VercelAnalyticsBlogPost,metadata:()=>v});var s=n(25620),a=n(77703);n(79521);var i=n(64074);let o=(0,i.createProxy)(String.raw`/home/shovonh/workspaces/anveio/apps/blog/src/components/custom/Codeblock/CopyCodeButton.tsx`),{__esModule:r,$$typeof:l}=o;o.default;let c=o.CopyCodeButton;var d=n(23426);d.Code.theme="dark-plus";let SyntaxHighlightedText=e=>s.jsx(d.Code,{lineNumbers:"shell"!==e.language,lang:e.language,style:{marginTop:0,marginBottom:0},children:e.text}),Codeblock=e=>(0,s.jsxs)("div",{className:(0,a.cn)("wrapper mx-4 rounded-md overflow-hidden border-[1px] border-solid border-zinc-700"),children:[(0,s.jsxs)("div",{className:"header py-0 px-4 rounded-t-md rounded-b-none border-b-[1px] border-solid border-zinc-700 h-12 items-center flex bg-black ",children:[(0,s.jsxs)("div",{className:"filename text-zinc-400 border-zinc-700 flex gap-2 text-sm min-w-min mr-auto my-0 ml-0",children:[s.jsx("div",{"aria-hidden":"true",className:"file-icon-container w-4 items-center flex flex-shrink-0",children:h[function(e){let t=e.lastIndexOf(".");if(-1===t||0===t||t===e.length-1)throw Error("No parseable file extension");return e.substring(t+1)}(e.filename)??"jsx"]||null}),s.jsx("span",{className:"filename-label inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-full min-w-0",children:e.filename})]}),s.jsx("div",{className:"code-block-actions flex gap-1",children:s.jsx(c,{...e})})]}),s.jsx("div",{className:" bg-zinc-900 overflow-x-auto",children:s.jsx(SyntaxHighlightedText,{text:e.text,language:e.language})})]}),h={sh:(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,children:[s.jsx("title",{children:"file_type_shell"}),s.jsx("path",{d:"M29.4,27.6H2.5V4.5H29.4Zm-25.9-1H28.4V5.5H3.5Z",style:{fill:"#d9b400"}}),s.jsx("polygon",{points:"6.077 19.316 5.522 18.484 10.366 15.255 5.479 11.184 6.12 10.416 12.035 15.344 6.077 19.316",style:{fill:"#d9b400"}}),s.jsx("rect",{x:"12.7",y:"18.2",width:"7.8",height:"1",style:{fill:"#d9b400"}}),s.jsx("rect",{x:"2.5",y:"5.5",width:"26.9",height:"1.9",style:{fill:"#d9b400"}})]}),jsx:(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,children:[s.jsx("title",{children:"file_type_reactjs"}),s.jsx("circle",{cx:"16",cy:"15.974",r:"2.5",style:{fill:"#00d8ff"}}),s.jsx("path",{d:"M16,21.706a28.385,28.385,0,0,1-8.88-1.2,11.3,11.3,0,0,1-3.657-1.958A3.543,3.543,0,0,1,2,15.974c0-1.653,1.816-3.273,4.858-4.333A28.755,28.755,0,0,1,16,10.293a28.674,28.674,0,0,1,9.022,1.324,11.376,11.376,0,0,1,3.538,1.866A3.391,3.391,0,0,1,30,15.974c0,1.718-2.03,3.459-5.3,4.541A28.8,28.8,0,0,1,16,21.706Zm0-10.217a27.948,27.948,0,0,0-8.749,1.282c-2.8.977-4.055,2.313-4.055,3.2,0,.928,1.349,2.387,4.311,3.4A27.21,27.21,0,0,0,16,20.51a27.6,27.6,0,0,0,8.325-1.13C27.4,18.361,28.8,16.9,28.8,15.974a2.327,2.327,0,0,0-1.01-1.573,10.194,10.194,0,0,0-3.161-1.654A27.462,27.462,0,0,0,16,11.489Z",style:{fill:"#00d8ff"}}),s.jsx("path",{d:"M10.32,28.443a2.639,2.639,0,0,1-1.336-.328c-1.432-.826-1.928-3.208-1.327-6.373a28.755,28.755,0,0,1,3.4-8.593h0A28.676,28.676,0,0,1,16.71,5.995a11.376,11.376,0,0,1,3.384-2.133,3.391,3.391,0,0,1,2.878,0c1.489.858,1.982,3.486,1.287,6.859a28.806,28.806,0,0,1-3.316,8.133,28.385,28.385,0,0,1-5.476,7.093,11.3,11.3,0,0,1-3.523,2.189A4.926,4.926,0,0,1,10.32,28.443Zm1.773-14.7a27.948,27.948,0,0,0-3.26,8.219c-.553,2.915-.022,4.668.75,5.114.8.463,2.742.024,5.1-2.036a27.209,27.209,0,0,0,5.227-6.79,27.6,27.6,0,0,0,3.181-7.776c.654-3.175.089-5.119-.713-5.581a2.327,2.327,0,0,0-1.868.089A10.194,10.194,0,0,0,17.5,6.9a27.464,27.464,0,0,0-5.4,6.849Z",style:{fill:"#00d8ff"}}),s.jsx("path",{d:"M21.677,28.456c-1.355,0-3.076-.82-4.868-2.361a28.756,28.756,0,0,1-5.747-7.237h0a28.676,28.676,0,0,1-3.374-8.471,11.376,11.376,0,0,1-.158-4A3.391,3.391,0,0,1,8.964,3.9c1.487-.861,4.01.024,6.585,2.31a28.8,28.8,0,0,1,5.39,6.934,28.384,28.384,0,0,1,3.41,8.287,11.3,11.3,0,0,1,.137,4.146,3.543,3.543,0,0,1-1.494,2.555A2.59,2.59,0,0,1,21.677,28.456Zm-9.58-10.2a27.949,27.949,0,0,0,5.492,6.929c2.249,1.935,4.033,2.351,4.8,1.9.8-.465,1.39-2.363.782-5.434A27.212,27.212,0,0,0,19.9,13.74,27.6,27.6,0,0,0,14.755,7.1c-2.424-2.152-4.39-2.633-5.191-2.169a2.327,2.327,0,0,0-.855,1.662,10.194,10.194,0,0,0,.153,3.565,27.465,27.465,0,0,0,3.236,8.1Z",style:{fill:"#00d8ff"}})]}),ts:(0,s.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 32 32",width:16,height:16,children:[s.jsx("title",{children:"file_type_typescript"}),s.jsx("path",{d:"M23.827,8.243A4.424,4.424,0,0,1,26.05,9.524a5.853,5.853,0,0,1,.852,1.143c.011.045-1.534,1.083-2.471,1.662-.034.023-.169-.124-.322-.35a2.014,2.014,0,0,0-1.67-1c-1.077-.074-1.771.49-1.766,1.433a1.3,1.3,0,0,0,.153.666c.237.49.677.784,2.059,1.383,2.544,1.095,3.636,1.817,4.31,2.843a5.158,5.158,0,0,1,.416,4.333,4.764,4.764,0,0,1-3.932,2.815,10.9,10.9,0,0,1-2.708-.028,6.531,6.531,0,0,1-3.616-1.884,6.278,6.278,0,0,1-.926-1.371,2.655,2.655,0,0,1,.327-.208c.158-.09.756-.434,1.32-.761L19.1,19.6l.214.312a4.771,4.771,0,0,0,1.35,1.292,3.3,3.3,0,0,0,3.458-.175,1.545,1.545,0,0,0,.2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8,8.8,0,0,1-3.349-2.055,4.687,4.687,0,0,1-.976-1.777,7.116,7.116,0,0,1-.062-2.268,4.332,4.332,0,0,1,3.644-3.374A9,9,0,0,1,23.827,8.243ZM15.484,9.726l.011,1.454h-4.63V24.328H7.6V11.183H2.97V9.755A13.986,13.986,0,0,1,3.01,8.289c.017-.023,2.832-.034,6.245-.028l6.211.017Z",style:{fill:"#007acc"}})]})};var p=n(46340),u=n(29787),m=n(35558),g=n(29106),x=n.n(g);let v={title:m.E["vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router"].title,description:"Step by step tutorial on how to implement production ready analytics for large scale applications for free using Vercel, Vercel's Edge Runtime, Planetscale, TypeScript, Next.js App Router, Drizzle ORM, React, and TypeScript"};function VercelAnalyticsBlogPost(){return(0,s.jsxs)("article",{className:"",children:[(0,s.jsxs)("div",{className:"space-y-3",children:[(0,s.jsxs)("p",{className:"italic text-center",children:["Published"," ",(0,m.N)(m.E["vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router"].publishedAt)]}),s.jsx("h1",{className:"text-center text-2xl font-semibold",children:m.E["vercel-edge-analytics-planetscale-mysql-drizzle-orm-nextjs-app-router"].title}),s.jsx(x(),{alt:"Planetscale UI showing some analytics events",src:"/blog-assets/vercel-edge-analytics/table.webp",width:896,height:274,priority:!0}),s.jsx("p",{className:"italic text-center",children:"A glimpse of the analytics table we'll be building"})]}),(0,s.jsxs)("div",{className:"py-12 space-y-12",children:[(0,s.jsxs)("section",{className:"space-y-6",children:[(0,s.jsxs)("p",{children:["Vercel Analytics'"," ",s.jsx(p.m,{href:"https://vercel.com/docs/analytics/limits-and-pricing",children:"free tier"})," ","gives you 2,500 events a month, which isn't a lot. Its most efficient tier costs $20 per 500k events before you have to pick the phone and call for a better price. But you can set up an endpoint hosted on Vercel using the new"," ",s.jsx(p.m,{href:"https://nextjs.org/docs/pages/api-reference/edge",children:"Edge Runtime"})," ","to get"," ",s.jsx(p.m,{href:"https://vercel.com/docs/functions/edge-functions/usage-and-pricing",children:"half-a-million invocations per-month"})," ","for free and use that endpoint to write up to"," ",s.jsx(p.m,{href:"https://planetscale.com/pricing",children:"10 million free analytics events per-month"})," ","using Planetscale (I'm not affiliated in any way). The next 40 million events will cost you $29."]}),(0,s.jsxs)("p",{children:["You can of course use any database you like but Planetscale is the cheapest managed solution. We're also going to be using Drizzle ORM in this tutorial because it makes the code simpler, safer, compiles down to regular SQL and if you want to bring your own database all you' have to do is ",s.jsx("span",{className:"italic",children:"delete"})," a line of code. We'll also be using Vercel KV to do rate limiting."]}),s.jsx("p",{children:"The geolocation data Vercel provides is impressively precise, accurate to within 50 feet in some cases. I had to fake the geolocation data for this tutorial to avoid giving out the exact building I live in. Quite scary!"})]}),(0,s.jsxs)("section",{className:"space-y-6",children:[s.jsx("h2",{className:"text-xl font-bold",children:"Just give me the code"}),(0,s.jsxs)("p",{children:["Here's the code for a"," ",s.jsx(p.m,{href:"https://nextjs.org/docs/app/building-your-application/routing/route-handlers",children:"Next.js Route Handler"})," ","that will read the IP addres and geolocation of a request and save it to a database. It handles rate limiting IP's per unique event type using a 5 second sliding window and validating the request body against a list of known events."]}),s.jsx(Codeblock,{filename:"src/app/api/record-events/route.ts",language:"typescript",text:j}),(0,s.jsxs)("p",{children:["if you use this code in your project don't forget to modify your next.config.js to protect this route with CORS so it doesn't get spammed from non-visitors. You also have the option to wall off recording events to authenticated-users-only by reading, e.g. a session token from the request using the cookie function exported from ",s.jsx("pre",{className:"inline",children:"next/server"})," and mapping the session token to a user. The route handler above does not do that and treats events as anonymous."]}),s.jsx("p",{children:"If you want to know more about how to set up the full tech stack used in that example, including Drizzle ORM and Planetscale to get 10 million free events a month, read on."}),s.jsx("p",{children:"If you're adding analytics to a project using this exact tech stack already I expect it'll take just a few minutes to get this set up. If you're starting a project fresh, this entire tutorial will likely take just 30 minutes."})]}),(0,s.jsxs)("section",{className:"space-y-6",children:[s.jsx("h2",{className:"text-xl font-bold",children:"The high-level components"}),(0,s.jsxs)("ol",{className:"list-decimal",children:[s.jsx("li",{className:"list-item",children:"A table for our analytics events"}),s.jsx("li",{children:"An edge function deployed on Vercel that collects the user's IP and Geolocation data and writes the data to the table"}),s.jsx("li",{children:"A lil' frontend app that pings this edge function from the user's browser."})]}),s.jsx("p",{className:"py-3",children:"Each of these components can be deployed independently but the example code will use a single Next.js app using the new App Directory to manage the database, the API, and the frontend."}),s.jsx("p",{className:"py-3",children:"To get this production ready wee'll also need to rate limit events per user and per event type and batch events on the client so that we minimize the total number of edge function invocations."})]}),(0,s.jsxs)("section",{className:"space-y-6",children:[s.jsx("h2",{className:"text-xl font-bold",children:"1. Install bun"}),s.jsx("p",{children:"If you'd rather use npm or yarn you can skip this. Vercel supports Bun now so may as well to speed up deployments and local development. You can use it alongside npm when Bun has some gap in feature parity."}),(0,s.jsxs)("p",{children:["Follow the instructions at"," ",s.jsx(p.m,{href:"https://bun.sh/docs/installation",children:"https://bun.sh/docs/installation"})," ","to install it."]}),s.jsx("p",{children:"It also helps to have the Vercel CLI to manage environment variables automatically, and you can install it with"}),s.jsx(Codeblock,{language:"shell",filename:"install-vercel-cli.sh",text:"bun install --global vercel"}),s.jsx("p",{children:"But you can choose to copy paste environment variables manually if you prefer."})]}),(0,s.jsxs)("section",{className:"space-y-6",children:[s.jsx("h2",{className:"text-xl font-bold",children:"2. Create the Next.js app"}),(0,s.jsxs)("p",{className:"py-3",children:["Run the below command from your command line to create a Next.js app using the App Router, Bun, and the"," "]}),s.jsx("div",{className:"py-6",children:s.jsx(Codeblock,{language:"shell",filename:"create-next-app.sh",text:"bunx create-next-app@latest --ts --app --src-dir --use-bun"})}),(0,s.jsxs)("div",{className:"space-y-3",children:[s.jsx("p",{children:"Now let's install the dependencies we'll need for the first iteration of our analytics."}),s.jsx("p",{children:"@vercel/edge includes the utilities to pull the ip and geolocation from requests."}),s.jsx("p",{children:"drizzle-kit wil let us perform migrations and push migrations to the connected database"}),s.jsx("p",{children:"drizzle-orm will allow us to write typesafe queries and take some boilerpalte out of the picture. It compiles down to SQL so there's no runtime cost to using it."}),s.jsx("p",{children:"Zod will allow us to get some type safety on the server and discard invalid requests."}),s.jsx("p",{children:"@planetscale/database exports a function that allows drizzle to create a connection to the Planetscale database, it's a set and forget config thing."})]}),s.jsx("div",{className:"py-6",children:s.jsx(Codeblock,{language:"shell",filename:"install-initial-dependencies.sh",text:"bun i @vercel/edge drizzle-kit drizzle-orm zod @planetscale/database"})})]}),(0,s.jsxs)("section",{className:"space-y-6",children:[s.jsx("h2",{className:"text-xl font-semibold",children:"3. Set up the DB"}),s.jsx("p",{children:"Ok this section is a lot of boring hooking stuff up and copying around credentials but the good thing is you only have to do it once. Managing environment variables is the most tedious part of programming."}),(0,s.jsxs)("p",{children:["To get started create an account on"," ",s.jsx(p.m,{href:"https://auth.planetscale.com/sign-in",children:"Planetscale"})," ",'and create a table with a branch name of "dev". We\'ll connect to the dev branch for local development and the main branch for production.']}),s.jsx("div",{className:"flex justify-center",children:s.jsx(x(),{src:"/blog-assets/vercel-edge-analytics/planetscale-dev-branch.webp",alt:"Planetscale UI: Branch name = dev, base branch = main, region = us-east-2 (Ohio)",width:400,height:313})}),s.jsx("p",{children:'Then, from the overview tab, click connect on the top right and then "new password" on the top right of the modal that pops up. This will give you a connection string that includes the username, password, branch, and URL of the database. It\'s the only credential we need to connect to the DB from our app. Do this once for the "main" branch and once for the "dev" branch and make sure to copy the DATABASE_URL string for both as you won\'t be able to see it after creation. Next step is to copy these into Vercel'}),s.jsx("div",{className:"flex justify-center",children:s.jsx(x(),{src:"/blog-assets/vercel-edge-analytics/planetscale-password.webp",alt:"Planetscale UI: Connect button",width:800,height:647})}),s.jsx("p",{children:'(Skipping past setting up a project in Vercel, using git, and pushing to Github...) Navigate to the Environment Variables section in your Vercel project\'s settings, Uncheck "Preview" and "Development" and paste in the `DATABASE_URL="..."`environment variable using the credentials for the "main" branch of your Planetscale Database into the text fields and hit save. Do the same for the "dev" branch but uncheck "Production" and "Preview" before hitting save.'}),s.jsx("p",{children:"Now from a terminal somewhere in your project run the following commands to pull in the development environment variables into your local filesystem."}),s.jsx(Codeblock,{language:"shell",filename:"link-vercel-and-pull.sh",text:`vercel link
vercel env pull`}),s.jsx("p",{children:"Next, we'll start writing some code. First make files we'll put our core DB code in."}),s.jsx(Codeblock,{language:"shell",filename:"create-db-folder.sh",text:y}),s.jsx("p",{children:"In src/lib/db/db.ts we'll put the core code to initialize our DB and export the db connection to the rest of the codebase."}),s.jsx(Codeblock,{language:"tsx",filename:"src/lib/db/db.ts",text:b}),s.jsx("p",{children:"In the above codeblock we make sure we have DATABASE_URL set, and ensure it throws at build time if it's not. We also set up logging while in development mode but you can disable that entirely or even enable it in production. We export default a config that's read by Drizzle Kit so that it knows where to find our schemas to generate migrations and push DB changes."}),s.jsx("p",{children:"Next, let's set up the schema for our analytics table:"}),s.jsx(Codeblock,{language:"tsx",filename:"src/lib/@/lib/db/schemas.ts",text:w}),s.jsx("p",{children:'To be honest, I haven\'t found "flagEmoji" to be a particularly useful column as it seems redundant with the country column, but I include it for exhaustiveness. Feel free to remove it for your project.'}),s.jsx("p",{children:'The API for our analytics event is that events have an "event_type" and "metadata". We can enforce the presence or lack of metadata for some events as the API layer and get some type-safety at build time with TypeScript.'}),s.jsx("p",{children:"Feel free to play around with the character lengths of these columns. I'm using 50 for the event_type column as I plan to stuff as much information into a structured event_type string as possible, but if you prefer a different approach you can get away with a smaller character allocation."})]})]}),s.jsx(u.Ys,{event:f})]})}let f={eventType:"view:blog:vercel_edge_analytics"},y=`mkdir -p src/lib/db
touch src/lib/db/db.ts src/lib/@/lib/db/schema.ts
`,b=`import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Config } from "drizzle-kit";

import { z } from "zod";

export const DATABASE_URL = z
  .string({
    required_error: "DATABASE_URL missing",
  })
  .parse(process.env.DATABASE_URL);

const connection = connect({
  url: DATABASE_URL,
});

export const db = drizzle(
  connection,
  process.env.NODE_ENV === "development"
    ? {
        logger: {
          logQuery: console.log,
        },
      }
    : undefined
);

export default {
  schema: "./src/lib/@/lib/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
  out: "./src/lib/db/__generated__/migrations",
} satisfies Config;`,w=`
export const events = mysqlTable("blog_events", {
  /**
   * autoincrement() is a helper function that adds the \`AUTO_INCREMENT\` keyword
   */
  id: serial("id").primaryKey().autoincrement(),
  event_type: varchar("event_type", { length: 50 }).notNull(),
  /**
   * Start of properties provided by Vercel's Edge Runtime on the request object
   */
  ipAddress: varchar("ip_address", { length: 39 }),
  city: varchar("city", { length: 30 }),
  country: varchar("country", { length: 30 }),
  flagEmoji: varchar("flag", { length: 4 }),
  region: varchar("region", { length: 30 }),
  countryRegion: varchar("country_region", { length: 30 }),
  latitude: varchar("latitude", { length: 30 }),
  longitude: varchar("longitude", { length: 30 }),
  browser_name: varchar("browser_name", { length: 50 }),
  browser_version: varchar("browser_version", { length: 30 }),
  rendering_engine_name: varchar("rendering_engine_name", { length: 30 }),
  device_type: varchar("device_type", { length: 15 }),
  device_vendor: varchar("device_vendor", { length: 50 }),
  device_model: varchar("device_model", { length: 50 }),
  /**
   * End of the properties provided by Vercel's Edge Runtime
   */
  /**
   * There could be weeks between the event happening and it hitting our analytics
   * endpoint and subsequently being written into our database, so the auto-generated
   * created_at timestamp is not sufficient for our needs. We need the client to tell
   * us when the event happened.
   */
  client_recorded_at: timestamp("client_recorded_at").notNull(),
  metadata: json("metadata"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
`,j=`import { NextRequest, userAgentFromString } from "next/server";
import { geolocation, ipAddress } from "@vercel/edge";
import { db } from "@/lib/db/db";
import { events } from "@/lib/db/schema";
import { z } from "zod";

import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

export const runtime = "edge";

/**
 * Set up the expected request JSON schema
 */
const requestBodySchema = z.array(
  z.object({
    eventType: z.enum(
      [
        "view:home",
        "view:blog:vercel_edge_analytics",
        "click:vercel_edge_analytics",
      ],
      {
        invalid_type_error: "Invalid event type",
        required_error: "Event type not provided",
      }
    ),
    clientRecordedAtUtcMillis: z.number(),
    metadata: z.record(z.any()).optional(),
  })
);

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(1, "5 s"),
});

export const POST = async (request: NextRequest) => {
  if (process.env.NODE_ENV === "development") {
    return new Response(undefined, { status: 200 });
  }

  /**
   * Pull the user agent out from the request headers
   */
  const userAgent = request.headers.get("user-agent");

  /**
   * Parse the request JSON
   */
  const json = await request.json();

  const parseResult = requestBodySchema.safeParse(json);

  if (!parseResult.success) {
    /**
     * Return a 200 because the client doesn't necessarily need to know this failed
     * but make sure we log it for our own purposes.
     */
    console.error(\`Failed to record event\`, parseResult.error);
    return new Response(undefined, { status: 200 });
  }

  const ua = userAgentFromString(userAgent || undefined);
  const geo = geolocation(request);
  const ip = ipAddress(request);

  /**
   * We're making this a batch API so that callers can minimize the amount of
   * times they need to call this and we save ourselves some bandwidth.
   */
  const eventsUnderRateLimit = await Promise.all(
    parseResult.data.filter(async (event) => {
      const redisResponse = ratelimit.limit(\`\${ip}-\${event.eventType}}\`);

      /**
       * Ensure that emitting none of these events exceeds the rate limit
       */
      if (!(await redisResponse).success) {
        console.error(
          \`Rate limit exceeded for \${ipAddress} for eventL \${event.eventType}. Ignoring\`
        );
        return true;
      } else {
        return false;
      }
    })
  );

  if (eventsUnderRateLimit.length === 0) {
    console.warn(\`Rate limit exceeded for all events. Ignoring\`);
    return new Response(undefined, { status: 200 });
  } else {
    console.log(\`Logging \${eventsUnderRateLimit.length} events\`);
  }

  await db.transaction(async (tx) => {
    for (let event of eventsUnderRateLimit) {
      /**
       * We can't do concurrent writes so do these writes serially.
       */
      await tx
        .insert(events)
        .values({
          event_type: event.eventType,
          ipAddress: ip,
          city: geo && geo.city ? decodeURIComponent(geo.city) : undefined,
          country: geo?.country,
          latitude: geo?.latitude,
          longitude: geo?.longitude,
          region: geo?.region,
          countryRegion: geo?.countryRegion,
          flagEmoji: geo?.flag,
          browser_version: ua.browser.version,
          browser_name: ua.browser.name,
          rendering_engine_name: ua.engine.name,
          device_type: ua.device.type,
          device_vendor: ua.device.vendor,
          device_model: ua.device.model,
          metadata: event.metadata,
          client_recorded_at: new Date(event.clientRecordedAtUtcMillis),
        })
        .execute();
    }
  });

  return new Response(undefined, { status: 200 });
};`},46340:(e,t,n)=>{"use strict";n.d(t,{m:()=>Blink});var s=n(25620),a=n(77703),i=n(45624),o=n.n(i);let Blink=e=>s.jsx(o(),{...e,className:(0,a.cn)(e.className,"text-underline dark:text-blue-400"),target:"_blank",rel:"noreferrer",children:e.children})}};var t=require("../../../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),n=t.X(0,[7534,3369,3077,3867,962,2828,7211,6819,7745,9289,9654,5773,1056,9351,8067],()=>__webpack_exec__(37280));module.exports=n})();