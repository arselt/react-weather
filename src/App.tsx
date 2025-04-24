import Header from "./components/Header.tsx";

function App() {
  return (
    <>
      <Header />
      <main className="flex flex-col p-8 min-h-screen bg-bg text-text-primary dark:bg-dark-bg dark:text-dark-text-primary h-v">
        <h2 className="text-2xl text-center">
          Clima
        </h2>
      </main>
    </>
  )
}

export default App
