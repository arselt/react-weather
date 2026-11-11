function Header() {
  return (
    <header className="w-full bg-surface dark:bg-dark-surface border-b-2 border-text-primary dark:border-dark-text-primary shadow-[0_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_0px_0px_rgba(255,255,255,0.1)]">
      <div className="px-4">
        <div className="max-w-6xl mx-auto py-6">
          <h1 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary tracking-tight">
            ClimArselt
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
