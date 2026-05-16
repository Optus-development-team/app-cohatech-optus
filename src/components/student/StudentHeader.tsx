interface StudentHeaderProps {
  userName: string;
}

export default function StudentHeader({ userName }: StudentHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Hola, <span className="text-[#a78bfa]">{userName}</span>
        </h1>
        <p className="text-gray-400 mt-1">Gestiona tu presupuesto estudiantil</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] flex items-center justify-center text-white font-bold text-lg">
        {userName.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}