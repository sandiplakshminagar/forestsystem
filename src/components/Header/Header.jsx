export default function Header() {
  return (
    <header className="bg-[#0fa4af] text-white shadow">
      <div className=" mx-auto py-3 flex flex-col ml-12">
        <h1 className="text-4xl sm:text-4xl font-bold tracking-wide leading-tight">
          Forest Monitoring System
        </h1>
        <p
          className="text-[20px] sm:text-[20px]
 text-green-100 mt-0.5 leading-tight"
        >
          Welcome to Forest Monitoring Dashboard
        </p>
      </div>
    </header>
  );
}
