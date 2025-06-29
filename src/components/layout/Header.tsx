"use client";
import { useRouter } from "next/navigation";
const Header = () => {
  const router = useRouter();
  return (
    <div className=" fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="h-20 w-full px-5 py-3 flex flex-row justify-between items-center">
        {/* 回到首頁 */}
        <div
          className="text-2xl font-bold text-party-purple cursor-pointer"
          onClick={() => router.replace("/")}
        >
          Party Game
        </div>
        {/* <div />
        <div></div>
        <div>userId</div> */}
      </div>
    </div>
  );
};

export default Header;
