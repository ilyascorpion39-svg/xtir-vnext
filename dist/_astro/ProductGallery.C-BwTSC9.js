import{j as e}from"./jsx-runtime.ClP7wGfN.js";import{r as d}from"./index.DK-fsZOb.js";function x(s,c,a){return Math.max(c,Math.min(a,s))}function k({images:s,alt:c,accent:a="#00ff41"}){const b=d.useRef(null),[l,m]=d.useState(0),u=d.useMemo(()=>{const n=Array.isArray(s)?s.filter(Boolean):[];return Array.from(new Set(n))},[s]),r=u.length,i=n=>{const t=b.current;if(!t)return;const o=x(n,0,Math.max(0,r-1)),h=t.clientWidth;t.scrollTo({left:o*h,behavior:"smooth"})},f=()=>i(l-1),p=()=>i(l+1);return d.useEffect(()=>{const n=b.current;if(!n)return;const t=()=>{const h=n.clientWidth||1,v=Math.round(n.scrollLeft/h);m(x(v,0,Math.max(0,r-1)))},o=()=>{i(l),t()};return n.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",o),t(),()=>{n.removeEventListener("scroll",t),window.removeEventListener("resize",o)}},[r]),r===0?null:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{ref:b,className:`
            flex
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            rounded-2xl
            bg-dark-900/40
            border
            border-white/10
            glass
            
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          `,style:{boxShadow:"0 0 0 1px rgba(255,255,255,0.06), 0 18px 60px rgba(0,0,0,0.45)"},"aria-label":"Галерея фотографий",children:u.map((n,t)=>e.jsxs("div",{className:"relative shrink-0 w-full snap-center",style:{aspectRatio:"16 / 9"},children:[e.jsx("img",{src:n,alt:`${c} — фото ${t+1}`,loading:t===0?"eager":"lazy",className:"absolute inset-0 w-full h-full object-cover"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"})]},`${n}-${t}`))}),r>1&&e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:f,disabled:l===0,className:`
                absolute left-3 top-1/2 -translate-y-1/2
                w-11 h-11 rounded-full
                bg-black/45 backdrop-blur-md
                border border-white/10
                flex items-center justify-center
                text-white/90
                hover:bg-black/55
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              `,"aria-label":"Предыдущее фото",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M15 18l-6-6 6-6"})})}),e.jsx("button",{type:"button",onClick:p,disabled:l===r-1,className:`
                absolute right-3 top-1/2 -translate-y-1/2
                w-11 h-11 rounded-full
                bg-black/45 backdrop-blur-md
                border border-white/10
                flex items-center justify-center
                text-white/90
                hover:bg-black/55
                disabled:opacity-40 disabled:cursor-not-allowed
                transition
              `,"aria-label":"Следующее фото",children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M9 18l6-6-6-6"})})}),e.jsxs("div",{className:"absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/10 text-xs text-white/90",children:[l+1," / ",r]})]})]}),r>1&&e.jsx("div",{className:"flex items-center gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",children:u.map((n,t)=>{const o=t===l;return e.jsxs("button",{type:"button",onClick:()=>i(t),className:`
                  relative
                  shrink-0
                  w-20 h-14
                  rounded-xl
                  overflow-hidden
                  border
                  transition
                  hover:opacity-95
                `,style:{borderColor:o?a:"rgba(255,255,255,0.12)",boxShadow:o?`0 0 0 1px ${a}, 0 10px 30px rgba(0,0,0,0.35)`:void 0},"aria-label":`Открыть фото ${t+1}`,children:[e.jsx("img",{src:n,alt:"",className:"w-full h-full object-cover",loading:"lazy"}),o&&e.jsx("div",{className:"absolute inset-0 bg-black/10"})]},`thumb-${n}-${t}`)})})]})}export{k as default};
