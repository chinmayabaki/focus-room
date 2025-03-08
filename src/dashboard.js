"use client";

import { logoutUser } from "./firebaseConfig";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login"); // Redirect to login after logout
  };

  return (
    <div>
      <h1>Welcome to Focus Room</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
