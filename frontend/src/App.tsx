import MainPage from "./pages";

export default function App() {
  return (
    <div
      className="flex min-h-[100dvh] w-full overflow-x-hidden bg-black-1"
      style={{
        minWidth: "100lvw",
        maxWidth: "100lvw",
      }}
    >
      <MainPage />
    </div>
  );
}
