import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-[56px] w-full items-center justify-between border-b bg-canvas px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          SPOT 10S
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search size={20} />
        </Button>
        <Button asChild className="rounded-full bg-ink hover:bg-ink/90 text-canvas px-4">
          <Link href="/contribute" className="flex items-center gap-2">
            <Plus size={18} />
            <span className="hidden md:inline">Đóng góp</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
