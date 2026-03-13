export default function EmptyState({ icon: Icon, title, desc, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F4EF] flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#B8C0CC]" />
            </div>
            <p className="text-[14px] font-semibold text-[#0D1117] font-['DM_Sans'] mb-1">{title}</p>
            <p className="text-[12px] text-[#8A9BB0] font-['DM_Sans'] mb-4 max-w-xs">{desc}</p>
            {action}
        </div>
    );
}