import { useColorScheme } from "../../hooks/useColorScheme";
export default function ColorSchemeToggle(){
  const {scheme,toggle} = useColorScheme();
  return (
    <button onClick={toggle} className="ml-2 p-2 rounded-full border">
      {scheme==='dark' ? '🌙' : '☀️'}
    </button>
  );
}
