export default function Avatar({ initials, color = "#4A7C59", size = 32, textColor = "#fff" }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid #fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        flexShrink: 0,
        background: color,
        color: textColor,
      }}
    >
      {initials}
    </div>
  );
}