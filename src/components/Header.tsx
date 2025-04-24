import { useThemeStore } from "../store/themeStore";

function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="flex justify-between p-8 bg-surface text-text-primary dark:bg-dark-surface dark:text-dark-text-primary">
      <h1 className="text-2xl">ClimArselt</h1>
      <div className="flex gap-2">
        <button onClick={toggleTheme}>
          darkmode: {theme == "light" ? "light" : "dark"}
        </button>
        <button>celsius</button>
      </div>
    </header>
  );
}

export default Header;
