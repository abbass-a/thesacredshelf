export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#A67C2E]/30 border-t-[#A67C2E] rounded-full animate-spin"></div>
        <p className="text-[#A67C2E] font-serif font-medium tracking-widest text-sm uppercase animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
