export default function Avatar({ fname, lname, photoUrl, size = 10, onClick }) {
    const initials = `${(fname?.[0] || "").toUpperCase()}${(lname?.[0] || "").toUpperCase()}`;
    const px = size * 4;
    const style = { width: px, height: px };
    const cls = `rounded-xl overflow-hidden flex-shrink-0 ${onClick ? "cursor-pointer" : ""}`;

    if (photoUrl)
        return (
            <div className={cls} style={style} onClick={onClick}>
                <img src={photoUrl} alt={`${fname} ${lname}`} className="w-full h-full object-cover" />
            </div>
        );

    return (
        <div
            className={`${cls} bg-[#E8F2EB] flex items-center justify-center text-[#4A7C59] font-bold`}
            style={{ ...style, fontSize: size > 8 ? 14 : 11 }}
            onClick={onClick}
        >
            {initials || <Users size={size > 8 ? 16 : 12} />}
        </div>
    );
}
