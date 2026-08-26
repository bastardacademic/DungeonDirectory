import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import Input from "./components/ui/Input.jsx";
import ColorSchemeToggle from "./components/ui/ColorSchemeToggle.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Dungeon Directory</h1>
        <ColorSchemeToggle />
      </div>
      <Card>
        <Input placeholder="Search listings..." />
        <div className="mt-4 flex gap-2">
          <Button variant="primary">Search</Button>
          <Button variant="ghost">Clear</Button>
        </div>
      </Card>
    </div>
  );
}
