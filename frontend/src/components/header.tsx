export default function Header() {
  const navItems = [
    { label: "Home", route: "/home" },
    { label: "Internships", route: "/games" },
    { label: "Logout", route: "/" },
  ];
  return (
    <header>
      <nav>
        <div className="flex w-screen pl-20 pr-20 justify-between p-4 bg-[#F4F4F5] border-b-2 border-l-sky-100 text-black fixed top-0 left-0 z-50">
          <div className="flex items-center space-x-4">
            <img
              src="https://img.freepik.com/premium-vector/apply-now-button-blue-frame-speech-bubble-button-icon-stamp-logo-vector-illustration_567423-780.jpg"
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold">ApplyWise</span>
          </div>
          <ul className="flex space-x-10 items-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href=""
                  className="text-black font-semibold text-xl hover:text-gray-500 flex justify-center items-center"
                >
                  <div>{item.label}</div>
                </a>
              </li>
            ))}
            <li className="text-black font-semibold text-xl hover:text-gray-500 flex justify-center items-center hover:cursor-pointer">
              Mubeen Mohammed
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
