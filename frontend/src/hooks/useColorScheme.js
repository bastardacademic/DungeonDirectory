import { useEffect, useState } from "react";
export function useColorScheme(){
  const [scheme,setScheme] = useState(()=>
    localStorage.getItem('dd-color-scheme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light')
  );
  useEffect(()=>{
    const root = document.documentElement;
    root.classList.toggle('dark', scheme==='dark');
    localStorage.setItem('dd-color-scheme',scheme);
  },[scheme]);
  return {scheme, toggle:()=>setScheme(scheme==='dark'?'light':'dark')};
}
